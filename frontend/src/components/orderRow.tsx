import { Link } from "react-router-dom";
import type { Order } from "../types";
import StatusBadge from "./statusBadge.tsx";
import { useUpdateOrderStatus } from "../hooks/useOrders.ts";
import toast from "react-hot-toast";

type Props = {
  order: Order;
};

export default function OrderRow({ order }: Props) {
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus({ orderId, status: newStatus });
    }catch (error) {
      toast.error("Failed to update status");
      console.log(error);
    }
  };
  return (
    <tr
      className={`border-t transition ${
        isUpdating ? "bg-slate-50 opacity-70" : "hover:bg-slate-50"
      }`}
    >
      <td className="p-4">
        <div>
          <p className="font-medium text-gray-800">{order.name ?? "Unknown"}</p>
          <p className="text-sm text-gray-500">{order.email}</p>
        </div>
      </td>

      <td className="p-4 text-sm text-gray-600 font-mono">
        {order.id.slice(0, 8)}...
      </td>

      <td className="p-4 font-semibold text-gray-800">${order.total_amount}</td>

      <td className="p-4">
        <div className="flex items-center gap-2">
          <select
            value={order.status}
            disabled={isUpdating}
            onChange={(e) => handleStatusChange(order.id, e.target.value)}
            className="rounded-md border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/70 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {isUpdating ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
          ) : (
            <StatusBadge status={order.status} />
          )}
        </div>
      </td>

      <td className="p-4 text-gray-500 text-sm">
        {new Date(order.created_at).toLocaleDateString()}
      </td>

      <td className="p-4 text-right">
        <Link
          to={`/home/orders/${order.id}`}
          className="inline-block rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-100 transition"
        >
          View Details
        </Link>
      </td>
    </tr>
  );
}
