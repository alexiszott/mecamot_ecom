"use client";
import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import ModalBase from "../shared/modal_base";
import { Category } from "../../type/category_type";
import { categoriesService } from "../../lib/api";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
  category: Category | null;
}

interface ProductFormData {
  name: string;
  description: string;
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  onUpdated,
  category,
}: EditCategoryModalProps) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category && isOpen) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
      });
      setFormErrors({});
    }
  }, [category, isOpen]);

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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Le nom du produit est requis";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) return;

    if (!validateForm()) return;

    setLoadingSubmit(true);

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
      };

      const response = await categoriesService.updateCategory(
        category.id,
        categoryData
      );

      if (response.success) {
        onUpdated();
        closeModal();
      } else {
        setFormErrors({
          general:
            response.message || "Erreur lors de la mise à jour de la catégorie",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie:", error);
      setFormErrors({
        general: "Erreur lors de la mise à jour de la catégorie",
      });
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

  if (!category) return null;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={closeModal}
      title={`Modifier le produit`}
      closeOnOverlayClick={!loadingSubmit}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Erreur générale */}
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
                Mise à jour...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Mettre à jour
              </>
            )}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
