import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from './AuthContext';

const Navigation: React.FC = () => {
  const { token, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-semibold hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        >
          Coffee Ghar
        </Link>
        <ul className="flex space-x-6 items-center">
          {token ? (
            <>
              <li>
                <span className="text-gray-800 px-2 py-1">
                  Welcome, {user?.name}
                </span>
              </li>
              <li>
                <Link
                  to="/account"
                  className="text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 cursor-pointer px-2 py-1 rounded-md"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1F2937';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className="text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 cursor-pointer px-2 py-1 rounded-md"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1F2937';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  to="/order"
                  className="cursor-pointer px-2 py-1"
                >
                  <ShoppingCart size={24} color="#D22B2B" className="cursor-pointer" />
                </Link>
              </li>
              <li>
                <Link
                  to="/order-summary"
                  className="text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 cursor-pointer px-2 py-1 rounded-md"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1F2937';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Order Summary
                </Link>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 cursor-pointer px-2 py-1 rounded-md"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1F2937';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 cursor-pointer px-2 py-1 rounded-md"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1F2937';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200 cursor-pointer px-2 py-1 rounded-md"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1F2937';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;