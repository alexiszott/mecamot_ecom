"use client";
import React, { useState } from "react";
import { BadgeCheck, BadgeX } from "lucide-react";
import ModalBase from "../shared/modal_base";
import { User } from "../../type/user_type";
import { parsePhoneNumber } from "react-phone-number-input";

interface DetailsUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: User | null;
}

export default function DetailsUserModal({
  isOpen,
  onClose,
  userData,
}: DetailsUserModalProps) {
  const [loadingData, setLoadingData] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  };

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "Aucun numéro de téléphone";
    const phoneNumber = parsePhoneNumber(phone);

    const countryCallingCode = `+${phoneNumber?.countryCallingCode} `;
    const nationalNumber =
      phoneNumber?.nationalNumber
        .toString()
        .replace(/\D/g, "")
        .match(/.{1,2}/g)
        ?.join(" ") ?? "";

    return countryCallingCode + nationalNumber;
  };

  if (!isOpen) return null;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={`Détails de l'utilisateur ${userData?.firstname} ${userData?.lastname}`}
      closeOnOverlayClick={!loadingData}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <p className="block text-xl font-medium text-gray-700 mb-2">
            {userData?.firstname || "Aucun prénom"}{" "}
            {userData?.lastname || "Aucun nom"}
          </p>
        </div>

        <div className="md:col-span-2 flex space-x-2">
          <p className="block text-xl font-medium text-gray-700 mb-2">
            {userData?.email || "Aucun email associé"}
          </p>
          {userData?.isEmailVerified ? (
            <div className="flex" title="Email vérifié">
              <BadgeCheck className="w-6 h-6 text-blue-500 inline-block mr-1" />
              <p className="block text-m font-medium text-gray-700 mb-2">
                ({formatDateTime(userData?.emailVerifiedDate ?? "")})
              </p>
            </div>
          ) : (
            <div className="flex" title="Email non vérifié">
              <BadgeX className="w-6 h-6 text-red-500 inline-block mr-1" />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <p className="block text-xl font-medium text-gray-700 mb-2">
            {formatPhoneNumber(userData?.phone ?? "") ||
              "Aucun numéro de téléphone"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          disabled={loadingData}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Fermer
        </button>
      </div>
    </ModalBase>
  );
}
