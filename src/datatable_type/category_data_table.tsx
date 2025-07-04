import { Pencil, Trash2 } from "lucide-react";

export const categoriesColumns = [
  {},
  {
    name: "Nom",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Description",
    selector: (row) => row.description || "",
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
