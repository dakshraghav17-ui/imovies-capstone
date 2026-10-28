import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * Responsive dark navbar.
 * Shows admin link only for users with role === 'admin'.
 */
const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate  = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsOpen(false);
  };

  const close = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">

        {/* Brand */}
        <NavLink to="/" className="navbar-brand navbar-brand-custom" onClick={close}>
          🎬 IMovies
        </NavLink>

        {/* Mobile hamburger */}
        <button
          className="navbar-toggler"
          style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Toggle navigation"
        >
          <span style={{ color: '#38bdf8', fontSize: '1.4rem' }}>☰</span>
        </button>

        {/* Collapsible menu */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>

          {/* Left links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link-custom nav-link${isActive ? ' active' : ''}`}
                onClick={close}
              >
                🏠 Home
              </NavLink>
            </li>

            {user && (
              <li className="nav-item">
                <NavLink
                  to="/bookings"
                  className={({ isActive }) => `nav-link-custom nav-link${isActive ? ' active' : ''}`}
                  onClick={close}
                >
                  🎟️ My Bookings
                </NavLink>
              </li>
            )}

            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `nav-link-custom nav-link${isActive ? ' active' : ''}`}
                  onClick={close}
                >
                  ⚙️ Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right: auth controls */}
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}>
                  👤 {user.name}
                </span>
                <button
                  className="btn btn-sm"
                  style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', fontWeight: 600 }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="btn btn-sm"
                  style={{ color: '#f0f9ff', border: '1px solid #1e2638', borderRadius: '8px', background: '#171b26', fontWeight: 600 }}
                  onClick={close}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn btn-sm"
                  style={{ background: '#38bdf8', color: '#041019', border: 'none', borderRadius: '8px', fontWeight: 700, boxShadow: '0 2px 10px rgba(56, 189, 248, 0.25)' }}
                  onClick={close}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
