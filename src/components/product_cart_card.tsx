import { ShoppingCart, Star, Eye, Heart, Minus } from "lucide-react";
import { Product } from "../type/product_type";

interface ProductCartCardProps {
  totalPrice: number;
  quantity: number;
  product: Product;
  onRemoveFromCart?: (product: Product) => void;
  onChangeQuantity?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export default function ProductCartCard({
  totalPrice,
  quantity,
  product,
  onRemoveFromCart,
  onChangeQuantity,
  onViewDetails,
}: ProductCartCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

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
          x
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {product.name}
              </h3>

              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                Quantity : {quantity}
              </h3>

              {product.brand && (
                <p className="text-gray-600 mb-2">Marque: {product.brand}</p>
              )}
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="text-xl font-bold text-green-700">
                {formatPrice(totalPrice)}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => onViewDetails?.(product)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => onRemoveFromCart?.(product)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
