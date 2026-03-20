import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  phone: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await api.getMe();
        if (userData) {
          setUser(userData);
          console.log("user updated to ");
          console.log(user);
        }
      } catch (e) {
        console.error("Session check failed", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const [callsAval, updateCallsAva] = React.useState<number>();

  React.useEffect(() => {
    (async () => {
      const data = await api.totalCallsAvaliable();
      updateCallsAva(parseInt(data.balance) / 0.1);
    })()
  }, [])

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, credits: callsAval }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
