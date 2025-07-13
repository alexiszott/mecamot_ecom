"use client";

import { createContext, useContext, useState } from "react";
import { ShippingAddress } from "../../type/shipping_address";

type CheckoutContextType = {
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);

  return (
    <CheckoutContext.Provider value={{ shippingAddress, setShippingAddress }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
};
