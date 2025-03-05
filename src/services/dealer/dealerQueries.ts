
import { supabase } from '@/integrations/supabase/client';
import { Dealer, SubDealer } from './types';
import { toast } from 'sonner';

/**
 * Fetches all dealers from the database
 */
export const fetchDealers = async (): Promise<Dealer[]> => {
  try {
    const { data: dealers, error } = await supabase
      .from('dealers')
      .select('*')
      .order('name');

    if (error) throw error;

    // Fetch subdealers for all dealers
    const dealerIds = dealers.map(dealer => dealer.id);
    
    let subDealers: SubDealer[] = [];
    if (dealerIds.length > 0) {
      const { data: subDealerData, error: subError } = await supabase
        .from('sub_dealers')
        .select('*')
        .in('dealer_id', dealerIds);
        
      if (!subError && subDealerData) {
        subDealers = subDealerData;
      }
    }

    // Map subdealers to their parent dealers
    const dealersWithSubdealers = dealers.map(dealer => {
      const linkedSubDealers = subDealers.filter(sub => sub.dealer_id === dealer.id);
      return {
        ...dealer,
        subDealers: linkedSubDealers
      };
    });

    return dealersWithSubdealers;
  } catch (error) {
    console.error('Error fetching dealers:', error);
    return [];
  }
};

/**
 * Add a new dealer to the database
 */
export const addDealer = async (dealer: Dealer): Promise<Dealer | null> => {
  try {
    const { data, error } = await supabase
      .from('dealers')
      .insert([
        {
          name: dealer.name,
          email: dealer.email,
          password: dealer.password,
          mobile: dealer.mobile,
          buyer_id: dealer.buyer_id,
          buyer_id_2: dealer.buyer_id_2,
          dealer_fee: dealer.dealer_fee,
          dealer_fee_2: dealer.dealer_fee_2,
          transport_price_id: dealer.transport_price_id,
          container_price_id: dealer.container_price_id,
          dealer_id: dealer.dealer_id
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    // Add any subdealers if they exist
    if (dealer.subDealers && dealer.subDealers.length > 0 && data.id) {
      const subDealersToInsert = dealer.subDealers.map(sub => ({
        ...sub,
        dealer_id: data.id
      }));
      
      const { error: subError } = await supabase
        .from('sub_dealers')
        .insert(subDealersToInsert);
      
      if (subError) throw subError;
    }
    
    return data;
  } catch (error) {
    console.error('Error adding dealer:', error);
    return null;
  }
};
