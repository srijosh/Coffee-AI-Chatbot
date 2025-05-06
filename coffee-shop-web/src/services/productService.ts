import { Product } from "../types/types";
import { API_URL } from '../config/config';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    const products: Product[] = data.products.map((product: any) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      image_url: product.image_url,
      rating: product.rating || 0,
      description: product.description || '',
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}