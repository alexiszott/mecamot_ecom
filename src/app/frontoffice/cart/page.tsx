"use client";

import { useState } from "react";
import { Product } from "../../../type/product_type";
import { cartService } from "../../../lib/api";
import ProductCard from "../../../components/product_card";
import { useCart } from "../../context/cart_context";
import ProductCartCard from "../../../components/product_cart_card";
import { useRouter } from "next/navigation";

interface FilterState {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  sortBy: string;
  sortOrder: string;
}

export default function Cart() {
  const [loading, setLoading] = useState<boolean>(false);
  const { items } = useCart();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Mes Produits
          </h1>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Total :{" "}
            {items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
            {" €"}
          </h1>
          <button
            onClick={() => router.push("/frontoffice/checkout/shipping")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Passer à la caisse
          </button>
          <div className="space-y-4">
            {items.map(
              (item) => (
                console.log("Item:", item),
                (
                  <ProductCartCard
                    totalPrice={item.price * item.quantity}
                    quantity={item.quantity}
                    key={item.id}
                    product={item.product}
                    onRemoveFromCart={() =>
                      console.log("Ajouter au panier", item)
                    }
                    onChangeQuantity={() =>
                      console.log("Retirer du panier", item)
                    }
                    onViewDetails={() => console.log("Voir les détails", item)}
                  />
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
