import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dealer, SubDealer } from "./types";

export const fetchDealers = async (): Promise<Dealer[]> => {
  try {
    const { data, error } = await supabase
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
        dealer_id
      `)
      .is('dealer_id', null);
    
    if (error) throw error;
    
    // Fetch sub-dealers
    for (let dealer of data || []) {
      const { data: subDealers, error: subDealerError } = await supabase
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
        .eq('dealer_id', dealer.id);
      
      if (subDealerError) throw subDealerError;
      
      dealer.subDealers = subDealers || [];
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching dealers:', error);
    toast.error('Failed to fetch dealers');
    return [];
  }
};

export const fetchAllDealers = async (): Promise<Dealer[]> => {
  try {
    // Fetch main dealers
    const { data: mainDealers, error: mainDealerError } = await supabase
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
        dealer_id
      `)
      .is('dealer_id', null);
    
    if (mainDealerError) throw mainDealerError;
    
    // Fetch sub-dealers
    const { data: subDealers, error: subDealerError } = await supabase
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
        dealer_id,
        parent:dealers!dealers_dealer_id_fkey(name, id)
      `)
      .not('dealer_id', 'is', null);
    
    if (subDealerError) throw subDealerError;
    
    // Transform sub-dealers
    const transformedSubDealers = subDealers.map(subDealer => ({
      ...subDealer,
      parentDealerName: subDealer.parent?.name || '',
      parentDealerId: subDealer.parent?.id || 0
    }));
    
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
        container_price_id: dealer.container_price_id,
        dealer_id: null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Dealer added successfully');
    return data;
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
    return data;
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
      .from('dealers')
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
