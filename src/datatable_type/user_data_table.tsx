import { Pencil, Trash2 } from "lucide-react";

export const usersColumns = [
  {},
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
    name: "Email vérifié",
    selector: (row) => row.isEmailVerified,
    sortable: true,
    cell: (row) => (
      <span className="font-medium text-gray-900">
        {row.isEmailVerified ? "Oui" : "Non"}
      </span>
    ),
  },
  {
    name: "Date de vérification",
    selector: (row) => row.emailVerifiedDate,
    sortable: true,
    cell: (row) => (
      <span className="font-medium text-gray-900">
        {new Date(row.emailVerifiedDate).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </span>
    ),
  },
  {
    name: "Date de création",
    selector: (row) => row.createdAt,
    sortable: true,
    cell: (row) => (
      <span className="font-medium text-gray-900">
        {new Date(row.createdAt).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </span>
    ),
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
