import React, { useEffect, useState } from 'react';
import { fetchAdminUsers, deleteAdminUser } from '../services/adminService';
import { AdminUser } from '../types/types';

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    fetchAdminUsers(token)
      .then(setUsers)
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) return;
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token') || '';
      await deleteAdminUser(userId, token);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      alert('Failed to delete user.');
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8">Users</h2>
      <div className="flex flex-wrap gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl shadow-lg p-6 min-w-[260px] flex flex-col gap-2 flex-1"
          >
            <div className="font-semibold text-lg mb-1 flex items-center">
              {user.name}
              {user.is_admin && (
                <span className="text-green-400 text-sm ml-2">(Admin)</span>
              )}
            </div>
            <div className="text-gray-500 text-sm mb-1">{user.email}</div>
            <div className="text-base mb-1"><b>Phone:</b> {user.phone_number}</div>
            <div className="text-base mb-2"><b>User ID:</b> {user._id.slice(-8)}</div>
            <button
              onClick={() => handleDelete(user._id, user.is_admin)}
              disabled={user.is_admin}
              className={`mt-2 font-semibold text-sm rounded-md px-5 py-2 transition-opacity duration-200 text-white ${user.is_admin ? 'bg-gray-300 cursor-not-allowed opacity-70' : 'bg-red-700 hover:bg-red-900 cursor-pointer'}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;
