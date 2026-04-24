import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'superadmin' | 'manager' | 'cashier';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enabledFeatures?: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isManager: boolean;
  isCashier: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  checkAccess: (allowedRoles: UserRole[]) => boolean;
  hasFeature: (featureId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TEMPLATE_ACCOUNTS = [
  {
    id: 'template-superadmin',
    name: 'TERATUR.ID Super Admin',
    email: 'superadmin@teratur.id',
    password: 'superadmin123',
    role: 'superadmin' as UserRole,
    enabledFeatures: ['kasir', 'penjualan', 'master-data', 'persediaan', 'laporan', 'settings', 'user-management', 'help', 'expenses', 'employees', 'analisis', 'multi-outlet', 'ai-chat'],
  },
  {
    id: 'template-manager',
    name: 'Manager Teratur',
    email: 'manager@teratur.id',
    password: 'manager123',
    role: 'manager' as UserRole,
    enabledFeatures: ['kasir', 'penjualan', 'master-data', 'persediaan', 'laporan', 'settings', 'user-management', 'help', 'expenses', 'employees', 'analisis', 'multi-outlet', 'ai-chat'],
  },
  {
    id: 'template-cashier',
    name: 'Kasir Teratur',
    email: 'kasir@teratur.id',
    password: 'kasir123',
    role: 'cashier' as UserRole,
    enabledFeatures: ['kasir', 'penjualan', 'expenses'],
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Seed template accounts if not exist
    const existingUsers = JSON.parse(localStorage.getItem('teratur_users') || '[]');
    const hasTemplates = existingUsers.some((u: any) => u.id === 'template-superadmin');
    if (!hasTemplates) {
      const merged = [...existingUsers, ...TEMPLATE_ACCOUNTS];
      localStorage.setItem('teratur_users', JSON.stringify(merged));
    }

    // Load current session
    const storedUser = localStorage.getItem('teratur_auth');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('teratur_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (authUser: AuthUser) => {
    localStorage.setItem('teratur_auth', JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem('teratur_auth');
    setUser(null);
    navigate('/login');
  };

  const checkAccess = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const hasFeature = (featureId: string) => {
    if (user?.role === 'superadmin') return true;
    if (!user?.enabledFeatures) return true; // Default to true if not specified (legacy)
    return user.enabledFeatures.includes(featureId);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isSuperAdmin: user?.role === 'superadmin',
    isManager: user?.role === 'manager',
    isCashier: user?.role === 'cashier',
    login,
    logout,
    checkAccess,
    hasFeature,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
