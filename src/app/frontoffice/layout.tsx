"use client";

import { Boxes, Facebook, LogOut, ShoppingCart, User } from "lucide-react";
import { ReactNode, useState } from "react";
import { useCart } from "../context/cart_context";
import { useAuth } from "../context/auth_context";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface FrontofficeLayoutProps {
  children: ReactNode;
}

export default function FrontofficeLayout({
  children,
}: FrontofficeLayoutProps) {
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const router = useRouter();

  const { items } = useCart();
  const { isLoggedIn, loading, user, logout } = useAuth();

  const pathname = usePathname();

  const linkClass = (href: string) =>
    `transition-colors ${
      pathname === href
        ? "text-green-700"
        : "text-gray-600 hover:text-green-700"
    }`;

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
              <Link href="/" className={linkClass("/")}>
                Accueil
              </Link>
              <Link
                href="/frontoffice/ProductList"
                className={linkClass("/frontoffice/ProductList")}
              >
                Produits
              </Link>
              <Link href="/categories" className={linkClass("/categories")}>
                Catégories
              </Link>
              <Link href="/contact" className={linkClass("/contact")}>
                Contact
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div
                className="relative"
                onMouseEnter={() => setIsOpenCart(true)}
                onMouseLeave={() => setIsOpenCart(false)}
              >
                <button
                  onClick={() => router.push("/frontoffice/cart")}
                  className="text-gray-600 hover:text-green-700 transition-colors relative  cursor-pointer"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items?.length || 0}
                  </span>
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <>
                  {!isLoggedIn ? (
                    <div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Connexion
                      </button>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Inscription
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() => setIsOpenUser(!isOpenUser)}
                        className="text-gray-600 hover:text-white hover:bg-green-600 p-1 rounded-full transition-colors relative cursor-pointer "
                      >
                        <User className="h-6 w-6" />
                      </button>
                      {isOpenUser && (
                        <div className="absolute right-0 top-2 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
                          <div className="p-3 font-semibold border-b text-gray-500">
                            {user?.firstname} {user?.lastname}
                          </div>
                          <div
                            className="p-3 space-y-2"
                            onMouseLeave={() => setIsOpenUser(false)}
                          >
                            <button
                              onClick={() => ""}
                              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-600"
                            >
                              <User className="h-6 w-6" />
                              <span className="ml-2">Mon Compte</span>
                            </button>
                            <button
                              onClick={() => ""}
                              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-600"
                            >
                              <Boxes className="h-6 w-6" />
                              <span className="ml-2">Mes commandes</span>
                            </button>
                            <button
                              onClick={() => logout()}
                              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-600"
                            >
                              <LogOut className="h-6 w-6" />
                              <span className="ml-2">Déconnexion</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
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
