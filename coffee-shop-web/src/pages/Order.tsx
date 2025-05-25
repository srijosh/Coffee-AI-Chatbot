import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { CircleDollarSign } from 'lucide-react';
import { fetchProducts } from '../services/productService';
import ProductList from '../components/CartProductList';
import { useCart } from '../components/CartContext';
import { Product, PaymentData } from '../types/types';
import { toast } from 'react-toastify';
import { useAuth } from '../components/AuthContext';
import { createOrder, initiatePayment } from '../services/orderService';
import { API_URL } from '../config/config';

const USD_TO_NPR_RATE = 132.0; // Must match backend rate

const Order: React.FC = () => {
  const { cartItems, setQuantityCart, emptyCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState<'Deliver' | 'Pick Up'>('Deliver');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);

  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [token, navigate, location]);

  const calculateTotal = (products: Product[], quantities: { [key: string]: number }): number => {
    return products.reduce((total, product) => {
      const quantity = quantities[product.name] || 0;
      return total + product.price * quantity;
    }, 0);
  };

  useEffect(() => {
    const total = calculateTotal(products, cartItems);
    setTotalPrice(total);
  }, [cartItems, products]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        setError("Error fetching products: " + err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Validate address whenever deliveryMode or address changes
  useEffect(() => {
    if (deliveryMode === 'Deliver' && address.trim() === '') {
      setAddressError('Address is required');
    } else {
      setAddressError(null);
    }
  }, [deliveryMode, address]);

  const orderNow = async () => {
    if (deliveryMode === 'Deliver' && address.trim() === '') {
      setAddressError('Address is required');
      return;
    }

    if (!user) {
      toast.error('User not authenticated', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Prepare order items
      const items = Object.keys(cartItems)
        .filter(name => cartItems[name] > 0)
        .map(name => {
          const product = products.find(p => p.name === name);
          return {
            product_name: name,
            quantity: cartItems[name],
            price: product ? product.price : 0,
          };
        });

      // Create order
      const orderResponse = await createOrder(
        items,
        user.email,
        totalPrice,
        deliveryMode,
        address,
        token
      );

      const { order_id } = orderResponse;

      // Initiate payment
      const paymentResponse = await initiatePayment(order_id, token);

      // Create form dynamically
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
      form.target = '_self'; // Open in same tab

      // Add form fields
      Object.entries(paymentResponse).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('Failed to initiate payment. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  const totalWithDelivery = totalPrice + (deliveryMode === 'Deliver' ? 1 : 0);
  const totalInNPR = (totalWithDelivery * USD_TO_NPR_RATE).toFixed(2);
  const isOrderButtonDisabled = totalPrice === 0 || (deliveryMode === 'Deliver' && address.trim() === '');

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <PageHeader title="Order" bgColor="bg-gray-100" />
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <ProductList
              products={products}
              quantities={cartItems}
              setQuantities={setQuantityCart}
              totalPrice={totalPrice}
              deliveryMode={deliveryMode}
              address={address}
              setAddress={(addr) => {
                setAddress(addr);
              }}
              onToggle={(mode) => {
                setDeliveryMode(mode);
              }}
              addressError={addressError}
            />
          </div>
          <div className="bg-white rounded-t-3xl px-7 pt-3 pb-6 shadow-md mt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CircleDollarSign size={24} color="#D22B2B" />
                <div className="ml-3">
                  <p className="text-gray-800 text-base font-semibold">Cash/Wallet</p>
                  <p className="text-sm font-semibold">
                    $ {totalWithDelivery.toFixed(2)} (NPR {totalInNPR})
                  </p>
                </div>
              </div>
            </div>
            <button
              className={`w-full rounded-2xl mt-6 py-3 text-xl text-white font-semibold cursor-pointer transition-opacity duration-200 ${
                isOrderButtonDisabled
                  ? 'bg-gray-300 cursor-not-allowed'
                  : ' hover:bg-opacity-90'
              }`}
              style={{
                backgroundColor: isOrderButtonDisabled ? '#D1D5DB' : '#383838',
              }}
              disabled={isOrderButtonDisabled}
              onClick={orderNow}
            >
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;