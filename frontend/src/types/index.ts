export interface Profile {
  id: string;
  name: string | null;
  role: "user" | "admin";
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
  categories?: Category | null;
}

export interface Order {
  id: string;
  user_id: string;
  status: "pending" | "completed" | "cancelled";
  total_amount: number;
  created_at: string;
  name?: string ;
  email?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;

  product?: Product;
}


export interface UserResponse {
  id: string;
  email: string;
  profile: Profile;
}