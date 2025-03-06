
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
    
    // Initialize dealers with subDealers array
    const dealersWithSubDealers: Dealer[] = dealersData.map(dealer => ({
      ...dealer,
      subDealers: []
    }));
    
    // Fetch sub-dealers for each dealer
    for (let dealer of dealersWithSubDealers) {
      if (!dealer.id) continue;
      
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
        .eq('dealer_id', dealer.id);
      
      if (subDealerError) {
        console.error('Error fetching sub-dealers:', subDealerError);
        continue; // Skip this dealer and continue with the next one
      }
      
      // Add sub-dealers to the dealer
      if (subDealersData) {
        dealer.subDealers = subDealersData;
      }
    }
    
    return dealersWithSubDealers;
  } catch (error: any) {
    console.error('Error fetching dealers:', error);
    toast.error('Failed to fetch dealers');
    return [];
  }
};
