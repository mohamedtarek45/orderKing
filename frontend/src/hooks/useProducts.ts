import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/products`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      return res.json();
    },

    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Failed to create product");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Product created");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Product deleted");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_API_URL}/products/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Product updated");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
