export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  publish: boolean;
  brand?: string;
  image?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
