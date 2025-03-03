
export interface VehicleDetails {
  id: number
  vin: string
  lot_number: string
  year: number
  manufacturer: {
    name: string
  }
  model: {
    name: string
  }
  stock_number?: string
  body_type_id?: number
  has_key?: boolean
  highlights?: string
  destination?: string
  client_name?: string
  client_phone_number?: string
  client_passport_number?: string
  client_buyer_id?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  receiver_port_id?: number
  warehouse_id?: number
  gate_pass_pin?: string
  is_sublot?: boolean
  manufacturer_id?: number
  model_id?: number
  generation_id?: number
  auction_id?: number
  dealer_id?: number
  sub_dealer_id?: number
  pay_due_date?: string
  auction_won_price?: number
  auction_final_price?: number
  auction_pay_date?: string
  purchase_date?: string
  storage_start_date?: string
  pickup_date?: string
  pickup_date_status?: string
  delivery_date?: string
  delivery_date_status?: string
  transport_listed_price?: number
  balance_payment_time?: string
  balance_payment_method?: string
  storage_fee?: number
  company_name?: string
  mc_number?: string
  transporter_name?: string
  transporter_phone?: string
  transporter_payment_date?: string
  shipping_company_name?: string
  shipping_line_id?: number
  booking_number?: string
  container_number?: string
  receiving_company?: string
  container_load_date?: string
  planned_arrival_date?: string
  container_entry_date?: string
  container_open_date?: string
  green_date?: string
}

export interface StatusHistoryEvent {
  date: string
  user: string
  action: string
}

export interface VehicleFormValues {
  vin: string
  lot_number: string
  stock_number: string
  year: number
  destination: string
  client_name: string
  client_phone_number: string
  client_passport_number: string
  client_buyer_id: string
  address: string
  city: string
  state: string
  zip_code: string
  receiver_port_id: number
  warehouse_id: number
  gate_pass_pin: string
  is_sublot: boolean
  manufacturer_id: number
  model_id: number
  generation_id: number
  body_type_id: number
  has_key: boolean
  highlights: string
  auction_id: number
  dealer_id: number
  sub_dealer_id: number
  pay_due_date: string
  auction_won_price: number
  auction_final_price: number
  auction_pay_date: string
  purchase_date: string
  storage_start_date: string
  pickup_date: string
  pickup_date_status: string
  delivery_date: string
  delivery_date_status: string
  transport_listed_price: number
  balance_payment_time: string
  balance_payment_method: string
  storage_fee: number
  company_name: string
  mc_number: string
  transporter_name: string
  transporter_phone: string
  transporter_payment_date: string
  shipping_company_name: string
  shipping_line_id: number
  booking_number: string
  container_number: string
  receiving_company: string
  container_load_date: string
  planned_arrival_date: string
  container_entry_date: string
  container_open_date: string
  green_date: string
}

export interface SectionsData {
  transport: any | null
  dealer: any | null
  documents: any | null
  auction: any | null
  landTransport: any | null
  seaTransport: any | null
}
