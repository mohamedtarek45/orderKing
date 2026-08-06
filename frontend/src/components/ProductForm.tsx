import { useState } from "react";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";
import type { Product } from "../types";
import toast from "react-hot-toast";
import { PackagePlus, Edit3, Loader2, DollarSign, Tag, FileText, Image as ImageIcon, Upload } from "lucide-react";

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
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url ?? null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !categoryId) {
      toast.error("Please fill in all required fields (Name, Price, Category)");
      return;
    }

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
        toast.success("Product updated successfully ✨");
      } else {
        await createProduct.mutateAsync(formData);
        toast.success("Product created successfully 🎉");
      }

      onSuccess();
    } catch (err) {
      toast.error("Failed to save product");
      console.log(err);
    }
  };

  const isLoading = createProduct.isPending || updateProduct.isPending;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Header Banner */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white shadow-md shadow-indigo-500/20">
          {product ? <Edit3 className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {product ? "Edit Product" : "Create New Product"}
          </h2>
          <p className="text-xs text-slate-500">
            {product ? "Update product information & details" : "Add a new item to your ShopSphere inventory"}
          </p>
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Product Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Wireless Headphones"
            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition placeholder-slate-400"
          />
        </div>
      </div>

      {/* Price & Category Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Price ($) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition placeholder-slate-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3.5 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition cursor-pointer"
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

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Description
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a clear description of the product..."
            rows={3}
            className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition resize-none placeholder-slate-400"
          />
        </div>
      </div>

      {/* Image Upload Box */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Product Image
        </label>
        <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 border-dashed rounded-2xl hover:border-violet-400 transition cursor-pointer">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="h-16 w-16 rounded-xl border border-slate-200 object-cover shrink-0"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200/60 text-slate-400 shrink-0">
              <ImageIcon className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700">
                <Upload className="w-3.5 h-3.5" />
                Choose image file
              </span>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {image ? image.name : "PNG, JPG, WEBP up to 5MB"}
              </p>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 text-sm mt-2"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            Saving...
          </span>
        ) : (
          <span>{product ? "Save Changes" : "Create Product"}</span>
        )}
      </button>
    </form>
  );
};

export default ProductForm;

