
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Dealer {
  id?: number;
  name: string;
  username: string | null;
  password: string | null;
  mobile: string | null;
  buyer_id: string | null;
  buyer_id_2: string | null;
  dealer_fee: number | null;
  dealer_fee_2: number | null;
  transport_price_id: number | null;
  container_price_id: number | null;
  subDealers?: SubDealer[];
}

export interface SubDealer {
  id?: number;
  name: string;
  username: string | null;
  dealer_fee: number | null;
  dealer_id?: number | null;
  mobile?: string | null;
  password?: string | null;
}

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

export const fetchTransportPrices = async () => {
  try {
    const { data, error } = await supabase
      .from('transport_prices')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching transport prices:', error);
    toast.error('Failed to load transport prices');
    return [];
  }
};

export const fetchContainerPrices = async () => {
  try {
    const { data, error } = await supabase
      .from('container_prices')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching container prices:', error);
    toast.error('Failed to load container prices');
    return [];
  }
};
