import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Verify session on initial load
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authAPI.getCurrentUser();
      if (res?.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    if (res?.data?.user) {
      setUser(res.data.user);
      if (res.data.token) {
        localStorage.setItem('auth_token', res.data.token);
      }
      closeAuthModal();
      return res.data.user;
    }
    throw new Error('Authentication failed');
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register(name, email, password);
    if (res?.data?.user) {
      setUser(res.data.user);
      if (res.data.token) {
        localStorage.setItem('auth_token', res.data.token);
      }
      closeAuthModal();
      return res.data.user;
    }
    throw new Error('Registration failed');
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Session local cleanup below
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  };

  const value = {
    user,
    setUser,
    isAuthenticated: Boolean(user),
    isLoading,
    authModalOpen,
    authMode,
    setAuthMode,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
