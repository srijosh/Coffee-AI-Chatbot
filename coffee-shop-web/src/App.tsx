import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import Navigation from './components/Navigation';
import AdminNavbar from './components/AdminNavbar';
import AdminStatsPage from './pages/AdminStatsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import Home from './pages/Home';
import Order from './pages/Order';
import ChatRoom from './pages/ChatRoom';
import Details from './pages/Details';
import ThankYou from './pages/ThankYou';
import Login from './components/Login';
import Register from './components/Register';
import Account from './pages/Account';
import OrderSummary from './pages/OrderSummary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLayout: React.FC = () => {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<UserLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/order" element={<Order />} />
              <Route path="/chat" element={<ChatRoom />} />
              <Route path="/details/:id" element={<Details />} />
              <Route path="/thankyou" element={<ThankYou />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/order-summary" element={<OrderSummary />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Route>

            <Route path="/admin/*" element={
              <>
                <AdminNavbar />
                <Routes>
                  <Route path="stats" element={<AdminStatsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="*" element={<AdminStatsPage />} />
                </Routes>
              </>
            } />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
};

export default App;