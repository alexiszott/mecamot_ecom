import { Check, Pencil, Trash2, X } from "lucide-react";
import { convertFormatPrice } from "../app/utils/convert_money";

export const productsColumns = [
  {},
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
    name: "Catégorie",
    selector: (row) => row.category?.name || "",
    sortable: true,
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
        return <Check className={`w-8 h-8 text-green-500 `} />;
      } else {
        return <X className={`w-8 h-8 text-red-500`} />;
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
          onClick={() => row.onDelete(row.id)}
        >
          <Trash2 />
        </button>
      </div>
    ),
  },
];
