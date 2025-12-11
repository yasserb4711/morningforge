import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { 
  getCurrentUserSession, 
  setCurrentUserSession, 
  clearCurrentUserSession, 
  authenticateUser, 
  registerUser,
  updateUserRecord
} from '../services/storageService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  activateTrial: () => void;
  togglePro: () => void;
  isTrialUsed: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isAuthenticated: false,
  activateTrial: () => {},
  togglePro: () => {},
  isTrialUsed: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = getCurrentUserSession(); // This now calls checkAndExpireTrial internally
    if (session) setUser(session);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authenticatedUser = authenticateUser(email, password);
      setCurrentUserSession(authenticatedUser);
      setUser(authenticatedUser);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const newUser = registerUser(name, email, password);
      setCurrentUserSession(newUser);
      setUser(newUser);
    } catch (error) {
       throw error;
    }
  };

  const logout = () => {
    clearCurrentUserSession();
    setUser(null);
  };

  const activateTrial = () => {
    if (!user) return;
    
    if (user.trialStartDate) {
        throw new Error("Trial already used.");
    }

    const updatedUser: User = {
        ...user,
        isPro: true,
        trialStartDate: new Date().toISOString()
    };
    updateUserRecord(updatedUser);
    setUser(updatedUser);
  };

  const togglePro = () => {
    if (!user) return;
    const updatedUser = { ...user, isPro: !user.isPro };
    updateUserRecord(updatedUser);
    setUser(updatedUser);
  };

  const isTrialUsed = !!user?.trialStartDate;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, activateTrial, togglePro, isTrialUsed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);