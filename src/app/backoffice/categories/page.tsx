"use client";
import { useState, useEffect } from "react";
import { Package, Search, Plus, Minus } from "lucide-react";
import { useAuth } from "../../context/auth_context";
import { categoriesService } from "../../../lib/api";
import { PaginationData } from "../../../type/pagination_type";
import DataTable from "react-data-table-component";
import { ToastProvider, useToast } from "../../../components/toast_provider";
import SidebarLayout from "../../../components/sidebar_layout";
import DeleteConfirmationModal from "../../../modal/delete_confirmation";
import { Category } from "../../../type/category_type";
import { categoriesColumns } from "../../../datatable_type/category_data_table";
import EditCategoryModal from "../../../modal/categories/edit_category";
import AddCategoryModal from "../../../modal/categories/add_category";

export default function CategoriesPage() {
  return (
    <ToastProvider>
      <SidebarLayout>
        <CategoriesPageContent />
      </SidebarLayout>
    </ToastProvider>
  );
}

function CategoriesPageContent() {
  const { showToast } = useToast();
  const { user, loading } = useAuth();

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [loadingCategories, setLoadingCategories] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [deletingCategory, setDeletingCategory] = useState<Category[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [limit, setLimit] = useState(10);
  const [toggledClearRows, setToggleClearRows] = useState(false);

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

  const clearAllFilters = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  const handleDeleteMultipleProducts = async () => {
    try {
      if (deletingCategory.length > 0) {
        setDeletingCategory(deletingCategory);
        setShowDeleteModal(true);
      } else {
        showToast("Aucune catégorie sélectionnée", "warning");
      }
    } catch (error) {
      showToast("Erreur lors de la suppression des produits", "error");
    }
  };

  const handleDeleteProduct = async (category: Category) => {
    try {
      setDeletingCategory([category]);
      setShowDeleteModal(true);
    } catch (error) {
      showToast("Erreur lors de la suppression du produit", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      const idsToDelete = deletingCategory.map((p) => p.id);

      if (idsToDelete.length === 0) {
        showToast(
          "Aucune catégorie sélectionnée pour la suppression",
          "warning"
        );
        return;
      } else if (idsToDelete.length > 100) {
        showToast(
          "Vous ne pouvez pas supprimer plus de 100 catégories à la fois",
          "warning"
        );
        return;
      } else if (idsToDelete.length > 1) {
        const response = await categoriesService.archiveCategories(idsToDelete);
        if (response.success) {
          showToast("Catégories supprimées avec succès", "success");
        } else {
          showToast("Erreur lors de la suppression des catégories", "error");
        }
      } else {
        const productId = idsToDelete[0];
        console.log("Deleting single category with ID:", productId);
        const response = await categoriesService.archiveCategory(productId);
        if (response.success) {
          showToast("Catégorie supprimé avec succès", "success");
        } else {
          showToast("Erreur lors de la suppression des catégories", "error");
        }
      }
      setShowDeleteModal(false);
      setDeletingCategory([]);
      refresh();
    } catch (error) {
      showToast("Erreur lors de la suppression", "error");
    }
  };

  const handleEdit = async (category) => {
    try {
      setSelectedCategory(category);
      setShowEditModal(true);
    } catch (error) {
      console.error("Erreur lors de la suppression des categories:", error);
    }
  };

  const handleChange = ({ selectedRows }) => {
    setDeletingCategory(selectedRows);
  };

  const handleCategoryAdded = async () => {
    await refresh();
    showToast("Categories ajouté avec succès", "success");
  };

  const refresh = async () => {
    setToggleClearRows(!toggledClearRows);
    await fetchCategories();
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const params = {
        page: pagination.currentPage,
        limit: limit,
        search: debouncedSearchTerm,
      };

      const response = await categoriesService.fetchPaginatedCategories(params);

      console.log("Response from fetchPaginatedCategories:", response);

      const categoriesEnrichis = response.data.data.map((category) => ({
        ...category,
        onEdit: handleEdit,
        onDelete: handleDeleteProduct,
      }));

      if (response.success) {
        setCategories(categoriesEnrichis || []);
        setPagination(response.data.pagination);
      } else {
        showToast("Erreur lors de la récupération des categories", "error");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des categories:", error);
      showToast("Erreur lors de la récupération des categories", "error");
    } finally {
      setLoadingCategories(false);
    }
  };

  const hasActiveFilters = searchTerm;

  useEffect(() => {
    if (pagination.currentPage !== 1) {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (user) {
      fetchCategories();
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
      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (nom, description)..."
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
                Categories ({pagination.totalItems})
              </h3>
              {hasActiveFilters && (
                <p className="text-sm text-gray-600 mt-1">
                  {pagination.totalItems} résultat
                  {pagination.totalItems > 1 ? "s" : ""} trouvé
                  {pagination.totalItems > 1 ? "s" : ""} avec les filtres actifs
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              {deletingCategory.length > 0 && (
                <button
                  onClick={handleDeleteMultipleProducts}
                  key="delete"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Supprimer la sélection
                </button>
              )}
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle catégorie
              </button>
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
          progressPending={loadingCategories}
          columns={categoriesColumns}
          data={categories}
          selectableRows
          onSelectedRowsChange={handleChange}
          clearSelectedRows={toggledClearRows}
          noDataComponent={
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters
                  ? "Aucune catégorie trouvé"
                  : "Aucune catégorie"}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {hasActiveFilters
                  ? "Essayez de modifier vos critères de recherche ou d'effacer les filtres."
                  : "Commencez par ajouter vos première catégories."}
              </p>
              {hasActiveFilters ? (
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Effacer les filtres
                </button>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une catégorie
                </button>
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
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingCategory([]);
        }}
        title={
          deletingCategory.length > 1
            ? `Supprimer ${deletingCategory.length} catégories ?`
            : `Supprimer la catégorie ?`
        }
        message={
          deletingCategory.length > 1
            ? `Vous êtes sur le point de supprimer ${deletingCategory.length} catégories. Cette action est irréversible.`
            : `Vous êtes sur le point de supprimer "${deletingCategory[0]?.name}". Cette action est irréversible.`
        }
        itemName={deletingCategory.map((p) => p.name).join(", ")}
        onConfirm={confirmDelete}
      />

      <AddCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdded={handleCategoryAdded}
      />

      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdated={handleCategoryAdded}
        category={selectedCategory}
      />
    </>
  );
}
