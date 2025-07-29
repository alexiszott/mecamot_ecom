import { ShippingAddress } from "../type/shipping_address";
import { useRouter } from "next/navigation";

interface AddressSummaryProps {
  shippingAddress: ShippingAddress;
}

export default function AddressSummary({
  shippingAddress,
}: AddressSummaryProps) {
  const { shipping, billing, useSameAddress } = shippingAddress;
  const router = useRouter();

  const handleEdit = () => {
    router.push("/frontoffice/checkout/shipping");
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Résumé des adresses
        </h3>
        <button
          onClick={handleEdit}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ✏️ Modifier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adresse de livraison */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            📦 Adresse de livraison
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium">
              {shipping.firstName} {shipping.lastName}
            </p>
            <p>{shipping.streetAddress}</p>
            {shipping.complStreetAddress && (
              <p>{shipping.complStreetAddress}</p>
            )}
            <p>
              {shipping.postalCode} {shipping.city}
            </p>
            <p>{shipping.country}</p>
            <p>{shipping.phoneNumber}</p>
          </div>
        </div>

        {/* Adresse de facturation */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            🧾 Adresse de facturation
          </h4>
          {useSameAddress ? (
            <div className="text-sm text-gray-600 italic">
              Identique à l'adresse de livraison
            </div>
          ) : (
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium">
                {billing.firstName} {billing.lastName}
              </p>
              {billing.company && (
                <p className="text-blue-600">{billing.company}</p>
              )}
              <p>{billing.streetAddress}</p>
              {billing.complStreetAddress && (
                <p>{billing.complStreetAddress}</p>
              )}
              <p>
                {billing.postalCode} {billing.city}
              </p>
              <p>{billing.country}</p>
              <p>{billing.phoneNumber}</p>
              {billing.email && (
                <p className="text-blue-600">📧 {billing.email}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
