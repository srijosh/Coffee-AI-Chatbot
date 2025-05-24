import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Order from './pages/Order';
import ChatRoom from './pages/ChatRoom';
import Details from './pages/Details';
import ThankYou from './pages/ThankYou';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<Order />} />
            <Route path="/chat" element={<ChatRoom />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/thankyou" element={<ThankYou />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
};

export default App;