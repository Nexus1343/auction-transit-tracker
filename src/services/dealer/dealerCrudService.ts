
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dealer } from "./types";

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
