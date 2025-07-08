"use client";

import { useState } from "react";
import { Product } from "../../../type/product_type";
import { cartService } from "../../../lib/api";
import ProductCard from "../../../components/product_card";

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

export default function CarteItemsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await cartService.fetchCartItems();

      if (response.success) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    } finally {
      setLoading(false);
    }
  };

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
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols
          -3 lg:grid-cols-4 gap-6"
          >
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                viewMode="grid"
                onAddToCart={() => console.log("Ajouter au panier", item)}
                onViewDetails={() => console.log("Voir les détails", item)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
