import { FastifyRequest } from "fastify";
import supabase from "../../config/supabase";
import { parseFields } from "./parseFields";
import { updateProductSchema } from "./products.schema";
import { createProductSchema } from "./products.schema";
import { uploadImage } from "./uploadImage";

export async function findProducts({
  search = "",
  category = "",
}: {
  search?: string;
  category?: string;
}) {
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      )
    `,
    )
    .eq("is_active", true);

  // search
  if (search && search.trim() !== "") {
    query = query.ilike("name", `%${search}%`);
  }

  if (category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();

    if (categoryData?.id) {
      query = query.eq("category_id", categoryData.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.log("Supabase error:", error);
    throw error;
  }

  return data;
}

export async function findProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return data;
}
export async function createNewProduct(body: any) {
  const { image, name, description, price, category_id } = body;

  if (!image) {
    throw new Error("No image provided");
  }

  const validatedData = createProductSchema.parse({
    name: name.value,
    description: description.value,
    price: price.value,
    category_id: category_id.value,
  });

  const image_url = await uploadImage(image, supabase);
  console.log("image_url", image_url);
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", validatedData.category_id)
    .single();

  if (categoryError || !category) {
    throw new Error("Category not found");
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      ...validatedData,
      category_id: category.id,
      image_url,
    })
    .select()
    .single();

  if (productError) {
    throw new Error(productError.message);
  }

  return product;
}
export async function updateProduct(productId: string, body: any) {
  const { image , name, description, price, category_id } = body;

  const validatedData = updateProductSchema.parse({
    name: name?.value,
    description: description?.value,
    price: price?.value,
    category_id: category_id?.value,
  });

  let image_url: string | undefined;

  if (image) {
    image_url = await uploadImage(image, supabase);
  }

  let categoryDbId: string | undefined;

  if (validatedData.category_id) {
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", validatedData.category_id)
      .single();

    if (categoryError || !category) {
      throw new Error("Category not found");
    }

    categoryDbId = category.id;
  }

  const updateData = {
    ...(validatedData.name && { name: validatedData.name }),
    ...(validatedData.description && {
      description: validatedData.description,
    }),
    ...(validatedData.price && { price: validatedData.price }),
    ...(categoryDbId && { category_id: categoryDbId }),
    ...(image_url && { image_url }),
  };

  const { data: product, error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return product;
}
export async function deleteProduct( productId: string) {
  const { data: product, error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", productId)
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return product;
} 
