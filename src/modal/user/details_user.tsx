"use client";
import React, { useState } from "react";
import { BadgeCheck, BadgeX } from "lucide-react";
import ModalBase from "../shared/modal_base";
import { User } from "../../type/user_type";
import { formatDateTime, formatPhoneNumber } from "../../app/utils/format";

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
            {formatPhoneNumber(userData?.phone ?? "")}
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
