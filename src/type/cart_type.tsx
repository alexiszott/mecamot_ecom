import { CartItem } from "./cart_item";

export interface Cart {
  id: string;
  items: CartItem[];
}
