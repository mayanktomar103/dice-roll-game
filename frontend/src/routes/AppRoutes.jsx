import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import DiceGame from '../pages/DiceGame';
import History from '../pages/History';
import VIP from '../pages/VIP';
import Store from '../pages/Store';
import Profile from '../pages/Profile';
import PaymentHistory from '../pages/PaymentHistory';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game" element={<DiceGame />} />
        <Route path="/history" element={<History />} />
        <Route path="/vip" element={<VIP />} />
        <Route path="/store" element={<Store />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
