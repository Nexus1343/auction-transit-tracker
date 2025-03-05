
export interface Dealer {
  id?: number;
  name: string;
  username: string | null;
  password: string | null;
  mobile: string | null;
  buyer_id: string | null;
  buyer_id_2: string | null;
  dealer_fee: number | null;
  dealer_fee_2: number | null;
  transport_price_id: number | null;
  container_price_id: number | null;
  subDealers?: SubDealer[];
  dealer_id?: number | null;
  parentDealerName?: string;
  parentDealerId?: number;
}

export interface SubDealer {
  id?: number;
  name: string;
  username: string | null;
  password: string | null;
  mobile: string | null;
  dealer_fee: number | null;
  dealer_id?: number | null;
}
