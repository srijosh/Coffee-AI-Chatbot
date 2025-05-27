import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { fetchUserOrders } from '../services/orderService';
import { Order } from '../types/types';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderSummary: React.FC = () => {
  const { token, user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (isAuthLoading) {
      return; // Wait for auth state to be ready
    }

    if (!user?.email) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const loadOrders = async () => {
      try {
        const data = await fetchUserOrders(user.email, token);
        console.log('Received orders:', data);
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [token, user, isAuthLoading, navigate, location]);

  if (isAuthLoading || loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (orders.length === 0) return <div className="text-center py-10 text-gray-600">No orders found.</div>;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h1>
      {orders.map((order) => (
        <div key={order.order_id} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold">Order ID: {order.order_id}</h2>
          <p className="text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
          <p className="text-gray-600">Total: ${order.total_price_usd.toFixed(2)} (Rs. {order.total_price_npr.toFixed(2)})</p>
          <p className="text-gray-600">Status: {order.status}</p>
          <p className="text-gray-600">Delivery: {order.delivery_mode} {order.address ? `- ${order.address}` : ''}</p>
          <h3 className="text-md font-medium mt-2">Items:</h3>
          <ul className="list-disc list-inside">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.product_name} x{item.quantity} (@${item.price.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderSummary;