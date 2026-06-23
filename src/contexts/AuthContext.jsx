import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUserId = localStorage.getItem('user_id');
    const savedEmail = localStorage.getItem('user_email');

    if (savedToken && savedUserId) {
      setToken(savedToken);
      setUser({ id: parseInt(savedUserId), email: savedEmail });
    }
    setLoading(false);
  }, []);

  const login = (userId, email, authToken) => {
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user_id', userId);
    localStorage.setItem('user_email', email);
    setToken(authToken);
    setUser({ id: userId, email });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
