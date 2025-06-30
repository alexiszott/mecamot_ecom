"use client";
import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import ModalBase from "./shared/modal_base";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
  type?: "danger" | "warning";
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
  type = "danger",
}: DeleteConfirmationProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const iconColor = type === "danger" ? "text-red-500" : "text-orange-500";
  const bgColor = type === "danger" ? "bg-red-50" : "bg-orange-50";
  const buttonColor =
    type === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-orange-600 hover:bg-orange-700";

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      closeOnOverlayClick={!isLoading}
    >
      <div className="text-center">
        {/* Icon */}
        <div
          className={`mx-auto flex items-center justify-center w-16 h-16 rounded-full ${bgColor} mb-6`}
        >
          <AlertTriangle className={`w-8 h-8 ${iconColor}`} />
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-900 text-lg mb-2">{message}</p>
          {itemName && (
            <div className="bg-gray-100 rounded-lg p-3 mt-4">
              <p className="text-sm text-gray-600">Élément à supprimer :</p>
              <p className="font-medium text-gray-900">{itemName}</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Cette action est irréversible.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`px-6 py-3 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center ${buttonColor}`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
