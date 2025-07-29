"use client";

import Link from "next/link";
import { useAuth } from "./context/auth_context";

export default function Landing() {
  const { logout } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Mecamot E-commerce</h1>
        <p className="text-xl text-gray-600">
          Plateforme e-commerce pour pièces automobiles
        </p>
        <div className="space-y-4">
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer un compte
          </Link>
        </div>
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </Link>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => {
              logout();
            }}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se déconnecter
          </button>
        </div>
        <div className="space-y-4">
          <Link
            href="/frontoffice/product-display"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aller a la page d'accueil
          </Link>
        </div>
        <div className="space-y-4">
          <Link
            href="/backoffice/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Backoffice
          </Link>
        </div>
      </div>
    </main>
  );
}
