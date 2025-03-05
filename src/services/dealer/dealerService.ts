
import { supabase } from '@/integrations/supabase/client';
import { Dealer, SubDealer } from './types';

/**
 * Fetches a list of all dealers along with their subdealers
 */
export const getAllDealers = async (): Promise<Dealer[]> => {
  try {
    const { data: dealers, error } = await supabase
      .from('dealers')
      .select(`
        id,
        name,
        email,
        password,
        mobile,
        buyer_id,
        buyer_id_2,
        dealer_fee,
        dealer_fee_2,
        transport_price_id,
        container_price_id,
        user_id
      `);

    if (error) throw error;

    // We want to collect all dealer ids to get their subdealers
    const dealerIds = dealers.map(dealer => dealer.id);

    // Fetch all sub-dealers in a single query
    const { data: subDealers, error: subError } = await supabase
      .from('sub_dealers')
      .select('*')
      .in('dealer_id', dealerIds);

    if (subError) throw subError;

    // Group sub-dealers by dealer_id
    const subDealersByDealerId = subDealers.reduce((acc, subDealer) => {
      const dealerId = subDealer.dealer_id;
      if (!acc[dealerId]) {
        acc[dealerId] = [];
      }
      acc[dealerId].push(subDealer);
      return acc;
    }, {});

    // Join dealers with their subdealers
    const dealersWithSubDealers = dealers.map(dealer => ({
      ...dealer, 
      subDealers: subDealersByDealerId[dealer.id] || []
    }));

    return dealersWithSubDealers;
  } catch (error) {
    console.error('Error fetching dealers:', error);
    return [];
  }
};

/**
 * Fetches a single dealer along with their subdealers
 */
export const getDealerById = async (id: number): Promise<Dealer | null> => {
  try {
    const { data: dealer, error } = await supabase
      .from('dealers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Fetch sub-dealers for this dealer
    const { data: subDealers, error: subError } = await supabase
      .from('sub_dealers')
      .select('*')
      .eq('dealer_id', id);

    if (subError) throw subError;

    return {
      ...dealer,
      subDealers: subDealers || []
    };
  } catch (error) {
    console.error(`Error fetching dealer with id ${id}:`, error);
    return null;
  }
};

/**
 * Creates a new dealer, along with any subdealers
 */
export const createDealer = async (dealer: Dealer): Promise<Dealer | null> => {
  try {
    // Check if the dealer has a parent dealer
    let parentDealerName = null;
    if (dealer.dealer_id) {
      const { data: parent } = await supabase
        .from('dealers')
        .select('name')
        .eq('id', dealer.dealer_id)
        .single();
      
      if (parent) {
        parentDealerName = parent.name;
      }
    }

    // Extract and remove subdealers before inserting dealer
    const { subDealers, ...dealerData } = dealer;

    // Insert dealer
    const { data: newDealer, error } = await supabase
      .from('dealers')
      .insert([dealerData])
      .select()
      .single();

    if (error) throw error;

    // If successful and there are subdealers, insert them
    if (subDealers && subDealers.length > 0) {
      const subDealersWithDealerId = subDealers.map(subDealer => ({
        ...subDealer,
        dealer_id: newDealer.id
      }));

      const { error: subError } = await supabase
        .from('sub_dealers')
        .insert(subDealersWithDealerId);

      if (subError) throw subError;

      // Fetch the inserted subdealers
      const { data: insertedSubDealers } = await supabase
        .from('sub_dealers')
        .select('*')
        .eq('dealer_id', newDealer.id);

      return {
        ...newDealer,
        subDealers: insertedSubDealers || [],
        parentDealerName
      };
    }

    return {
      ...newDealer,
      subDealers: [],
      parentDealerName
    };
  } catch (error) {
    console.error('Error creating dealer:', error);
    return null;
  }
};

/**
 * Updates an existing dealer, along with any subdealers
 */
export const updateDealer = async (id: number, dealer: Dealer): Promise<Dealer | null> => {
  try {
    // Check if the dealer has a parent dealer
    let parentDealerName = null;
    if (dealer.dealer_id) {
      const { data: parent } = await supabase
        .from('dealers')
        .select('name')
        .eq('id', dealer.dealer_id)
        .single();
      
      if (parent) {
        parentDealerName = parent.name;
      }
    }

    // Extract and remove subdealers before updating dealer
    const { subDealers, ...dealerData } = dealer;

    // Update dealer
    const { data: updatedDealer, error } = await supabase
      .from('dealers')
      .update(dealerData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // If there are subdealers, handle them
    if (subDealers) {
      // First, delete existing subdealers
      const { error: deleteError } = await supabase
        .from('sub_dealers')
        .delete()
        .eq('dealer_id', id);

      if (deleteError) throw deleteError;

      // Then, insert new subdealers
      if (subDealers.length > 0) {
        const subDealersWithDealerId = subDealers.map(subDealer => ({
          ...subDealer,
          dealer_id: id
        }));

        const { error: subError } = await supabase
          .from('sub_dealers')
          .insert(subDealersWithDealerId);

        if (subError) throw subError;
      }

      // Fetch the new subdealers
      const { data: newSubDealers } = await supabase
        .from('sub_dealers')
        .select('*')
        .eq('dealer_id', id);

      return {
        ...updatedDealer,
        subDealers: newSubDealers || [],
        parentDealerName
      };
    }

    return {
      ...updatedDealer,
      subDealers: [],
      parentDealerName
    };
  } catch (error) {
    console.error(`Error updating dealer with id ${id}:`, error);
    return null;
  }
};

/**
 * Deletes a dealer along with their subdealers
 */
export const deleteDealer = async (id: number): Promise<boolean> => {
  try {
    // Delete subdealers (will be handled by cascading delete)
    // But we'll be explicit for clarity
    const { error: subError } = await supabase
      .from('sub_dealers')
      .delete()
      .eq('dealer_id', id);

    if (subError) throw subError;

    // Delete dealer
    const { error } = await supabase
      .from('dealers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error(`Error deleting dealer with id ${id}:`, error);
    return false;
  }
};
