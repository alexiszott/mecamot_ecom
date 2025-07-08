import { Check, Pencil, Trash2, X } from "lucide-react";
import { convertFormatPrice } from "../app/utils/convert_money";

export const productsColumns = [
  {
    name: "Nom",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Prix",
    selector: (row) => row.price,
    sortable: true,
    cell: (row) => {
      return (
        <span className="font-medium text-gray-900">
          {convertFormatPrice(row.price)}
        </span>
      );
    },
  },
  {
    name: "Stock",
    selector: (row) => row.stock,
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => row.stock <= 5,
        style: {
          backgroundColor: "rgba(254, 249, 195, 1)",
          color: "rgba(133, 77, 14, 1)",
        },
      },
      {
        when: (row) => row.stock == 0,
        style: {
          backgroundColor: "rgba(254, 226, 226, 1)",
          color: "rgba(153, 27, 27, 1)",
        },
      },
      {
        when: (row) => row.stock > 5,
        style: {
          backgroundColor: "rgba(219, 234, 254, 1)",
          color: "rgba(30, 64, 175, 1)",
        },
      },
    ],
  },
  {
    name: "Catégorie",
    selector: (row) => row.category?.name || "",
    sortable: true,
  },
  {
    name: "Code SKU",
    selector: (row) => row.sku,
  },
  {
    name: "Marque",
    selector: (row) => row.brand,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.isPublished,
    sortable: true,
    cell: (row) => {
      if (row.isPublished) {
        return (
          <div className="flex items-center justify-center bg-green-100 rounded-full p-2">
            <Check className={`w-5 h-5 text-green-800 `} />
          </div>
        );
      } else {
        return (
          <div className="flex items-center justify-center bg-red-100 rounded-full p-2">
            <X className={`w-5 h-5 text-red-800`} />
          </div>
        );
      }
    },
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="flex items-center gap-5">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => row.onEdit(row)}
        >
          <Pencil />
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => row.onDelete(row)}
        >
          <Trash2 />
        </button>
      </div>
    ),
  },
];
