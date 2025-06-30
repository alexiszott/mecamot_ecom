"use client";
import { useState } from "react";
import {
  ShoppingCart,
  Package,
  FolderOpen,
  BarChart3,
  Settings,
  TrendingUp,
  Users,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../app/context/auth_context";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: BarChart3,
      url: "/backoffice/dashboard",
    },
    {
      id: "orders",
      label: "Commandes",
      icon: ShoppingCart,
      url: "/backoffice/orders",
      badge: "12",
    },
    {
      id: "products",
      label: "Produits",
      icon: Package,
      url: "/backoffice/product",
    },
    {
      id: "clients",
      label: "Clients",
      icon: Users,
      url: "/backoffice/clients",
    },
    {
      id: "category",
      label: "Catégories",
      icon: FolderOpen,
      url: "/backoffice/category",
    },
    {
      id: "stats",
      label: "Statistiques",
      icon: TrendingUp,
      url: "/backoffice/stats",
    },
    {
      id: "settings",
      label: "Paramètres",
      icon: Settings,
      url: "/backoffice/settings",
    },
  ];

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/");
  };

  const handleNavigation = (url: string) => {
    router.push(url);
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center ml-4 lg:ml-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Backoffice MecaMot
              </h1>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {user?.firstname?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-700 hidden sm:block">
                Bonjour, {user?.firstname}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar Desktop */}
        <aside
          className={`fixed left-0 top-16 bottom-0 z-30 bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ease-in-out hidden lg:block ${
            isCollapsed ? "w-24" : "w-64"
          }`}
        >
          <nav className="p-4 h-full overflow-y-auto">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.url)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      active
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    title={isCollapsed ? item.label : ""}
                  >
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isCollapsed ? "mx-auto" : "mr-3"
                      }`}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Sidebar Mobile */}
        <div
          className={`fixed inset-0 z-50 lg:hidden ${
            isMobileOpen ? "block" : "hidden"
          }`}
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    MecaMot
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="p-4 h-full overflow-y-auto">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.url);

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.url)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out lg:ml-64 ${
            isCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
