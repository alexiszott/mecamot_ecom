import {
  Facebook,
  FacebookIcon,
  ShoppingBasket,
  ShoppingCart,
  Twitter,
} from "lucide-react";
import { ReactNode } from "react";

interface FrontofficeLayoutProps {
  children: ReactNode;
}

export default function FrontofficeLayout({
  children,
}: FrontofficeLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-green-700">Mecamot</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-gray-600 hover:text-green-700 transition-colors"
              >
                Accueil
              </a>
              <a
                href="/frontoffice/showProduct"
                className="text-gray-600 hover:text-green-700 transition-colors"
              >
                Produits
              </a>
              <a
                href="/categories"
                className="text-gray-600 hover:text-green-700 transition-colors"
              >
                Catégories
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-green-700 transition-colors"
              >
                Contact
              </a>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-green-700 transition-colors relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Connexion
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden px-4 pb-4">
          <nav className="flex space-x-6">
            <a
              href="/"
              className="text-gray-600 hover:text-green-700 transition-colors text-sm"
            >
              Accueil
            </a>
            <a
              href="/frontoffice/showProduct"
              className="text-gray-600 hover:text-green-700 transition-colors text-sm"
            >
              Produits
            </a>
            <a
              href="/categories"
              className="text-gray-600 hover:text-green-700 transition-colors text-sm"
            >
              Catégories
            </a>
            <a
              href="/contact"
              className="text-gray-600 hover:text-green-700 transition-colors text-sm"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Mecamot</h3>
              <p className="text-gray-400 mb-4">
                Votre spécialiste en équipements de jardinage, motos et outils
                mécaniques. Qualité professionnelle, service expert.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase mb-4">
                Catégories
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Jardinage
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Motos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Outils mécaniques
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Accessoires
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Livraison
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Retours
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Mecamot. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
