
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dealer, SubDealer } from "./types";

export const addSubDealer = async (subDealer: SubDealer): Promise<SubDealer | null> => {
  try {
    const { data, error } = await supabase
      .from('sub_dealers')
      .insert({
        name: subDealer.name,
        email: subDealer.email,
        password: subDealer.password,
        mobile: subDealer.mobile,
        dealer_fee: subDealer.dealer_fee || 0,
        dealer_id: subDealer.dealer_id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Sub-dealer added successfully');
    return data;
  } catch (error: any) {
    console.error('Error adding sub-dealer:', error);
    toast.error('Failed to add sub-dealer');
    return null;
  }
};

export const updateSubDealer = async (dealer: Dealer): Promise<Dealer | null> => {
  if (!dealer.id) {
    toast.error('Sub-dealer ID is required for updating');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('sub_dealers')
      .update({
        name: dealer.name,
        email: dealer.email,
        password: dealer.password,
        mobile: dealer.mobile,
        dealer_fee: dealer.dealer_fee || 0,
        dealer_id: dealer.dealer_id
      })
      .eq('id', dealer.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Sub-dealer updated successfully');
    return {
      ...data,
      buyer_id: null,
      buyer_id_2: null,
      dealer_fee_2: null,
      transport_price_id: null,
      container_price_id: null
    };
  } catch (error: any) {
    console.error('Error updating sub-dealer:', error);
    toast.error('Failed to update sub-dealer');
    return null;
  }
};
