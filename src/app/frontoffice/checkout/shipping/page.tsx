"use client";

import { useState } from "react";
import CheckoutBreadcrumb from "../../../../components/checkout_breadcrum";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useCheckout } from "../../../context/checkout_context";
import { useToast } from "../../../context/toast_context";
import { useCart } from "../../../context/cart_context";
import { orderService, paymentService } from "../../../../lib/api";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function ShippingPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [complStreetAddress, setComplStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [billingFirstname, setBillingFirstname] = useState("");
  const [billingLastname, setBillingLastname] = useState("");
  const [billingCompany, setBillingCompany] = useState("");
  const [billingStreetAddress, setBillingStreetAddress] = useState("");
  const [billingComplStreetAddress, setBillingComplStreetAddress] =
    useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingCountry, setBillingCountry] = useState("France");
  const [billingPhoneNumber, setBillingPhoneNumber] = useState("");
  const [billingEmail, setBillingEmail] = useState("");

  const [useSameAddress, setUseSameAddress] = useState(true);

  const { shippingAddress, setShippingAddress } = useCheckout();
  const { items } = useCart();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      checkAddress();

      if (shippingAddress === null) {
        throw new Error("Adresse de livraison non définie");
      }

      const resOrder = await orderService.createOrder(shippingAddress, items);

      console.log("Order created successfully:", resOrder);

      if (!resOrder) {
        throw new Error("Erreur lors de la création de la commande");
      }

      const resPayment = await paymentService.payment(items, shippingAddress);

      const sessionId = resPayment.data.data.sessionId || resPayment.sessionId;

      if (!sessionId) {
        throw new Error("Session ID non trouvé dans la réponse de paiement");
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe non chargé");

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        alert(error.message);
      }
    } catch (error) {
      showToast(
        "Une erreur s'est produite lors de la vérification de l'adresse.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUseSameAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseSameAddress(e.target.checked);

    if (e.target.checked) {
      setBillingFirstname(firstname);
      setBillingLastname(lastname);
      setBillingStreetAddress(streetAddress);
      setBillingComplStreetAddress(complStreetAddress);
      setBillingPostalCode(postalCode);
      setBillingCity(city);
      setBillingCountry(country);
      setBillingPhoneNumber(phoneNumber);
    }
  };

  const checkAddress = () => {
    if (
      !firstname ||
      !lastname ||
      !streetAddress ||
      !postalCode ||
      !city ||
      !country ||
      !phoneNumber
    ) {
      showToast(
        "Veuillez remplir tous les champs requis pour l'adresse de livraison.",
        "error"
      );
      return;
    }

    if (!useSameAddress) {
      if (
        !billingFirstname ||
        !billingLastname ||
        !billingStreetAddress ||
        !billingPostalCode ||
        !billingCity ||
        !billingCountry ||
        !billingPhoneNumber ||
        !billingEmail
      ) {
        showToast(
          "Veuillez remplir tous les champs requis pour l'adresse de facturation.",
          "error"
        );
        return;
      }
    }

    const shippingData = {
      firstName: firstname,
      lastName: lastname,
      streetAddress,
      complStreetAddress,
      postalCode,
      city,
      country,
      phoneNumber,
    };

    const billingData = useSameAddress
      ? shippingData
      : {
          firstName: billingFirstname,
          lastName: billingLastname,
          company: billingCompany,
          streetAddress: billingStreetAddress,
          complStreetAddress: billingComplStreetAddress,
          postalCode: billingPostalCode,
          city: billingCity,
          country: billingCountry,
          phoneNumber: billingPhoneNumber,
          email: billingEmail,
        };

    setShippingAddress({
      shipping: shippingData,
      billing: billingData,
      useSameAddress,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-6">
      <CheckoutBreadcrumb currentStep={2} />
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Adresse de livraison
          </h2>

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
                required
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
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
                required
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
                required
              />
            </div>
          </div>
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
                required
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
                required
              />
            </div>{" "}
          </div>
        </div>
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Adresse de facturation
          </h2>
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useSameAddress}
                onChange={handleUseSameAddressChange}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Utiliser la même adresse que l'adresse de livraison
              </span>
            </label>
          </div>
          {!useSameAddress && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={billingFirstname}
                    onChange={(e) => setBillingFirstname(e.target.value)}
                    className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={billingLastname}
                    onChange={(e) => setBillingLastname(e.target.value)}
                    className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Société (optionnel)
                  </label>
                  <input
                    type="text"
                    value={billingCompany}
                    onChange={(e) => setBillingCompany(e.target.value)}
                    className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de facturation
                </label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={billingStreetAddress}
                  onChange={(e) => setBillingStreetAddress(e.target.value)}
                  className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complément d'adresse (optionnel)
                </label>
                <input
                  type="text"
                  value={billingComplStreetAddress}
                  onChange={(e) => setBillingComplStreetAddress(e.target.value)}
                  className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={billingPostalCode}
                    onChange={(e) => setBillingPostalCode(e.target.value)}
                    className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                    className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={billingPhoneNumber}
                    onChange={(e) => setBillingPhoneNumber(e.target.value)}
                    className="w-full text-black pl-4 pr-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mx-auto block hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition"
        >
          Continuer vers le paiement
        </button>
      </form>
    </div>
  );
}
