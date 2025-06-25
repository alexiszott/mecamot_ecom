export type PaginationProps = {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
  limit: number;
  setPagination: React.Dispatch<React.SetStateAction<any>>;
};
