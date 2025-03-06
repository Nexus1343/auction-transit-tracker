
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dealer } from "./types";

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
    
    // Initialize main dealers with subDealers array
    const mainDealers: Dealer[] = (mainDealersData || []).map(dealer => ({
      ...dealer,
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
        
        if (parentDealer) {
          transformedSubDealers.push({
            ...subDealer,
            buyer_id: null,
            buyer_id_2: null,
            dealer_fee_2: null,
            transport_price_id: null,
            container_price_id: null,
            parentDealerName: parentDealer.name || '',
            parentDealerId: parentDealer.id || 0,
            subDealers: []
          });
        }
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
