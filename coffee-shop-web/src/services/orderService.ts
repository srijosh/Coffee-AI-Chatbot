import axios from 'axios';
import { API_URL } from '../config/config';
import { PaymentData, OrderItem, OrderResponse } from '../types/types';

export async function createOrder(
  items: OrderItem[],
  userEmail: string,
  totalPriceUsd: number,
  deliveryMode: 'Deliver' | 'Pick Up',
  address: string | null,
  token: string
): Promise<OrderResponse> {
  try {
    const response = await axios.post(
      `${API_URL}/create-order`,
      {
        items,
        user_email: userEmail,
        total_price_usd: totalPriceUsd + (deliveryMode === 'Deliver' ? 1 : 0),
        delivery_mode: deliveryMode,
        address: deliveryMode === 'Deliver' ? address : null,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order. Please try again.');
  }
}

export async function initiatePayment(orderId: string, token: string): Promise<PaymentData> {
  try {
    const response = await axios.post<PaymentData>(
      `${API_URL}/initiate-payment/${orderId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw new Error('Failed to initiate payment. Please try again.');
  }
}

export async function fetchUserOrders(userEmail: string, token: string): Promise<any[]> {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { user_email: userEmail },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders. Please try again.');
  }
}