import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/react';

import { AuthProvider }    from './context/AuthContext';
import Navbar              from './components/Navbar';
import ProtectedRoute      from './components/ProtectedRoute';

import HomePage            from './pages/HomePage';
import MovieDetailPage     from './pages/MovieDetailPage';
import BookingPage         from './pages/BookingPage';
import MyBookingsPage      from './pages/MyBookingsPage';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import AdminPage           from './pages/AdminPage';

function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', background: '#08090c' }}>
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/register"   element={<RegisterPage />} />

          {/* Protected – any logged-in user */}
          <Route path="/booking/:showId" element={
            <ProtectedRoute><BookingPage /></ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
          } />

          {/* Protected – admin only */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
          } />
        </Routes>

        {/* Global toast notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="dark"
        />

        {/* Vercel Web Analytics */}
        <Analytics />
      </div>
    </AuthProvider>
  );
}

export default App;
