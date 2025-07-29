export type Address = {
  firstName: string;
  lastName: string;
  streetAddress: string;
  complStreetAddress?: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
};

export type BillingAddress = Address & {
  company?: string;
  email?: string;
};

export type ShippingAddress = {
  shipping: Address;
  billing: BillingAddress;
  useSameAddress?: boolean;
};
