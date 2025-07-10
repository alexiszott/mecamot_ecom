"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Product } from "../../../type/product_type";
import { Category } from "../../../type/category_type";
import { categoriesService, productService } from "../../../lib/api";
import ProductCard from "../../../components/product_card";
import { PaginationData } from "../../../type/pagination_type";
import Pagination from "../../../components/pagination";
import PriceRangeSlider from "../../../components/ranger_slide";
import { useCart } from "../../context/cart_context";

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

export default function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProductCart, setLoadingProductCart] = useState(true);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const { addItemToCart, fetchCart } = useCart();

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
    sortBy: "name",
    sortOrder: "asc",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.currentPage,
        limit: limit,
        search: filters.search,
        category: filters.category,
        brand: filters.brand,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        stockFilter: filters.inStock ? "in_stock" : "all",
      };

      const response = await productService.fetchProductsPaginated(params);

      if (response.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesService.fetchCategories();
      if (!response || !Array.isArray(response.data)) {
        setCategories([]);
      } else {
        setCategories(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Effect pour écouter les changements de pagination
  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, limit]);

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | boolean
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
      sortBy: "name",
      sortOrder: "asc",
    });
  };

  const handleAddToCart = async (product: Product) => {
    await addItemToCart(product.id, 1);
    await fetchCart();
  };

  const handleViewDetails = (product: Product) => {
    console.log("View details:", product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nos Produits</h1>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Filter className="h-5 w-5" />
                Filtres
              </button>
            </div>

            {/* Filter Panel */}
            <div
              className={`space-y-6 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              {/* Search Bar */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-3">Rechercher</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-3">Trier par</h3>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-");
                    handleFilterChange("sortBy", sortBy);
                    handleFilterChange("sortOrder", sortOrder);
                  }}
                  className="w-full text-black p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="name-asc">Nom (A-Z)</option>
                  <option value="name-desc">Nom (Z-A)</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="created_at-desc">Plus récents</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-3">Catégorie</h3>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full p-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-3">Prix</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <PriceRangeSlider
                      minPrice={parseInt(filters.minPrice) || 0}
                      maxPrice={parseInt(filters.maxPrice) || 1000}
                      onChange={([min, max]) => {
                        handleFilterChange("minPrice", String(min));
                        handleFilterChange("maxPrice", String(max));
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-3">Marque</h3>
                <input
                  type="text"
                  placeholder="Nom de la marque"
                  value={filters.brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="w-full text-black p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Stock Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Disponibilité
                </h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) =>
                      handleFilterChange("inStock", e.target.checked)
                    }
                    className="rounded text-black border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    En stock uniquement
                  </span>
                </label>
              </div>

              <button
                onClick={clearFilters}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                {pagination.totalItems} produit
                {pagination.totalItems > 1 ? "s" : ""} trouvé
              </p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                {/* Products Display  */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={"grid"}
                        onAddToCart={handleAddToCart}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        viewMode={"list"}
                        onAddToCart={handleAddToCart}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}

                {/* No Products Found */}
                {products.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucun produit trouvé
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Essayez de modifier vos critères de recherche
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}

                <Pagination
                  pagination={{
                    currentPage: pagination.currentPage,
                    totalPages: pagination.totalPages,
                    totalItems: pagination.totalItems,
                    hasPrevPage: pagination.hasPrevPage,
                    hasNextPage: pagination.hasNextPage,
                  }}
                  limit={limit}
                  setPagination={(value: any) => {
                    if (typeof value === "function") {
                      setPagination(value);
                    } else {
                      setPagination((prev) => ({
                        ...prev,
                        ...value,
                      }));
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function addItemToCart() {
  throw new Error("Function not implemented.");
}
function showToast(arg0: { type: string; message: string }) {
  throw new Error("Function not implemented.");
}
