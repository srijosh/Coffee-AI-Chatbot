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