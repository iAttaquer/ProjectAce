"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const useUser = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          router.push('/login');
          return;
        }

        const response = await axios.get('api/account/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      }
      catch (error: any) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/login');
          console.error("Unauthorized access. Redirecting to login.");
        }
        setError(error.message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return { user, loading, error };
};