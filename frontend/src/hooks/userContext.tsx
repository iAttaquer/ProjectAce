"use client";
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import router from 'next/navigation';

const UserContext = createContext<{
  user: any | null;
  loading: boolean;
  error: any | null;
  refreshUserData: () => void;
}>({ user: null, loading: true, error: null, refreshUserData: () => {} });

export const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);
  const [isDataFetching, setIsDataFetching] = useState(false);

  const refreshUserData = useCallback(async () => {
    if (isDataFetching) return;
    setIsDataFetching(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        router.push('/login');
        return;
      }
      const response = await axios.get('/api/account/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setIsDataFetching(false);
    }
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};