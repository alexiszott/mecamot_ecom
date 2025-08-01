export type OrderInfo = {
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone: string;
  recipientName: string;
  cartItems: Array<{
    productId: string;
    quantity: number;
  }>;
  deliveryMethod?: string;
  notes?: string;
};
