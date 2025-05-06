import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Order from './pages/Order';
import ChatRoom from './pages/ChatRoom';
import Details from './pages/Details';
import ThankYou from './pages/ThankYou';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Order />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/thankyou" element={<ThankYou />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;