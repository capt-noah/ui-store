import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API = `${import.meta.env.VITE_API_URL}/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // { _id, name, email, role }
  const [loading, setLoading] = useState(true); // true while fetching session on mount

  // On app load, check if a session cookie exists and restore user state
  useEffect(() => {
    fetch(`${API}/me`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (name, email, password) => {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    setUser(data);
    return data;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setUser(data);
    return data;
  };

  const logout = async () => {
    await fetch(`${API}/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await fetch(`${API}/me`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return data;
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
