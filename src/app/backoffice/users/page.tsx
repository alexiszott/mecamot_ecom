"use client";
import { useState, useEffect } from "react";
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  DollarSign,
  XCircle,
  Minus,
} from "lucide-react";
import { useAuth } from "../../context/auth_context";
import {
  categoriesService,
  productService,
  statsService,
  userService,
} from "../../../lib/api";
import { Product } from "../../../type/product_type";
import { PaginationData } from "../../../type/pagination_type";
import AddProductModal from "../../../modal/products/add_product";
import DataTable from "react-data-table-component";
import StatsCard from "../../../components/stats_card";
import { ToastProvider, useToast } from "../../../components/toast_provider";
import SidebarLayout from "../../../components/sidebar_layout";
import DeleteConfirmationModal from "../../../modal/delete_confirmation";
import EditProductModal from "../../../modal/products/edit_product";
import { Category } from "../../../type/category_type";
import { usersColumns } from "../../../datatable_type/user_data_table";
import { User } from "../../../type/user_type";

export default function UsersPage() {
  return (
    <ToastProvider>
      <SidebarLayout>
        <UsersPageContent />
      </SidebarLayout>
    </ToastProvider>
  );
}

function UsersPageContent() {
  const { showToast } = useToast();
  const { user, loading } = useAuth();

  // Data states
  const [users, setUsers] = useState<User[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [limit, setLimit] = useState(10);
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);

  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalValue: 0,
  });

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  const handleDeleteProducts = async () => {
    try {
      setShowDeleteModal(true);
    } catch (error) {
      console.error("Erreur lors de la suppression des produits:", error);
      showToast("Erreur lors de la suppression des produits", "error");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      setShowDeleteModal(true);
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      showToast("Erreur lors de la suppression du produit", "error");
    }
  };

  const handleEdit = async (product) => {
    try {
      setSelectedProduct(product);
      setShowEditModal(true);
    } catch (error) {
      console.error("Erreur lors de la suppression des produits:", error);
    }
  };

  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const params = {
        page: pagination.currentPage,
        limit: limit,
        search: debouncedSearchTerm,
      };

      const response = await userService.fetchUsers(params);

      const usersEnrichis = response.data.data.map((user) => ({
        ...user,
        onEdit: handleEdit,
        onDelete: handleDeleteProduct,
      }));

      if (response.success) {
        setUsers(usersEnrichis || []);
        setPagination(response.data.pagination);
      } else {
        showToast("Erreur lors de la récupération des produits", "error");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      showToast("Erreur lors de la récupération des produits", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await statsService.productsStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      showToast("Erreur lors de la récupération des statistiques", "error");
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
  };

  const hasActiveFilters = searchTerm;

  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchStats();
    }
  }, [user, pagination.currentPage, limit, debouncedSearchTerm]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Redirection...</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total produits"
          data={[]}
          color={"blue"}
          icon={<Package className="w-6 h-6 text-blue-600" />}
        />

        <StatsCard
          title="Stock bas"
          data={[]}
          color={"orange"}
          icon={<AlertTriangle className="w-6 h-6 text-orange-600" />}
        />

        <StatsCard
          title="Ruptures"
          data={[]}
          color={"red"}
          icon={<XCircle className="w-6 h-6 text-red-600" />}
        />

        <StatsCard
          title="Valeur stock"
          data={[]}
          color={"green"}
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
        />
      </div>
      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Recherche par nom/marque/description */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (nom, marque, description)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Indicateurs de filtres actifs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              🗑️ Effacer tout
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Produits ({pagination.totalItems})
              </h3>
              {hasActiveFilters && (
                <p className="text-sm text-gray-600 mt-1">
                  {pagination.totalItems} résultat
                  {pagination.totalItems > 1 ? "s" : ""} trouvé
                  {pagination.totalItems > 1 ? "s" : ""} avec les filtres actifs
                </p>
              )}
            </div>
          </div>
        </div>

        <DataTable
          pagination
          paginationServer={true}
          paginationTotalRows={pagination.totalItems}
          paginationDefaultPage={pagination.currentPage}
          paginationPerPage={limit}
          onChangeRowsPerPage={(newLimit, page) => {
            setLimit(newLimit);
          }}
          onChangePage={(page) => {
            setPagination((prev) => ({ ...prev, currentPage: page }));
          }}
          striped
          highlightOnHover
          persistTableHead
          progressPending={loadingUsers}
          columns={usersColumns}
          data={users}
          selectableRows
          onSelectedRowsChange={handleChange}
          clearSelectedRows={toggledClearRows}
          noDataComponent={
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters ? "Aucun produit trouvé" : "Aucun produit"}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {hasActiveFilters
                  ? "Essayez de modifier vos critères de recherche ou d'effacer les filtres."
                  : "Commencez par ajouter vos premiers produits."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Effacer les filtres
                </button>
              ) : (
                <p className="text-gray-500 text-center mb-4">
                  Aucun utilisateurs trouvé.
                </p>
              )}
            </div>
          }
          customStyles={{
            headCells: {
              style: {
                fontSize: "20px",
                fontWeight: "600",
                paddingTop: "12px",
                paddingBottom: "12px",
                backgroundColor: "#f8fafc",
              },
            },
            cells: {
              style: {
                fontSize: "16px",
                paddingTop: "16px",
                paddingBottom: "16px",
                minHeight: "56px",
              },
            },
            rows: {
              style: {
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
                '& input[type="checkbox"]': {
                  transform: "scale(1.75)",
                  cursor: "pointer",
                },
              },
            },
            pagination: {
              style: {
                justifyContent: "center",
                alignContent: "center",
                fontSize: "16px",
                borderTop: "1px solid #e5e7eb",
                padding: "12px 16px",
              },
            },
            headRow: {
              style: {
                '& input[type="checkbox"]': {
                  transform: "scale(2)",
                },
              },
            },
          }}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setSelectedRows([])}
        title={`Supprimer ${selectedRows.length} produit${
          selectedRows.length > 1 ? "s" : ""
        }`}
        message={`Vous êtes sûr de vouloir supprimer ${
          selectedRows.length
        } produit${selectedRows.length > 1 ? "s" : ""} ?`}
        itemName={selectedRows.map((p) => p.name).join(", ")}
        onConfirm={handleDeleteProducts}
      />
    </>
  );
}
