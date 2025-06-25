export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categories: string;
  status: "active" | "archived" | "draft";
  image?: string;
  description: string;
  created_at: string;
  updated_at: string;
}
