
export interface TransportPrice {
  id: number;
  city: string;
  city2: string | null;
  zip: string;
  state: string;
  port: string;
  price: number;
}

export interface ContainerPrice {
  id: number;
  port: string;
  vehicleType: string;
  price: number;
}

export const stateOptions = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const portOptions = [
  'PORT, NJ', 'PORT, TX', 'PORT, GA', 'PORT, FL', 'PORT, CA', 'PORT, WA', 'PORT, CAN'
];

export const vehicleTypeOptions = [
  'Sedan', 'Jeep', 'Long Jeep', 'Other', 'Motorcycle', 'GOODS', 'Mini-bus'
];
