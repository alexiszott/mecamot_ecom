"use client";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  Euro,
  ExternalLink,
  Users,
  Bell,
  Star,
} from "lucide-react";
import { useAuth } from "../../context/auth_context";
import SidebarLayout from "../../../components/sidebar_layout";
import StatsCard from "../../../components/stats_card";

export default function BackofficeHome() {
  const { user, loading } = useAuth();

  const [dashboardData, setDashboardData] = useState({
    todayStats: {},
    recentOrders: [],
    alerts: [],
    topProducts: [],
    lowStock: [],
  });

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Redirection...</p>
      </div>
    );
  }

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
    <SidebarLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title={"Commandes aujourd'hui"}
          data={undefined}
          icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
          color={"blue"}
        />

        <StatsCard
          title={"CA aujourd'hui"}
          data={undefined}
          icon={<Euro className="w-6 h-6 text-green-600" />}
          color={"green"}
        />

        <StatsCard
          title={"Nouveaux clients"}
          data={undefined}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          color={"purple"}
        />

        <StatsCard
          title={"Panier moyen"}
          data={undefined}
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          color={"orange"}
        />
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
                  <p className="font-medium text-gray-900">{order.total}€</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-gray-500">{order.date}</span>
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
                  {item.stock === 0 ? "Rupture" : `${item.stock} restants`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
