
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dealer, SubDealer } from "./types";

export const fetchDealers = async (): Promise<Dealer[]> => {
  try {
    // Fetch main dealers first
    const { data: dealersData, error: dealersError } = await supabase
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
        container_price_id
      `);
    
    if (dealersError) throw dealersError;
    
    if (!dealersData) return [];
    
    // Add username field to dealers (using email as fallback)
    const dealersWithUsername: Dealer[] = dealersData.map(dealer => ({
      ...dealer,
      username: dealer.email || null,
      subDealers: []  // Initialize empty subDealers array
    }));
    
    // Fetch sub-dealers for each dealer
    for (let dealer of dealersWithUsername) {
      const { data: subDealersData, error: subDealerError } = await supabase
        .from('sub_dealers')
        .select(`
          id, 
          name, 
          email, 
          password, 
          mobile, 
          dealer_fee, 
          dealer_id
        `)
        .eq('dealer_id', dealer.id || 0);
      
      if (subDealerError) {
        console.error('Error fetching sub-dealers:', subDealerError);
        continue; // Skip this dealer and continue with the next one
      }
      
      // Add username field to sub-dealers
      if (subDealersData) {
        dealer.subDealers = subDealersData.map(subDealer => ({
          ...subDealer,
          username: subDealer.email || null,
        }));
      }
    }
    
    return dealersWithUsername;
  } catch (error: any) {
    console.error('Error fetching dealers:', error);
    toast.error('Failed to fetch dealers');
    return [];
  }
};

export const fetchAllDealers = async (): Promise<Dealer[]> => {
  try {
    // Fetch main dealers
    const { data: mainDealersData, error: mainDealerError } = await supabase
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
        container_price_id
      `);
    
    if (mainDealerError) throw mainDealerError;
    
    // Add username field to dealers (using email as fallback)
    const mainDealers: Dealer[] = (mainDealersData || []).map(dealer => ({
      ...dealer,
      username: dealer.email || null,
      subDealers: []
    }));
    
    // Fetch sub-dealers from sub_dealers table
    const { data: subDealersData, error: subDealerError } = await supabase
      .from('sub_dealers')
      .select(`
        id, 
        name, 
        email, 
        password, 
        mobile, 
        dealer_fee, 
        dealer_id
      `);
    
    if (subDealerError) throw subDealerError;
    
    // Transform sub-dealers with parent dealer data
    const transformedSubDealers: Dealer[] = [];
    
    if (subDealersData) {
      for (const subDealer of subDealersData) {
        if (!subDealer.dealer_id) continue;
        
        // Find parent dealer data
        const parentDealer = mainDealers.find(d => d.id === subDealer.dealer_id);
        
        transformedSubDealers.push({
          ...subDealer,
          username: subDealer.email || null,
          buyer_id: null,
          buyer_id_2: null,
          dealer_fee_2: null,
          transport_price_id: null,
          container_price_id: null,
          parentDealerName: parentDealer?.name || '',
          parentDealerId: parentDealer?.id || 0,
          subDealers: []
        });
      }
    }
    
    // Combine main dealers and sub-dealers
    return [...mainDealers, ...transformedSubDealers];
  } catch (error: any) {
    console.error('Error fetching all dealers:', error);
    toast.error('Failed to fetch dealers');
    return [];
  }
};

export const addDealer = async (dealer: Dealer): Promise<Dealer | null> => {
  try {
    const { data, error } = await supabase
      .from('dealers')
      .insert({
        name: dealer.name,
        email: dealer.email,
        password: dealer.password,
        mobile: dealer.mobile,
        buyer_id: dealer.buyer_id,
        buyer_id_2: dealer.buyer_id_2,
        dealer_fee: dealer.dealer_fee || 0,
        dealer_fee_2: dealer.dealer_fee_2 || 0,
        transport_price_id: dealer.transport_price_id,
        container_price_id: dealer.container_price_id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Dealer added successfully');
    if (data) {
      return {
        ...data,
        username: data.email || null,
        subDealers: []
      };
    }
    return null;
  } catch (error: any) {
    console.error('Error adding dealer:', error);
    toast.error('Failed to add dealer');
    return null;
  }
};

export const updateDealer = async (dealer: Dealer): Promise<Dealer | null> => {
  if (!dealer.id) {
    toast.error('Dealer ID is required for updating');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('dealers')
      .update({
        name: dealer.name,
        email: dealer.email,
        password: dealer.password,
        mobile: dealer.mobile,
        buyer_id: dealer.buyer_id,
        buyer_id_2: dealer.buyer_id_2,
        dealer_fee: dealer.dealer_fee || 0,
        dealer_fee_2: dealer.dealer_fee_2 || 0,
        transport_price_id: dealer.transport_price_id,
        container_price_id: dealer.container_price_id
      })
      .eq('id', dealer.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Dealer updated successfully');
    if (data) {
      return {
        ...data,
        username: data.email || null,
        subDealers: dealer.subDealers || []
      };
    }
    return null;
  } catch (error: any) {
    console.error('Error updating dealer:', error);
    toast.error('Failed to update dealer');
    return null;
  }
};

export const deleteDealer = async (id: number): Promise<boolean> => {
  try {
    // First, check if dealer has sub-dealers
    const { data: subDealers, error: checkError } = await supabase
      .from('sub_dealers')
      .select('id')
      .eq('dealer_id', id);
    
    if (checkError) throw checkError;
    
    if (subDealers && subDealers.length > 0) {
      toast.error('Cannot delete dealer with sub-dealers');
      return false;
    }
    
    // Delete the dealer
    const { error } = await supabase
      .from('dealers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Dealer deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting dealer:', error);
    toast.error('Failed to delete dealer');
    return false;
  }
};
