import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps routes that require authentication.
 * Pass adminOnly={true} to restrict to admin users.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  // Still resolving the stored token – show spinner
  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border" style={{ color: '#38bdf8' }} role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (!user)                              return <Navigate to="/login"  replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/"      replace />;

  return children;
};

export default ProtectedRoute;
