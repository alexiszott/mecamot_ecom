import { Pencil, CircleUserRound, Eye } from "lucide-react";

export const usersColumns = [
  {
    cell: () => (
      <div className="flex items-center justify-center">
        <CircleUserRound
          className="w-10 h-10 rounded-full"
          strokeWidth={"1px"}
        />
      </div>
    ),
  },
  {
    name: "Nom",
    selector: (row) => row.firstname,
    sortable: true,
  },
  {
    name: "Prénom",
    selector: (row) => row.lastname,
    sortable: true,
  },
  {
    name: "Téléphone",
    selector: (row) => row.phone,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
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
          className="text-blue-500 hover:text-blue-700"
          onClick={() => row.onDetails(row)}
        >
          <Eye />
        </button>
      </div>
    ),
  },
];
