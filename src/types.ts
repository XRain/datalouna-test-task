export interface SkinportItem {
  market_hash_name: string;
  suggested_price: number;
  min_price: number;
  tradable_min_price?: number | null;
  quantity: number;
  market_page: string;
  // ... other existing fields
} 