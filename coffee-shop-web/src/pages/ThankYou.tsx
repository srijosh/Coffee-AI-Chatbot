import React, { useEffect, Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { toast } from 'react-toastify';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { emptyCart } = useCart();

  const searchParams = new URLSearchParams(location.search);
  const paymentStatus = searchParams.get('status');
  const fromPayment = searchParams.get('fromPayment');

  useEffect(() => {
    if (fromPayment !== 'true') {
      navigate('/');
      return;
    }

    if (paymentStatus === 'success') {
      emptyCart(); // Call once
      toast.success('Payment successful! Order placed.', {
        position: "top-right",
        autoClose: 3000,
      });
    } else if (paymentStatus === 'failed') {
      toast.error('Payment failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      navigate('/');
    }
  }, [paymentStatus, fromPayment, navigate]); 


  if (fromPayment !== 'true' || (paymentStatus !== 'success' && paymentStatus !== 'failed')) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          {paymentStatus === 'success' ? 'Thank You for Your Order!' : 'Payment Failed'}
        </h1>
        {paymentStatus === 'success' ? (
          <p className="text-gray-600 mb-6">Your payment was successful, and your order has been placed.</p>
        ) : (
          <p className="text-gray-600 mb-6">Unfortunately, your payment failed. Please try again.</p>
        )}
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