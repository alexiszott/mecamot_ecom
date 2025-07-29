"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { orderService, paymentService } from "../../../../lib/api";
import { useCart } from "../../../context/cart_context";
import { useCheckout } from "../../../context/checkout_context";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const { shippingAddress } = useCheckout();
  const { items } = useCart();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      if (shippingAddress === null) {
        throw new Error("Adresse de livraison non définie");
      }

      await orderService.createOrder(shippingAddress, items);

      const res = await paymentService.payment(items, shippingAddress);

      const sessionId = res.sessionId;

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe non chargé");

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        alert(error.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Chargement..." : "Payer maintenant"}
      </button>
    </div>
  );
}
