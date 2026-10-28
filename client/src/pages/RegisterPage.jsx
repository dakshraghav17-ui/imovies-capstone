import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * Registration page – name, email, password + confirm password.
 */
const RegisterPage = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirm) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome to IMovies 🎬');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        <div className="info-card">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎬</div>
            <h3 style={{ color: '#f0f9ff', fontWeight: 800, marginBottom: '4px' }}>Create Account</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Join IMovies and start booking today</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                Full Name
              </label>
              <input
                type="text"
                className="form-control search-bar"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                Email Address
              </label>
              <input
                type="email"
                className="form-control search-bar"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                Password
              </label>
              <input
                type="password"
                className="form-control search-bar"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm password */}
            <div className="mb-4">
              <label style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control search-bar"
                placeholder="Repeat your password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
              {confirm && password !== confirm && (
                <p style={{ color: '#38bdf8', fontSize: '0.8rem', marginTop: '4px', fontWeight: 600 }}>
                  Passwords don't match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: '#38bdf8', border: 'none', color: '#041019', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)' }}
            >
              {loading ? '⏳ Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
