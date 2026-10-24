import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAgent: boolean;
  isOwnerOrAgent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('estatehub_token');
    const savedUser = authService.getCurrentUserFromStorage();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const res = await authService.login(credentials);
    setToken(res.token);
    setUser(res);
  };

  const register = async (data: RegisterRequest) => {
    const res = await authService.register(data);
    setToken(res.token);
    setUser(res);
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAgent = user?.role === 'ROLE_AGENT';
  const isOwnerOrAgent = user?.role === 'ROLE_USER' || user?.role === 'ROLE_AGENT' || user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
        isAgent,
        isOwnerOrAgent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
