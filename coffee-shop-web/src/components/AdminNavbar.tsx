import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const adminTabs = [
  { path: '/admin/stats', label: 'Stats' },
  { path: '/admin/orders', label: 'Orders' },
  { path: '/admin/products', label: 'Products' },
  { path: '/admin/users', label: 'Users' },
];

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  return (
    <nav className="bg-gray-900 text-white p-3 mb-6">
      <div className="flex space-x-8">
        {adminTabs.map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-4 py-2 rounded ${location.pathname === tab.path ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default AdminNavbar;
