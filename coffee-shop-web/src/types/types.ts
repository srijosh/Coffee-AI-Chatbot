export interface Product {
    id: string;
    category: string;
    description: string;
    image_url: string;
    name: string;
    price: number;
    rating: number;
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