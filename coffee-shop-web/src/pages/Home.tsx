import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchProducts } from '../services/productService';
import SearchArea from '../components/SearchArea';
import { useCart } from '../components/CartContext';
import { Product, ProductCategory } from '../types/types';
import { toast } from 'react-toastify';
import { useAuth } from '../components/AuthContext';

const Home: React.FC = () => {
  const { token, isAuthLoading  } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    
      if (!token) {
        navigate('/login', { state: { from: location.pathname } });
      }
      if (isAuthLoading) {
      return; // Wait for auth state to be ready
    }
    }, [token, navigate, location]);

  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [shownProducts, setShownProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let filteredProducts = [...products];
    if (selectedCategory !== 'All') {
      filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory);
    }
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setShownProducts(filteredProducts);

    const updatedCategories = productCategories.map((category) => ({
      ...category,
      selected: category.id === selectedCategory,
    }));
    setProductCategories(updatedCategories);
  }, [selectedCategory, searchQuery, products]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        const categories = productsData.map((product) => product.category);
        categories.unshift('All');
        const uniqueCategories = Array.from(new Set(categories)).map((category) => ({
          id: category,
          selected: category === 'All',
        }));

        setProducts(productsData);
        setShownProducts(productsData);
        setProductCategories(uniqueCategories);
      } catch (err) {
        setError("Error fetching products: " + err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  const handleAddToCart = (name: string) => {
    addToCart(name, 1);
    toast.success(`${name} added to cart`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="w-full bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <SearchArea onSearchQueryChange={handleSearchQueryChange} onReset={handleReset} searchQuery={searchQuery} />
        {/* <Banner /> */}
        <div className="flex justify-center mt-14">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {productCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`text-sm px-4 py-2 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                  category.id === selectedCategory
                    ? ' text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={{
                  backgroundColor: category.id === selectedCategory ? '#383838' : undefined,
                }}
              >
                {category.id}
              </button>
            ))}
          </div>
        </div>
        {shownProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {shownProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 flex flex-col justify-between shadow-md"
              >
                <button
                  onClick={() => navigate(`/details/${item.id}`)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-2xl"
                  />
                  <p className="text-gray-800 text-lg font-semibold mt-2 text-left w-full">{item.name}</p>
                  <p className="text-gray-500 text-sm text-left w-full">{item.category}</p>
                </button>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-gray-900 text-xl font-semibold">$ {item.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleAddToCart(item.name)}
                    className="px-3 py-1 text-white rounded-sm cursor-pointer duration-200"
                    style={{ backgroundColor: '#383838' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#202020')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#383838')}
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;