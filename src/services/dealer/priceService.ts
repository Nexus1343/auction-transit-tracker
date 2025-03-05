
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TransportPrice, ContainerPrice } from "@/pages/pricing/types";

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

export const addTransportPrice = async (price: Omit<TransportPrice, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('transport_prices')
      .insert([price])
      .select();
    
    if (error) throw error;
    toast.success('Transportation price added successfully');
    return data?.[0];
  } catch (error: any) {
    console.error('Error adding transport price:', error);
    toast.error('Failed to add transportation price');
    return null;
  }
};

export const updateTransportPrice = async (id: number, price: Omit<TransportPrice, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('transport_prices')
      .update(price)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    toast.success('Transportation price updated successfully');
    return data?.[0];
  } catch (error: any) {
    console.error('Error updating transport price:', error);
    toast.error('Failed to update transportation price');
    return null;
  }
};

export const deleteTransportPrice = async (id: number) => {
  try {
    const { error } = await supabase
      .from('transport_prices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Transportation price deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting transport price:', error);
    toast.error('Failed to delete transportation price');
    return false;
  }
};

export const addContainerPrice = async (price: Omit<ContainerPrice, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('container_prices')
      .insert([{
        port: price.port,
        vehicle_type: price.vehicleType,
        price: price.price
      }])
      .select();
    
    if (error) throw error;
    toast.success('Container price added successfully');
    return data?.[0];
  } catch (error: any) {
    console.error('Error adding container price:', error);
    toast.error('Failed to add container price');
    return null;
  }
};

export const updateContainerPrice = async (id: number, price: Omit<ContainerPrice, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('container_prices')
      .update({
        port: price.port,
        vehicle_type: price.vehicleType,
        price: price.price
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    toast.success('Container price updated successfully');
    return data?.[0];
  } catch (error: any) {
    console.error('Error updating container price:', error);
    toast.error('Failed to update container price');
    return null;
  }
};

export const deleteContainerPrice = async (id: number) => {
  try {
    const { error } = await supabase
      .from('container_prices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    toast.success('Container price deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting container price:', error);
    toast.error('Failed to delete container price');
    return false;
  }
};
