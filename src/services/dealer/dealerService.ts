
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dealer } from "./types";

export const fetchDealers = async (): Promise<Dealer[]> => {
  try {
    const { data: dealers, error } = await supabase
      .from('dealers')
      .select('*, sub_dealers(*)');
    
    if (error) throw error;

    // Transform the data to match our interface
    return dealers.map(dealer => ({
      ...dealer,
      subDealers: dealer.sub_dealers || []
    }));
  } catch (error: any) {
    console.error('Error fetching dealers:', error);
    toast.error('Failed to load dealers');
    return [];
  }
};

export const addDealer = async (dealer: Dealer): Promise<Dealer | null> => {
  try {
    const { data, error } = await supabase
      .from('dealers')
      .insert({
        name: dealer.name,
        username: dealer.username,
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
    // Check if this is a sub-dealer by checking dealer_id
    if (dealer.dealer_id) {
      // This is a sub-dealer, use subDealerService to update it
      const { updateSubDealer } = await import('./subDealerService');
      return updateSubDealer(dealer);
    } else {
      // This is a regular dealer
      const { data, error } = await supabase
        .from('dealers')
        .update({
          name: dealer.name,
          username: dealer.username,
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
    }
  } catch (error: any) {
    console.error('Error updating dealer:', error);
    toast.error('Failed to update dealer');
    return null;
  }
};

export const deleteDealer = async (id: number): Promise<boolean> => {
  try {
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
