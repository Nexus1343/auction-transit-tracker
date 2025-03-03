
import { supabase } from "@/integrations/supabase/client"
import { VehicleFormValues, VehicleDetails } from "../types/vehicleTypes"
import { useVehicleHistory } from "../hooks/useVehicleHistory"

export const saveVehicleDetails = async (
  vehicle: VehicleDetails,
  data: VehicleFormValues,
  setVehicle: (vehicle: VehicleDetails) => void
) => {
  const { addHistoryEvent } = useVehicleHistory(vehicle?.id || null)
  
  // Prepare vehicle data
  const vehicleData = {
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
  
  // Update the vehicle record
  const { error: vehicleError } = await supabase
    .from('vehicles')
    .update(vehicleData)
    .eq('id', vehicle.id)
  
  if (vehicleError) {
    console.error('Supabase vehicle update error:', vehicleError);
    throw vehicleError;
  }
  
  // Prepare land transportation data
  const landTransportData = {
    vehicle_id: vehicle.id,
    storage_start_date: data.storage_start_date || null,
    pickup_date: data.pickup_date || null,
    pickup_date_status: data.pickup_date_status || null,
    delivery_date: data.delivery_date || null,
    delivery_date_status: data.delivery_date_status || null,
    transport_listed_price: data.transport_listed_price || null,
    balance_payment_time: data.balance_payment_time || null,
    balance_payment_method: data.balance_payment_method || null,
    storage_fee: data.storage_fee || null,
    company_name: data.company_name || null,
    mc_number: data.mc_number || null,
    transporter_name: data.transporter_name || null,
    transporter_phone: data.transporter_phone || null,
    transporter_payment_date: data.transporter_payment_date || null
  };
  
  // Check if land transportation record exists
  const { data: existingLandTransport, error: checkError } = await supabase
    .from('land_transportation')
    .select('id')
    .eq('vehicle_id', vehicle.id)
    .maybeSingle();
  
  if (checkError) {
    console.error('Error checking land transport data:', checkError);
  }
  
  // Update or insert land transportation data
  if (existingLandTransport) {
    const { error: landTransportError } = await supabase
      .from('land_transportation')
      .update(landTransportData)
      .eq('id', existingLandTransport.id);
      
    if (landTransportError) {
      console.error('Land transportation update error:', landTransportError);
      throw landTransportError;
    }
  } else {
    // Only insert if we have some data to save
    const hasLandTransportData = Object.values(landTransportData).some(value => 
      value !== null && value !== '' && value !== 0);
      
    if (hasLandTransportData) {
      const { error: landTransportError } = await supabase
        .from('land_transportation')
        .insert(landTransportData);
        
      if (landTransportError) {
        console.error('Land transportation insert error:', landTransportError);
        throw landTransportError;
      }
    }
  }
  
  try {
    await addHistoryEvent(vehicle.id, "Vehicle details updated")
    
    // Fetch the updated vehicle with related data
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
    
    // Get land transportation data
    const { data: landTransportData, error: landTransportFetchError } = await supabase
      .from('land_transportation')
      .select(`
        storage_start_date,
        pickup_date,
        pickup_date_status,
        delivery_date,
        delivery_date_status,
        transport_listed_price,
        balance_payment_time,
        balance_payment_method,
        storage_fee,
        company_name,
        mc_number,
        transporter_name,
        transporter_phone,
        transporter_payment_date
      `)
      .eq('vehicle_id', vehicle.id)
      .maybeSingle();
      
    if (landTransportFetchError) {
      console.error('Error fetching updated land transport data:', landTransportFetchError);
    }
    
    // Combine the data
    const combinedData = {
      ...updatedVehicle,
      ...(landTransportData || {})
    };
    
    setVehicle(combinedData)
    return combinedData
  } catch (historyError) {
    console.error('Error updating history:', historyError)
    throw historyError
  }
}
