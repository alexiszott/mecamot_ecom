"use client";

import { useRouter } from "next/navigation";
import CheckoutBreadcrumb from "../../../../components/checkout_breadcrum";
import { useCheckout } from "../../../context/checkout_context";
import { useEffect } from "react";

export default function PaymentPage() {
  const { shippingAddress } = useCheckout();
  const router = useRouter();

  useEffect(() => {
    if (!shippingAddress) {
      router.replace("/checkout/shipping");
    }
  }, [shippingAddress]);

  return (
    <div className="min-h-screen bg-gray-50 mt-6">
      <CheckoutBreadcrumb currentStep={3} />
    </div>
  );
}
