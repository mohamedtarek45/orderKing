import { useState } from "react";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";
import type { Product } from "../types";
import toast from "react-hot-toast";

type Props = {
  product?: Product | null;
  onSuccess: () => void;
};
const categories = [
  { id: "clothing", label: "Clothing" },
  { id: "food", label: "Food" },
  { id: "electronics", label: "Electronics" },
  { id: "home-kitchen", label: "Home & Kitchen" },
  { id: "books", label: "Books" },
];

const ProductForm = ({ product, onSuccess }: Props) => {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [description, setDescription] = useState(product?.description ?? "");

  const [categoryId, setCategoryId] = useState(product?.categories?.slug ?? "");

  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("description", description);
    formData.append("category_id", categoryId);

    if (image) {
      formData.append("image", image);
    }

    try {
      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: formData,
        });

      } else {
        await createProduct.mutateAsync(formData);

      }

      onSuccess();
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        {product ? "Edit Product" : "Add Product"}
      </h2>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 transition bg-white"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a short description..."
          rows={4}
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80 transition resize-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
        />
      </div>

      <button
        type="submit"
        disabled={createProduct.isPending || updateProduct.isPending}
        className={`w-full rounded-lg bg-black p-3 text-white font-medium transition-opacity ${
          createProduct.isPending || updateProduct.isPending
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-90"
        }`}
      >
        {product ? "Update Product" : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;
