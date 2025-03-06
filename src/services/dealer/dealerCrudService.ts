
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

export const updateDealer = async (dealer: Dealer, syncUserEmail: boolean = false): Promise<Dealer | null> => {
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
    
    // If syncUserEmail is true, we need to find and update the associated user
    if (syncUserEmail && dealer.email) {
      // First find if there's an associated user
      const { data: userData, error: userFindError } = await supabase
        .from('user_profile')
        .select('id, email')
        .eq('dealer_id', dealer.id)
        .maybeSingle();
      
      if (userFindError) {
        console.error('Error finding associated user:', userFindError);
      } else if (userData && userData.id) {
        // Update the user's email
        const { error: userUpdateError } = await supabase
          .from('user_profile')
          .update({ email: dealer.email })
          .eq('id', userData.id);
        
        if (userUpdateError) {
          console.error('Error updating user email:', userUpdateError);
          toast.error('Failed to sync user email');
        } else {
          toast.success('User email synchronized successfully');
        }
      }
    }
    
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
    
    // Check if dealer has associated users
    const { data: associatedUsers, error: userCheckError } = await supabase
      .from('user_profile')
      .select('id')
      .eq('dealer_id', id);
    
    if (userCheckError) throw userCheckError;
    
    if (associatedUsers && associatedUsers.length > 0) {
      toast.error('Cannot delete dealer with associated users');
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
