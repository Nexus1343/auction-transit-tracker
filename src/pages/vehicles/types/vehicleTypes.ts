
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
  destination?: string
  client_name?: string
  client_phone_number?: string
  client_passport_number?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  receiver_port_id?: number
  warehouse_id?: number
  gate_pass_pin?: string
  is_sublot?: boolean
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
  address: string
  city: string
  state: string
  zip_code: string
  receiver_port_id: number
  warehouse_id: number
  gate_pass_pin: string
  is_sublot: boolean
}

export interface SectionsData {
  transport: any | null
  dealer: any | null
  documents: any | null
}
