"use client";

import { useLoadScript } from "@react-google-maps/api";
import { useRef, useEffect, useState } from "react";

const libraries: "places"[] = ["places"];

export default function ShippingPage() {
  const [streetAddress, setStreetAddress] = useState("");
  const autocompleteRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(
      autocompleteRef.current,
      {
        types: ["address"],
        componentRestrictions: { country: "fr" }, // Limite à la France
        fields: ["address_components", "formatted_address"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (place.formatted_address) {
        setStreetAddress(place.formatted_address);
      }

      // Optionnel : extraire les champs (ville, code postal...)
      const components = place.address_components || [];

      const get = (type: string) =>
        components.find((c) => c.types.includes(type))?.long_name || "";

      const city = get("locality");
      const postalCode = get("postal_code");
      const country = get("country");

      console.log({ streetAddress, city, postalCode, country });
    });
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-gray-50">
      <form className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <input
            ref={autocompleteRef}
            type="text"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="10 Rue des Lilas, Nancy"
            className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>
    </div>
  );
}
