"use client";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  FolderOpen,
  BarChart3,
  Settings,
  TrendingUp,
  AlertTriangle,
  Eye,
  Euro,
  Calendar,
  Bell,
  Star,
  ExternalLink,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/auth_context";
import { useRouter } from "next/navigation";

export default function BackofficeHome() {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const router = useRouter();

  // Données simulées - à remplacer par vos appels API
  const [dashboardData, setDashboardData] = useState({
    todayStats: {
      orders: 12,
      revenue: 421,
      newClients: 3,
      avgBasket: 35.08,
    },
    recentOrders: [
      {
        id: "#ORD-001",
        client: "Jean Dupont",
        total: 89.99,
        status: "preparation",
        date: "10:30",
      },
      {
        id: "#ORD-002",
        client: "Marie Martin",
        total: 156.5,
        status: "shipped",
        date: "09:15",
      },
      {
        id: "#ORD-003",
        client: "Pierre Leroy",
        total: 45.3,
        status: "pending",
        date: "08:45",
      },
      {
        id: "#ORD-004",
        client: "Sophie Bernard",
        total: 234.99,
        status: "delivered",
        date: "Hier",
      },
      {
        id: "#ORD-005",
        client: "Marc Rousseau",
        total: 67.8,
        status: "preparation",
        date: "Hier",
      },
    ],
    alerts: [
      { type: "stock", message: "5 produits en rupture de stock", count: 5 },
      {
        type: "order",
        message: "3 commandes en attente de validation",
        count: 3,
      },
      { type: "payment", message: "2 paiements à vérifier", count: 2 },
    ],
    topProducts: [
      { name: "Casque Shark Race-R Pro", sales: 23, revenue: 2760 },
      { name: "Gants Alpinestars GP Plus", sales: 18, revenue: 1260 },
      { name: "Bottes TCX Comp Evo", sales: 15, revenue: 2250 },
      { name: "Combinaison Dainese Racing", sales: 12, revenue: 4800 },
      { name: "Blouson Rev'it! Tornado", sales: 10, revenue: 1590 },
    ],
    lowStock: [
      { name: "Chaîne DID 525", stock: 2, threshold: 10 },
      { name: "Plaquettes de frein Brembo", stock: 1, threshold: 5 },
      { name: "Filtre à huile K&N", stock: 3, threshold: 8 },
      { name: "Pneu Michelin Pilot Road", stock: 0, threshold: 6 },
    ],
  });

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Redirection...</p>
      </div>
    );
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: BarChart3,
      active: true,
    },
    { id: "orders", label: "Commandes", icon: ShoppingCart, badge: "12" },
    {
      id: "products",
      label: "Produits",
      icon: Package,
      url: "/backoffice/product",
    },
    { id: "clients", label: "Clients", icon: Users },
    { id: "categories", label: "Catégories", icon: FolderOpen },
    { id: "stats", label: "Statistiques", icon: TrendingUp },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      preparation: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
    };
    const statusLabels = {
      preparation: "Préparation",
      shipped: "Expédié",
      delivered: "Livré",
      pending: "En attente",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || statusStyles.pending
        }`}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Backoffice MecaMot
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {user.firstname.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-700">
                  Bonjour, {user.firstname}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-6 h-full">
          {/* Sidebar */}
          <aside className="xl:w-72 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-8">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        router.push(item.url || `/backoffice/${item.id}`);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === item.id
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

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      Commandes aujourd'hui
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {dashboardData.todayStats.orders}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      CA aujourd'hui
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {dashboardData.todayStats.revenue}€
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Euro className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      Nouveaux clients
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {dashboardData.todayStats.newClients}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      Panier moyen
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {dashboardData.todayStats.avgBasket}€
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 auto-rows-fr">
              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Dernières commandes
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm">
                    Voir tout <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-4 flex-1">
                  {dashboardData.recentOrders.map((order, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.client}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-medium text-gray-900">
                          {order.total}€
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(order.status)}
                          <span className="text-xs text-gray-500">
                            {order.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Alertes & Notifications
                  </h3>
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4 flex-1">
                  {dashboardData.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-red-800 truncate">
                          {alert.message}
                        </p>
                      </div>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex-shrink-0 ml-3">
                        {alert.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Produits les plus vendus
                  </h3>
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="space-y-4 flex-1">
                  {dashboardData.topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {product.sales} ventes
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-green-600 flex-shrink-0 ml-3">
                        {product.revenue}€
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock */}
              <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Stock critique
                  </h3>
                  <Package className="w-5 h-5 text-red-400" />
                </div>
                <div className="space-y-4 flex-1">
                  {dashboardData.lowStock.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Seuil: {item.threshold}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-3 ${
                          item.stock === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {item.stock === 0
                          ? "Rupture"
                          : `${item.stock} restants`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
