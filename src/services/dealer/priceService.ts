
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
