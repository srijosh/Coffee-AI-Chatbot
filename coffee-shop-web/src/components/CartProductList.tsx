import React from 'react';
import OrdersHeader from './OrdersHeader';
import OrdersFooter from './OrdersFooter';
import { Product } from '../types/types';

interface ProductListProps {
  products: Product[];
  quantities: { [key: string]: number };
  setQuantities: (itemKey: string, delta: number) => void;
  totalPrice: number;
  deliveryMode: 'Deliver' | 'Pick Up';
  address: string;
  setAddress: (address: string) => void;
  onToggle: (mode: 'Deliver' | 'Pick Up') => void;
  addressError: string | null;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  quantities,
  setQuantities,
  totalPrice,
  deliveryMode,
  address,
  setAddress,
  onToggle,
  addressError,
}) => {
  const filteredProducts = products.filter((product) => (quantities[product.name] || 0) > 0);

  return (
    <div>
      {filteredProducts.length > 0 ? (
        <div>
          <OrdersHeader
            deliveryMode={deliveryMode}
            address={address}
            setAddress={setAddress}
            onToggle={onToggle}
            addressError={addressError}
          />
          {filteredProducts.map((item) => (
            <div key={item.id} className="flex items-center justify-between mx-7 pb-3">
              <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 ml-4">
                <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantities(item.name, -1)}
                  className="text-xl text-gray-700 p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                  −
                </button>
                <p className="mx-2 text-gray-800">{quantities[item.name] || 0}</p>
                <button
                  onClick={() => setQuantities(item.name, 1)}
                  className="text-xl text-gray-700 p-1 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <OrdersFooter totalPrice={totalPrice} deliveryMode={deliveryMode} />
        </div>
      ) : (
        <div className="mx-7 text-center">
          <p className="text-2xl font-semibold text-gray-500 mb-4">No items in your cart yet</p>
          <p className="text-xl font-semibold text-gray-500">Let's Go Get some Delicious Goodies</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;