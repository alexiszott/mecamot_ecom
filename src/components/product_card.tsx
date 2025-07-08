import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import { Product } from "../type/product_type";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export default function ProductCard({
  product,
  viewMode = "grid",
  onAddToCart,
  onViewDetails,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-sm">Pas d'image</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {product.name}
                </h3>

                {product.brand && (
                  <p className="text-gray-600 mb-2">Marque: {product.brand}</p>
                )}

                <p className="text-sm text-gray-600 mb-2">
                  {product.category?.name ?? "Aucune"}
                </p>

                {product.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <p className="text-sm text-gray-500">
                  Stock:{" "}
                  {product.stock > 0
                    ? `${product.stock} disponible${
                        product.stock > 1 ? "s" : ""
                      }`
                    : "Indisponible"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="text-xl font-bold text-green-700">
                  {formatPrice(product.price)}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDetails?.(product)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => onAddToCart?.(product)}
                    disabled={product.stock === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow group">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-sm">Pas d'image</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onViewDetails?.(product)}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {product.stock === 0 && (
            <span className="block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Rupture de stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-2">
          {product.category?.name ?? "Aucune"}
        </p>

        {product.brand && (
          <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-700">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock === 0}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Stock:{" "}
          {product.stock > 0
            ? `${product.stock} disponible${product.stock > 1 ? "s" : ""}`
            : "Indisponible"}
        </p>
      </div>
    </div>
  );
}
