import React from "react";
import { PaginationProps } from "../type/pagination_props_type";

const Pagination = ({ pagination, limit, setPagination }: PaginationProps) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div className="text-sm text-gray-700">
        Affichage de {(pagination.currentPage - 1) * limit + 1} à{" "}
        {Math.min(pagination.currentPage * limit, pagination.totalItems)} sur{" "}
        {pagination.totalItems} produits
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage: prev.currentPage - 1,
            }))
          }
          disabled={!pagination.hasPrevPage}
          className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50"
        >
          Précédent
        </button>

        <span className="px-3 py-2 bg-blue-600 text-white rounded-lg">
          {pagination.currentPage} / {pagination.totalPages}
        </span>

        <button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage: prev.currentPage + 1,
            }))
          }
          disabled={!pagination.hasNextPage}
          className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Pagination;
