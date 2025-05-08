import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Navigation: React.FC = () => {
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
          <li>
            <Link
              to="/"
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
              Home
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
              className=" cursor-pointer px-2 py-1"
              
            >
              <ShoppingCart size={24} color="#D22B2B" className="cursor-pointer" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;