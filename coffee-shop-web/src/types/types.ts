
// Admin types
export interface AdminStats {
  total_orders: number;
  total_revenue: number;
  total_items_sold: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone_number: string;
  is_admin: boolean;
}

export interface AdminOrderItem {
  product_name: string;
  quantity: number;
  price?: number;
}

export interface AdminOrder {
  _id: string;
  user_email: string;
  items: AdminOrderItem[];
  total_price_usd: number;
  total_price_npr: number;
  delivery_mode: string;
  address?: string;
  payment_status: string;
  delivery_status?: string;
  created_at?: string;
}
export interface Product {
  id: string;
  category: string;
  description: string;
  image_url: string;
  name: string;
  price: number;
  rating: number;
  stock: number;
}

export interface ProductCategory {
  id: string;
  selected: boolean;
}

export interface MessageInterface {
  role: string;
  content: string;
  memory?: any;
}

export interface PaymentData {
  amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  tax_amount: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  order_id: string;
}

export interface Order {
  order_id: string;
  user_email: string;
  items: OrderItem[];
  total_price_usd: number;
  total_price_npr: number;
  delivery_mode: 'Deliver' | 'Pick Up';
  address: string | null;
  payment_status: string;
  delivery_status: string;
  created_at: string;
}