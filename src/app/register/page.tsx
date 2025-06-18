"use client";

import { useState } from "react";
import { authService } from "../../lib/api";

export default function TestPage() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const result = await authService.register(
        formData.email,
        formData.password,
        formData.firstname,
        formData.lastname
      );
      setResponse(result);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion à l'API");
    } finally {
      setLoading(false);
    }
  };

  const testApiConnection = async () => {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const response = await fetch("http://localhost:3001/api/test");
      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError("Impossible de se connecter au backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Test API Mecamot
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Testez la communication avec le backend
          </p>
        </div>

        {/* Bouton test de connexion */}
        <div className="mt-8">
          <button
            onClick={testApiConnection}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Test en cours..." : "Tester la connexion API"}
          </button>
        </div>

        {/* Formulaire d'inscription */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="firstname" className="sr-only">
                Prénom
              </label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Prénom"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastname" className="sr-only">
                Nom de famille
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nom de famille"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? "Envoi en cours..." : "Créer un utilisateur"}
            </button>
          </div>
        </form>

        {/* Affichage des résultats */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-sm text-red-700">
              <strong>Erreur:</strong> {error}
            </div>
          </div>
        )}

        {response && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="text-sm text-green-700">
              <strong>Réponse de l'API:</strong>
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Informations de debug */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Informations de debug:
          </h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Frontend: http://localhost:3000</div>
            <div>Backend: http://localhost:3001</div>
            <div>API Test: http://localhost:3001/api/test</div>
            <div>API Auth: http://localhost:3001/api/auth/register</div>
          </div>
        </div>
      </div>
    </div>
  );
}
