
import { supabase } from "@/integrations/supabase/client"
import { VehicleFormValues, VehicleDetails } from "../types/vehicleTypes"
import { useVehicleHistory } from "../hooks/useVehicleHistory"

export const saveVehicleDetails = async (
  vehicle: VehicleDetails,
  data: VehicleFormValues,
  setVehicle: (vehicle: VehicleDetails) => void
) => {
  const { addHistoryEvent } = useVehicleHistory(vehicle?.id || null)
  
  const updateData = {
    vin: data.vin,
    lot_number: data.lot_number,
    stock_number: data.stock_number,
    year: data.year,
    destination: data.destination,
    client_name: data.client_name,
    client_phone_number: data.client_phone_number,
    client_passport_number: data.client_passport_number,
    client_buyer_id: data.client_buyer_id,
    address: data.address,
    city: data.city,
    state: data.state,
    zip_code: data.zip_code,
    receiver_port_id: data.receiver_port_id > 0 ? data.receiver_port_id : null,
    warehouse_id: data.warehouse_id > 0 ? data.warehouse_id : null,
    gate_pass_pin: data.gate_pass_pin,
    is_sublot: data.is_sublot,
    manufacturer_id: data.manufacturer_id > 0 ? data.manufacturer_id : null,
    model_id: data.model_id > 0 ? data.model_id : null, 
    generation_id: data.generation_id > 0 ? data.generation_id : null,
    body_type_id: data.body_type_id > 0 ? data.body_type_id : null,
    has_key: data.has_key,
    highlights: data.highlights,
    auction_id: data.auction_id > 0 ? data.auction_id : null,
    auction_won_price: data.auction_won_price || null,
    auction_final_price: data.auction_final_price || null,
    auction_pay_date: data.auction_pay_date || null,
    purchase_date: data.purchase_date || null,
    dealer_id: data.dealer_id > 0 ? data.dealer_id : null,
    sub_dealer_id: data.sub_dealer_id > 0 ? data.sub_dealer_id : null,
    pay_due_date: data.pay_due_date || null
  };
  
  const { error } = await supabase
    .from('vehicles')
    .update(updateData)
    .eq('id', vehicle.id)
  
  if (error) {
    console.error('Supabase update error:', error);
    throw error;
  }
  
  try {
    await addHistoryEvent(vehicle.id, "Vehicle details updated")
    
    const { data: updatedVehicle, error: fetchError } = await supabase
      .from('vehicles')
      .select(`
        id,
        vin,
        lot_number,
        stock_number,
        year,
        destination,
        client_name,
        client_phone_number,
        client_passport_number,
        client_buyer_id,
        address,
        city,
        state,
        zip_code,
        receiver_port_id,
        warehouse_id,
        gate_pass_pin,
        is_sublot,
        manufacturer_id,
        model_id,
        generation_id,
        body_type_id,
        has_key,
        highlights,
        auction_id,
        dealer_id,
        sub_dealer_id,
        pay_due_date,
        auction_won_price,
        auction_final_price,
        auction_pay_date,
        purchase_date,
        manufacturer:manufacturer_id(name),
        model:model_id(name)
      `)
      .eq('id', vehicle.id)
      .single()
      
    if (fetchError) throw fetchError
      
    setVehicle(updatedVehicle)
    return updatedVehicle
  } catch (historyError) {
    console.error('Error updating history:', historyError)
    throw historyError
  }
}
