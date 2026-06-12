import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types";
import ProductRow from "./ProductRow";
import ProductModal from "./ProductModal";

const ProductTable = () => {
  const { data: products = [], isLoading } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  if (isLoading) {
    return (
      <div className="space-y-2 rounded-xl border bg-white p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl  bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {products.map((product: Product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={setEditingProduct}
              />
            ))}
          </tbody>
        </table>
      </div>
      <ProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
      />
      {products.length === 0 && (
        <div className="p-8 text-center text-sm text-gray-400">
          No products yet.
        </div>
      )}
    </div>
  );
};

export default ProductTable;
