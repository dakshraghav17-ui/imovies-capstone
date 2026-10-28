import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * Login page – centered card with demo credentials shown.
 */
const LoginPage = () => {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Fill in demo credentials
  const fillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@imovies.com');
      setPassword('password123');
    } else {
      setEmail('john@example.com');
      setPassword('password123');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Card */}
        <div className="info-card">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎬</div>
            <h3 style={{ color: '#f0f9ff', fontWeight: 800, marginBottom: '4px' }}>Welcome Back</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Sign in to your IMovies account</p>
          </div>

          <form onSubmit={handleSubmit}>
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
            <div className="mb-4">
              <label style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                Password
              </label>
              <input
                type="password"
                className="form-control search-bar"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: '#38bdf8', border: 'none', color: '#041019', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)' }}
            >
              {loading ? '⏳ Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Register link */}
          <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '20px', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
              Register
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="info-card mt-3" style={{ border: '1px solid rgba(56, 189, 248, 0.18)' }}>
          <p style={{ color: '#f0f9ff', fontSize: '0.8rem', marginBottom: '10px', fontWeight: 600 }}>
            🔑 Demo Accounts (click to fill)
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fillDemo('user')}
              style={{ background: '#171b26', border: '1px solid #1e2638', color: '#94a3b8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}
            >
              👤 User: john@example.com
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              style={{ background: '#171b26', border: '1px solid #1e2638', color: '#94a3b8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}
            >
              ⚙️ Admin: admin@imovies.com
            </button>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '8px', marginBottom: 0 }}>
            Password for all demo accounts: <strong style={{ color: '#38bdf8' }}>password123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
