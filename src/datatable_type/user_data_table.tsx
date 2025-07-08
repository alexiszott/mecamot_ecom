import { Pencil, Eye } from "lucide-react";
import { formatDateTime, formatPhoneNumber } from "../app/utils/format";

export const usersColumns = [
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
    selector: (row) => {
      return formatPhoneNumber(row.phone ?? "");
    },
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Dernière connexion",
    selector: (row) => {
      return formatDateTime(row.lastLogin) || "Jamais";
    },
  },
  {
    name: "Dernière actvité",
    selector: (row) => {
      return formatDateTime(row.lastActivity) || "Jamais";
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
          className="text-blue-500 hover:text-blue-700"
          onClick={() => row.onDetails(row)}
        >
          <Eye />
        </button>
      </div>
    ),
  },
];
