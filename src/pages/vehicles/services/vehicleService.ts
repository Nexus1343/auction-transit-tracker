
import { supabase } from "@/integrations/supabase/client";
import { VehicleDetails, VehicleFormValues } from "../types/vehicleTypes";

export const saveVehicleDetails = async (
  vehicle: VehicleDetails,
  formData: VehicleFormValues,
  setVehicle: React.Dispatch<React.SetStateAction<VehicleDetails | null>>
) => {
  // First, update the main vehicle details
  const { data: updatedVehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .update({
      vin: formData.vin,
      lot_number: formData.lot_number,
      stock_number: formData.stock_number,
      year: formData.year,
      destination: formData.destination,
      client_name: formData.client_name,
      client_phone_number: formData.client_phone_number,
      client_passport_number: formData.client_passport_number,
      client_buyer_id: formData.client_buyer_id,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zip_code,
      receiver_port_id: formData.receiver_port_id || null,
      warehouse_id: formData.warehouse_id || null,
      gate_pass_pin: formData.gate_pass_pin,
      is_sublot: formData.is_sublot,
      manufacturer_id: formData.manufacturer_id || null,
      model_id: formData.model_id || null,
      generation_id: formData.generation_id || null,
      body_type_id: formData.body_type_id || null,
      has_key: formData.has_key,
      highlights: formData.highlights,
      auction_id: formData.auction_id || null,
      dealer_id: formData.dealer_id || null,
      sub_dealer_id: formData.sub_dealer_id || null,
      pay_due_date: formData.pay_due_date || null,
      auction_won_price: formData.auction_won_price || null,
      auction_final_price: formData.auction_final_price || null,
      auction_pay_date: formData.auction_pay_date || null,
      purchase_date: formData.purchase_date || null,
    })
    .eq('id', vehicle.id)
    .select()
    .single();

  if (vehicleError) {
    console.error('Error updating vehicle:', vehicleError);
    throw new Error('Failed to update vehicle details');
  }

  // Next, update or insert land transportation data
  const { data: landTransportData, error: landTransportError } = await supabase
    .from('land_transportation')
    .upsert({
      vehicle_id: vehicle.id,
      storage_start_date: formData.storage_start_date || null,
      pickup_date: formData.pickup_date || null,
      pickup_date_status: formData.pickup_date_status,
      delivery_date: formData.delivery_date || null,
      delivery_date_status: formData.delivery_date_status,
      transport_listed_price: formData.transport_listed_price || null,
      balance_payment_time: formData.balance_payment_time || null,
      balance_payment_method: formData.balance_payment_method,
      storage_fee: formData.storage_fee || null,
      company_name: formData.company_name,
      mc_number: formData.mc_number,
      transporter_name: formData.transporter_name,
      transporter_phone: formData.transporter_phone,
      transporter_payment_date: formData.transporter_payment_date || null
    }, { onConflict: 'vehicle_id' })
    .select()
    .single();

  if (landTransportError && landTransportError.code !== 'PGRST116') {
    console.error('Error updating land transportation:', landTransportError);
    // Continue execution despite error
  }

  // Update or insert sea transportation data
  const { data: seaTransportData, error: seaTransportError } = await supabase
    .from('sea_transportation')
    .upsert({
      vehicle_id: vehicle.id,
      shipping_company_name: formData.shipping_company_name,
      shipping_line_id: formData.shipping_line_id || null,
      booking_number: formData.booking_number,
      container_number: formData.container_number,
      receiving_company: formData.receiving_company,
      container_load_date: formData.container_load_date || null,
      planned_arrival_date: formData.planned_arrival_date || null,
      container_entry_date: formData.container_entry_date || null,
      container_open_date: formData.container_open_date || null,
      green_date: formData.green_date || null
    }, { onConflict: 'vehicle_id' })
    .select()
    .single();

  if (seaTransportError && seaTransportError.code !== 'PGRST116') {
    console.error('Error updating sea transportation:', seaTransportError);
    // Continue execution despite error
  }

  // Combine all data for state update
  const combinedData = {
    ...updatedVehicle,
    ...(landTransportData || {}),
    ...(seaTransportData || {})
  };

  // Update the vehicle state with the new data
  setVehicle(combinedData);

  return combinedData;
};
