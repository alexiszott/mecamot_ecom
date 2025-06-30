"use client";
import React, { useState } from "react";
import { Plus, X, Upload, Save } from "lucide-react";
import { productService } from "../lib/api";
import ModalBase from "./shared/modal_base";

interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  stock: number | string;
  category: string;
  brand: string;
  publish: boolean;
  image?: File | null;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onProductAdded,
}: AddProductModalProps) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Form data
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    brand: "",
    publish: false,
    image: null,
  });

  const category = [];

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

    // Effacer l'erreur pour ce champ
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Le nom du produit est requis";
    }
    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      errors.price = "Le prix doit être un nombre positif";
    }
    if (
      !formData.stock ||
      isNaN(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      errors.stock = "Le stock doit être un nombre positif ou zéro";
    }
    if (!formData.category) {
      errors.category = "La catégorie est requise";
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
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() ?? "",
        price: String(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        publish: formData.publish,
      };

      const response = await productService.createProduct(productData);

      if (response.success) {
        resetForm();
        onClose();
        onProductAdded();
      }
    } catch (error: any) {
      console.error("Erreur lors de la création:", error);
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        setFormErrors({ general: "Erreur lors de la création du produit" });
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      brand: "",
      publish: false,
      image: null,
    });
    setFormErrors({});
  };

  const closeModal = () => {
    if (!loadingSubmit) {
      resetForm();
      onClose();
    }
  };

  // Gérer la fermeture avec Échap
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

          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix (€) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="99.99"
              step="0.01"
              min="0"
              className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.price ? "border-red-300" : "border-gray-300"
              }`}
            />
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="10"
              min="0"
              className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.stock ? "border-red-300" : "border-gray-300"
              }`}
            />
            {formErrors.stock && (
              <p className="mt-1 text-sm text-red-600">{formErrors.stock}</p>
            )}
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.category ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Sélectionner une catégorie</option>
              {category.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
            )}
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              name="publish"
              value={String(formData.publish)}
              onChange={handleInputChange}
              className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">Visible</option>
              <option value="false">Non visible</option>
            </select>
          </div>

          {/* Brand */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marque *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Ex: Casque Shark Race-R Pro"
              className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.brand ? "border-red-300" : "border-gray-300"
              }`}
            />
            {formErrors.brand && (
              <p className="mt-1 text-sm text-red-600">{formErrors.brand}</p>
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

          {/* Upload d'image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du produit
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {formData.image
                    ? formData.image.name
                    : "Cliquez pour sélectionner une image"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF jusqu'à 5MB
                </p>
              </label>
            </div>
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
                Créer le produit
              </>
            )}
          </button>
        </div>
      </form>
    </ModalBase>
  );
}
