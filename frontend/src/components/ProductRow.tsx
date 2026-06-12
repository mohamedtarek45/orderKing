import type { Product } from "../types";
type Props = {
  product: Product;
  onEdit: (product: Product) => void;
};
import { useDeleteProduct } from "../hooks/useProducts";
import Swal from "sweetalert2";
const ProductRow = ({ product, onEdit }: Props) => {
  const { mutateAsync: deleteProduct, isPending: isDeleting } =
    useDeleteProduct();

  const handleDisable = async () => {
    const result = await Swal.fire({
      title: "Disable Product?",
      text: `Are you sure you want to disable "${product.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, disable it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteProduct(product.id);

      Swal.fire({
        title: "Disabled!",
        text: "Product has been disabled successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to disable product.",
        icon: "error",
      });
    }
  };

  return (
    <tr key={product.id} className="transition-colors hover:bg-slate-50">
      <td className="p-3">
        <img
          src={product.image_url ?? ""}
          alt={product.name}
          className="h-14 w-14 rounded-lg border object-cover"
        />
      </td>

      <td className="p-3 font-medium text-gray-900">
        <div className="flex gap-2 items-center">
          <p>{product.name}</p>
          <div
            className={`py-1 px-2 ${product.is_active ? "bg-green-300" : "bg-red-300"} rounded-full`}
          >
            <p
              className={`text-xs font-medium ${product.is_active ? "text-green-800" : "text-red-800"}`}
            >
              {product.is_active ? "Active" : "Disabled"}
            </p>
          </div>
        </div>
      </td>

      <td className="p-3 text-gray-700">${product.price}</td>

      <td className="p-3 text-gray-500">{product.categories?.name}</td>

      <td className="p-3">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(product)}
            className="rounded-lg border px-3 py-1.5 text-xs"
          >
            Edit
          </button>

          <button
            onClick={handleDisable}
            disabled={isDeleting}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting ? "Disabling..." : "Disable"}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;
