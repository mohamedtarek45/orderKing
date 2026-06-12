import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import type { Order } from "../types";
import OrderRow from "../components/orderRow.tsx";

export default function OrdersPage() {
  const [status  ,setStatus] = useState("eee");
  const { data: orders = [], isFetching ,isPending } = useOrders(status);

  if (isPending || isFetching) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-500">
        Loading orders...
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-auto rounded-lg border px-3 py-2 text-sm opacity-60"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full min-w-175">
          <thead className="bg-slate-100 text-sm text-gray-600">
            <tr>
              <th className="p-4 text-left font-semibold">Customer</th>
              <th className="p-4 text-left font-semibold">Order ID</th>
              <th className="p-4 text-left font-semibold">Amount</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Date</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order: Order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </tbody>
        </table>

        {!orders.length && (
          <div className="p-10 text-center text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  );
}
