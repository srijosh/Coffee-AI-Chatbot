

import React, { useEffect, useState } from 'react';
import { Product } from '../types/types';
import { useAuth } from '../components/AuthContext';
import { fetchAdminProducts, updateAdminProductStock } from '../services/adminService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const USD_TO_NPR_RATE = import.meta.env.VITE_USD_TO_NPR_RATE;


const AdminProductsPage: React.FC = () => {
  const { token: authToken } = useAuth();
  const token = authToken || localStorage.getItem('token') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editStock, setEditStock] = useState<{ [id: string]: number }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const backendProducts = await fetchAdminProducts(token);
        setProducts(backendProducts);
        const stockMap: { [id: string]: number } = {};
        backendProducts.forEach((p) => {
          stockMap[p.id] = typeof p.stock === 'number' ? p.stock : 0;
        });
        setEditStock(stockMap);
      } catch {
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [token]);

  const handleStockChange = (id: string, value: number) => {
    const intValue = Number.isNaN(value) ? 0 : Math.max(0, Math.floor(value));
    setEditStock((prev) => ({ ...prev, [id]: intValue }));
  };

  const handleSave = async (id: string) => {
    const stock = editStock[id];
    if (!id || typeof stock !== 'number' || isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
      toast.error('Invalid product or stock value.');
      return;
    }
    setSavingId(id);
    try {
      await updateAdminProductStock(id, stock, token);
      setProducts((prev) => prev.map((p) =>
        p.id === id ? { ...p, stock } : p
      ));
      toast.success('Stock updated successfully!');
    } catch {
      toast.error('Failed to update stock.');
    } finally {
      setSavingId(null);
    }
  };


  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8">Product Stock Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow table-fixed">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left w-1/4">Name</th>
              <th className="py-3 px-4 text-left w-1/5">Category</th>
              <th className="py-3 px-4 text-left w-1/6">Price</th>
              <th className="py-3 px-4 text-left w-1/6">Stock</th>
              <th className="py-3 px-4 text-left w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-2 px-4 align-middle">{product.name}</td>
                <td className="py-2 px-4 align-middle">{product.category}</td>
                <td className="py-2 px-4 align-middle">${product.price.toFixed(2)} (Rs.{Math.round(product.price * USD_TO_NPR_RATE)})</td>
                <td className="py-2 px-4 align-middle">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={editStock[product.id] ?? 0}
                    onChange={(e) => handleStockChange(product.id, Math.floor(Number(e.target.value)))}
                    className="border rounded px-2 py-1 w-20 text-center"
                  />
                </td>
                <td className="py-2 px-4 align-middle">
                  <button
                    onClick={() => handleSave(product.id)}
                    disabled={savingId === product.id}
                    className={`px-4 py-1 rounded cursor-pointer text-white ${savingId === product.id ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-800'}`}
                  >
                    {savingId === product.id ? 'Updating...' : 'Update'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductsPage;
