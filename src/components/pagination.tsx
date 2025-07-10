import React from "react";
import { PaginationProps } from "../type/pagination_props_type";

const Pagination = ({ pagination, limit, setPagination }: PaginationProps) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
      <div className="text-sm text-gray-700">
        Affichage de{" "}
        <span className="font-medium">
          {(pagination.currentPage - 1) * limit + 1}
        </span>{" "}
        à{" "}
        <span className="font-medium">
          {Math.min(pagination.currentPage * limit, pagination.totalItems)}
        </span>{" "}
        sur <span className="font-medium">{pagination.totalItems}</span>{" "}
        produits
        <span className="ml-2 text-xs text-gray-500">
          (Limite: {limit} par page)
        </span>
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
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>

        <span className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
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
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Pagination;
