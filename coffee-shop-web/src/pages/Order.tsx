import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { CircleDollarSign  } from 'lucide-react';
import { fetchProducts } from '../services/productService';
import ProductList from '../components/CartProductList';
import { useCart } from '../components/CartContext';
import { Product } from '../types/types';
import { toast } from 'react-toastify';

const Order: React.FC = () => {
  const { cartItems, setQuantityCart, emptyCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState<'Deliver' | 'Pick Up'>('Deliver');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);

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

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  const orderNow = () => {
    if (deliveryMode === 'Deliver' && address.trim() === '') {
      setAddressError('Address is required');
      return;
    }
    try {
      emptyCart();
      toast.success('Order placed successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/thankyou');
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('Failed to place order. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

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
                    $ {(totalPrice > 0 ? totalPrice + (deliveryMode === 'Deliver' ? 1 : 0) : 0).toFixed(2)}
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