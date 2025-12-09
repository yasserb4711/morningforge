import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getUser, saveUser, removeUser } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  login: (name: string, email?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
});

// Fixed: Use explicit props type for children instead of React.FC to ensure compatibility
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadedUser = getUser();
    if (loadedUser) setUser(loadedUser);
  }, []);

  const login = (name: string, email?: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString()
    };
    saveUser(newUser);
    setUser(newUser);
  };

  const logout = () => {
    removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);