import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import type { Order } from "../types";
import OrderRow from "../components/orderRow.tsx";
import { Filter, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const [status, setStatus] = useState("");
  const { data: orders = [], isFetching, isPending } = useOrders(status);

  if (isPending || isFetching) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">Track and manage customer purchases</p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-auto text-sm font-medium bg-transparent text-slate-700 outline-none cursor-pointer"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.map((order: Order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>

        {!orders.length && (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <p className="font-medium text-slate-600">No orders found</p>
            <p className="text-xs text-slate-400">Try changing the status filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

