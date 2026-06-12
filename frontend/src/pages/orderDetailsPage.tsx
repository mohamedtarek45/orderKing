import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import type { OrderItem } from "../types";
import StatusBadge from "../components/statusBadge.tsx";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id!);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-500">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-500">
        Order not found
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <Link
        to="/home/orders"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
            <p className="text-sm text-gray-500 font-mono">#{order.id}</p>
          </div>

          <StatusBadge status={order.status} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Customer
            </h3>
            <p className="font-medium text-gray-800">{order.user?.name}</p>
            <p className="text-sm text-gray-500">{order.user?.email}</p>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Total Amount
            </h3>
            <p className="text-xl font-bold text-gray-800">
              ${order.total_amount}
            </p>
          </div>

          <div className="rounded-lg border p-4 sm:col-span-2 md:col-span-1">
            <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Created At
            </h3>
            <p className="text-gray-800">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
        </div>

        <div className="divide-y">
          {order.order_items?.map((item: OrderItem) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4"
            >
              <img
                src={item.product?.image_url ?? ""}
                alt={item.product?.name}
                className="h-20 w-20 rounded-lg border object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">
                  {item.product?.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="font-semibold text-gray-800 sm:text-right">
                ${item.unit_price * item.quantity}
              </div>
            </div>
          ))}

          {!order.order_items?.length && (
            <div className="p-10 text-center text-gray-500">
              No items in this order
            </div>
          )}
        </div>
      </div>
    </div>
  );
}