
import React, { useEffect, useState } from 'react';
import { fetchAdminOrders, updateOrderDeliveryStatus } from '../services/adminService';
import { AdminOrder } from '../types/types';

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState<{ [orderId: string]: string }>({});

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    fetchAdminOrders(token)
      .then(setOrders)
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeliveryStatusChange = (orderId: string, newStatus: string) => {
    setStatusUpdate((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const updateDelivery = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token') || '';
      const newStatus = statusUpdate[orderId];
      await updateOrderDeliveryStatus(orderId, newStatus, token);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, delivery_status: newStatus } : o));
      setStatusUpdate((prev) => ({ ...prev, [orderId]: '' }));
    } catch {
      alert('Failed to update delivery status.');
    }
  };

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8">Orders</h2>
      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-lg">Order #{order._id.slice(-6)}</div>
              <span className="text-sm text-gray-500">{new Date(order.created_at || '').toLocaleString()}</span>
            </div>
            <div className="flex flex-wrap gap-8 mb-2">
              <div><b>User:</b> {order.user_email}</div>
              <div><b>Delivery:</b> {order.delivery_mode}{order.address ? ` (${order.address})` : ''}</div>
              <div><b>Payment:</b> <span className={order.payment_status === 'completed' ? 'text-green-400' : order.payment_status === 'failed' ? 'text-pink-500' : 'text-gray-500'}>{order.payment_status}</span></div>
              {order.delivery_mode !== 'Pick Up' && (
                <div><b>Delivery Status:</b> <span className={order.delivery_status === 'Delivered' ? 'text-green-400' : 'text-gray-500'}>{order.delivery_status || 'N/A'}</span></div>
              )}
              <div><b>Total (USD):</b> ${order.total_price_usd}</div>
              <div><b>Total (NPR):</b> Rs. {order.total_price_npr}</div>
            </div>
            <div className="mb-2">
              <b>Items:</b>
              <ul className="ml-5 list-disc">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.product_name} <span className="text-gray-500">x{item.quantity}</span></li>
                ))}
              </ul>
            </div>
            {order.delivery_mode !== 'Pick Up' && (
              <div className="flex items-center gap-3 mt-2">
                <select
                  value={statusUpdate[order._id] || ''}
                  onChange={e => handleDeliveryStatusChange(order._id, e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" disabled>Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button
                  onClick={() => updateDelivery(order._id)}
                  disabled={!statusUpdate[order._id]}
                  className={`font-semibold text-sm rounded-md px-5 py-2 transition-opacity duration-200 text-white ${statusUpdate[order._id] ? 'bg-blue-700 hover:bg-blue-900 cursor-pointer' : 'bg-gray-300 cursor-not-allowed opacity-70'}`}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
