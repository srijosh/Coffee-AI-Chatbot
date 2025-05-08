import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Thank You for Your Order!</h1>
        <button
          onClick={() => navigate('/')}
          className="text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity duration-200 cursor-pointer"
          style={{ backgroundColor: '#383838' }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;