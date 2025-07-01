"use client";
import React, { useState } from "react";
import { Plus, X, Upload, Save } from "lucide-react";
import { categoriesService, productService } from "../../lib/api";
import ModalBase from "../shared/modal_base";

interface CategoryFormData {
  name: string;
  description: string;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAdded,
}: AddCategoryModalProps) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Le nom du produit est requis";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoadingSubmit(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() ?? "",
      };

      const response = await categoriesService.createCategory(categoryData);

      if (response.success) {
        resetForm();
        onClose();
        onAdded();
      }
    } catch (error: any) {
      console.error("Erreur lors de la création:", error);
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        setFormErrors({
          general: "Erreur lors de la création de la catégorie",
        });
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setFormErrors({});
  };

  const closeModal = () => {
    if (!loadingSubmit) {
      resetForm();
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loadingSubmit) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, loadingSubmit]);

  if (!isOpen) return null;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={closeModal}
      title={`Ajouter un produit`}
      closeOnOverlayClick={!loadingSubmit}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {formErrors.general && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <p className="text-sm text-red-600">{formErrors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom du produit */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du produit *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ex: Casque Shark Race-R Pro"
              className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.name ? "border-red-300" : "border-gray-300"
              }`}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description détaillée du produit..."
              rows={4}
              className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                formErrors.description ? "border-red-300" : "border-gray-300"
              }`}
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={closeModal}
            disabled={loadingSubmit}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loadingSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {loadingSubmit ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Création...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Créer la catégorie
              </>
            )}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
