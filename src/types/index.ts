export interface User {
  id: number;
  username: string;
  balance: number;
  created_at: Date;
}

export interface SkinportItem {
  market_hash_name: string;
  currency: string;
  suggested_price: number;
  item_page: string;
  market_page: string;
  min_price: number | null;
  max_price: number | null;
  mean_price: number | null;
  median_price: number | null;
  quantity: number;
  created_at: number;
  updated_at: number;
}

export interface MarketplaceItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  created_at: Date;
} 