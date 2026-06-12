import { useMemo } from "react";
import { ShoppingBag, DollarSign, Package } from "lucide-react";
import KpiCard from "../components/KpiCard";
import { useOrders } from "../hooks/useOrders";
import { useProducts } from "../hooks/useProducts";

import type { Order, Product } from "../types";

const Dashboard = () => {
  const { data: orders = [], isLoading: ordersLoading } = useOrders("");

  const { data: products = [], isLoading: productsLoading } = useProducts();

  const stats = useMemo(() => {
    const today = new Date();
    console.log("orders2222", orders);
    const ordersToday = orders.filter((order: Order) => {
      const date = new Date(order.created_at);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    });

    const revenue = orders.reduce(
      (sum: number, order: Order) => sum + Number(order.total_amount || 0),
      0,
    );
    const activeProducts = products.reduce((sum: number, product: Product) => {
      if (product.is_active) {
        return sum + 1;
      }
      return sum;
    }, 0);
    return {
      ordersToday: ordersToday.length,
      revenue,
      activeProducts: activeProducts,
    };
  }, [orders, products]);

  if (ordersLoading || productsLoading) {
    return (
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="space-y-2">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200 sm:h-10 sm:w-48" />
          <div className="h-4 w-56 animate-pulse rounded-lg bg-gray-200 sm:h-5 sm:w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200 sm:h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>

        <p className="mt-1 text-sm text-gray-500 sm:mt-2 sm:text-base">Overview of your store</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <KpiCard title="Orders Today" value={stats.ordersToday} icon={ShoppingBag} color="blue" />

        <KpiCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} color="green" />

        <KpiCard title="Active Products" value={stats.activeProducts} icon={Package} color="purple" />
      </div>
    </div>
  );
};

export default Dashboard;