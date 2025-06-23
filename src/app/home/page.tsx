"use client";
import { User } from "lucide-react";
import { useAuth } from "../context/auth_context";
import { authService } from "../../lib/api";

export default function Home() {
  const { user, loading } = useAuth();

  console.log("User:", user);

  const logout = async () => {
    try {
      const res = await authService.logout();
      console.log("Déconnexion réussie:", res);
      if (res.code === 200) {
        window.location.href = "/";
      } else {
        console.error("Erreur lors de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  if (loading) return <p>Chargement...</p>;

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Vous êtes connecté !
          </h2>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Se déconnecter
          </button>
          <p className="text-gray-600"></p>
        </div>
      </div>
    </div>
  );
}
