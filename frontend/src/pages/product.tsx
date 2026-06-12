import { useState } from "react";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";

const ProductPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-slate-500">
            Manage store products
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Add Product
        </button>
      </div>

      <ProductTable />

      <ProductModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default ProductPage;