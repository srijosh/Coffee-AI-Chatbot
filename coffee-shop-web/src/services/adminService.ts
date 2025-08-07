
import axios from 'axios';
import { API_URL } from '../config/config';
import { Product, AdminOrder, AdminUser, AdminStats } from '../types/types';

export async function fetchAdminProducts(token: string): Promise<Product[]> {
  const response = await axios.get<{ products: any[] }>(`${API_URL}/admin/products`, { headers: { Authorization: `Bearer ${token}` } });
  // Map _id to id for frontend consistency
  return response.data.products.map((product: any) => ({
    id: product._id,
    name: product.name,
    category: product.category,
    price: product.price,
    image_url: product.image_url,
    rating: product.rating || 0,
    description: product.description || '',
    stock: product.stock,
  }));
}

export async function updateAdminProductStock(productId: string, stock: number, token: string): Promise<void> {
  await axios.put(
    `${API_URL}/admin/products/${productId}/stock`,
    { stock },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function fetchAdminStats(token: string): Promise<AdminStats> {
  const response = await axios.get<AdminStats>(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
}

export async function fetchAdminOrders(token: string): Promise<AdminOrder[]> {
  const response = await axios.get<AdminOrder[]>(`${API_URL}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
}

export async function updateOrderDeliveryStatus(orderId: string, newStatus: string, token: string): Promise<void> {
  await axios.put(`${API_URL}/admin/orders/${orderId}/delivery-status?new_status=${encodeURIComponent(newStatus)}`, {}, { headers: { Authorization: `Bearer ${token}` } });
}

export async function fetchAdminUsers(token: string): Promise<AdminUser[]> {
  const response = await axios.get<AdminUser[]>(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
}

export async function deleteAdminUser(userId: string, token: string): Promise<void> {
  await axios.delete(`${API_URL}/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
}
