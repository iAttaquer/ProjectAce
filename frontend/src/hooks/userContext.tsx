"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

const UserContext = createContext<{
  user: User | null;
  loading: boolean;
  error: React.ReactNode | null;
  refreshUserData: () => void;
}>({ user: null, loading: true, error: null, refreshUserData: () => {} });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [isDataFetching, setIsDataFetching] = useState(false);
  const router = useRouter();

  const refreshUserData = useCallback(async () => {
    if (isDataFetching) return;
    setIsDataFetching(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        router.replace("/login");
        return;
      }
      const response = await axios.get("/api/account/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          // console.log(error.response.data); // for debug

          if (status === 401) {
            localStorage.removeItem("authToken");
            router.replace("/login");
            setError(<li>{"Nieupoważniony dostęp. Zaloguj się ponownie."}</li>);
          }
          if (Array.isArray(error.response.data)) {
            const errorListItems = error.response.data
              .filter((err) => err.description)
              .map((err, index) => <li key={index}>{err.description}</li>);
            setError(errorListItems);
          } else {
            setError(<li>{"Błąd połączenia z serwerem"}</li>);
          }
        } else {
          setError(<li>{"Błąd rejestracji"}</li>);
        }
      } else {
        setError(<li>{"Nieoczekiwany błąd"}</li>);
      }
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
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
