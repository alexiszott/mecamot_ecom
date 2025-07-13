"use client";

import { useState } from "react";
import CheckoutBreadcrumb from "../../../../components/checkout_breadcrum";
import { useRouter } from "next/navigation";
import { useCheckout } from "../../../context/checkout_context";

export default function ShippingPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [complStreetAddress, setComplStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { setShippingAddress } = useCheckout();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setShippingAddress({
      firstName: firstname,
      lastName: lastname,
      streetAddress,
      complStreetAddress,
      postalCode,
      city,
      country,
      phoneNumber,
    });

    router.push("/frontoffice/checkout/payment");
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-6">
      <CheckoutBreadcrumb currentStep={2} />
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6"
      >
        {/* Ligne 1: Prénom et Nom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Ligne 2: Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <input
            type="text"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ligne 3: Complément d'adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complément d'adresse (optionnel)
          </label>
          <input
            type="text"
            value={complStreetAddress}
            onChange={(e) => setComplStreetAddress(e.target.value)}
            className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ligne 4: Code postal et Ville */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code postal
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Ligne 5: Pays et Téléphone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Continuer vers le paiement
        </button>
      </form>
    </div>
  );
}
