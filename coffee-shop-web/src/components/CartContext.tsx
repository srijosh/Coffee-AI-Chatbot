import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cartItems: { [key: string]: number };
  addToCart: (name: string, quantity: number) => void;
  setQuantityCart: (name: string, delta: number) => void;
  emptyCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  const addToCart = (name: string, quantity: number) => {
    setCartItems((prev) => {
      const Quantity = parseInt(quantity.toString(), 10);
      const newQuantity = (prev[name] || 0) + Quantity;
      return { ...prev, [name]: newQuantity > 0 ? newQuantity : 0 };
    });
  };

  const setQuantityCart = (name: string, delta: number) => {
    setCartItems((prev) => {
      const newQuantity = (prev[name] || 0) + delta;
      if (newQuantity <= 0) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: newQuantity };
    });
  };

  const emptyCart = () => {
    setCartItems({});
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, setQuantityCart, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};