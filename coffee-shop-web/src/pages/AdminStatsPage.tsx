
import React, { useEffect, useState } from 'react';
import { fetchAdminStats } from '../services/adminService';
import { AdminStats } from '../types/types';


const cardStyles = [
  {
    bg: 'bg-gradient-to-r from-indigo-500 to-indigo-300',
    icon: '📦',
    label: 'Total Orders',
  },
  {
    bg: 'bg-gradient-to-r from-green-400 to-blue-700',
    icon: '💰',
    label: 'Total Revenue (NPR)',
  },
  {
    bg: 'bg-gradient-to-r from-pink-600 to-orange-400',
    icon: '🛒',
    label: 'Total Items Sold',
  },
];

const AdminStatsPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    fetchAdminStats(token)
      .then(setStats)
      .catch(() => setError('Failed to load stats.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading dashboard...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8">Dashboard Overview</h2>
      {stats && (
        <div className="flex gap-8 justify-center mb-8">
          <div className={`flex-1 ${cardStyles[0].bg} text-white rounded-2xl p-8 shadow-lg flex flex-col items-center`}>
            <span className="text-5xl">{cardStyles[0].icon}</span>
            <div className="text-2xl font-semibold my-4">{stats.total_orders}</div>
            <div className="text-base">{cardStyles[0].label}</div>
          </div>
          <div className={`flex-1 ${cardStyles[1].bg} text-white rounded-2xl p-8 shadow-lg flex flex-col items-center`}>
            <span className="text-5xl">{cardStyles[1].icon}</span>
            <div className="text-2xl font-semibold my-4">{stats.total_revenue}</div>
            <div className="text-base">{cardStyles[1].label}</div>
          </div>
          <div className={`flex-1 ${cardStyles[2].bg} text-white rounded-2xl p-8 shadow-lg flex flex-col items-center`}>
            <span className="text-5xl">{cardStyles[2].icon}</span>
            <div className="text-2xl font-semibold my-4">{stats.total_items_sold}</div>
            <div className="text-base">{cardStyles[2].label}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStatsPage;
