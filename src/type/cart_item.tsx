import { Cart } from "./cart_type";
import { Product } from "./product_type";

export interface CartItem {
  id: string;
  cart: Cart;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}
