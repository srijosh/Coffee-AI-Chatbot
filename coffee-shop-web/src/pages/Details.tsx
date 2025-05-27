import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DetailsHeader from '../components/DetailsHeader';
import DescriptionSection from '../components/DescriptionSection';
import { fetchProducts } from '../services/productService';
import { useCart } from '../components/CartContext';
import { Product } from '../types/types';
import { toast } from 'react-toastify';
import { useAuth } from '../components/AuthContext';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, isAuthLoading } = useAuth();

  useEffect(() => {
    
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
    }
    if (isAuthLoading) {
      return; // Wait for auth state to be ready
    }
    const loadProduct = async () => {
      try {
        const products = await fetchProducts();
        const foundProduct = products.find((p) => p.id === id);
        if (!foundProduct) {
          throw new Error('Product not found');
        }
        console.log('Fetched product:', foundProduct); // Debug log
        setProduct(foundProduct);
      } catch (err) {
        setError("Error fetching product: " + err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-10 text-gray-600">Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product.name, 1);
    toast.success(`${product.name} added to cart`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <DetailsHeader imageUrl={product.image_url} name={product.name} />
        <div className="p-4">
          <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
          <p className="text-gray-500 text-sm">{product.category}</p>
          <p className="text-gray-900 text-xl font-semibold mt-2">$ {product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full py-3 text-white rounded-xl font-semibold hover:bg-opacity-90 transition-opacity duration-200 cursor-pointer"
            style={{ backgroundColor: '#383838' }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#202020')} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#383838')}
          >
            Add to Cart
          </button>
          <DescriptionSection description={product.description} rating={product.rating} />
        </div>
      </div>
    </div>
  );
};

export default Details;