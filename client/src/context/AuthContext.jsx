import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

/** Auth context shared across the app */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('imovies_token'));
  const [loading, setLoading] = useState(true);

  // On mount (or when token changes), validate the stored token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token]);

  /** Fetch current user profile */
  const fetchMe = async () => {
    try {
      const res = await axios.get('/api/v1/auth/me');
      setUser(res.data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  /** Login with email + password */
  const login = async (email, password) => {
    const res = await axios.post('/api/v1/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('imovies_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  /** Register a new account */
  const register = async (name, email, password) => {
    const res = await axios.post('/api/v1/auth/register', { name, email, password });
    const { token: newToken, user: newUser } = res.data;
    localStorage.setItem('imovies_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  /** Clear session */
  const logout = () => {
    localStorage.removeItem('imovies_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook: const { user, login, logout, isAdmin } = useAuth() */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
