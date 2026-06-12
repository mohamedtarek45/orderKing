import supabase from "../../config/supabase";
import { CreateOrderInput } from "./orders.schema";

export async function createOrder(userId: string, data: CreateOrderInput) {
  const productIds = data.items.map((item) => item.productId);

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price")
    .in("id", productIds);

  if (productsError) {
    throw productsError;
  }

  let totalAmount = 0;

  const orderItems = data.items.map((item) => {
    const product = products?.find((p) => p.id === item.productId);

    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    totalAmount += Number(product.price) * item.quantity;

    return {
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: product.price,
    };
  });

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  const itemsToInsert = orderItems.map((item) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    throw itemsError;
  }

  return order;
}

export async function getMyOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase.rpc("get_order_by_id_full", {
    order_id: orderId,
  });

  if (error) throw error;

  return data;
}

export async function getAllOrders(status?: string) {
  console.log(status);
  const { data, error } = await supabase.rpc("get_orders_with_users", {
    p_status: status||null,
  });
  console.log(data);

  if (error) throw error;

  return data;
}

export async function findUserOrders() {}

export async function changeOrderStatus(orderId: string, data: any) {
  const { data: order, error } = await supabase
    .from("orders")
    .update(data)
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return order;
}
