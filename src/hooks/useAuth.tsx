import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'superadmin' | 'manager' | 'cashier';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  outletId?: string;
  enabledFeatures?: string[];
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isManager: boolean;
  isCashier: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  checkAccess: (allowedRoles: UserRole[]) => boolean;
  hasFeature: (featureId: string) => boolean;
  addAuditLog: (action: string, target: string, type?: 'create' | 'update' | 'delete' | 'access') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const TEMPLATE_ACCOUNTS = [
  {
    id: 'template-superadmin',
    name: 'Internal Developer',
    email: 'dev@teratur.id',
    password: 'password123',
    role: 'superadmin' as UserRole,
    enabledFeatures: ['kasir', 'penjualan', 'master-data', 'persediaan', 'laporan', 'settings', 'user-management', 'help', 'expenses', 'employees', 'analisis', 'multi-outlet', 'ai-chat'],
  },
  {
    id: 'template-manager',
    name: 'Owner Demo',
    email: 'demo-owner@teratur.id',
    password: 'password123',
    role: 'manager' as UserRole,
    enabledFeatures: ['kasir', 'penjualan', 'master-data', 'persediaan', 'laporan', 'settings', 'user-management', 'help', 'expenses', 'employees', 'analisis', 'multi-outlet', 'ai-chat'],
  },
  {
    id: 'template-cashier',
    name: 'Cashier Demo',
    email: 'demo-cashier@teratur.id',
    password: 'password123',
    role: 'cashier' as UserRole,
    enabledFeatures: ['kasir', 'penjualan', 'expenses'],
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const addAuditLog = (action: string, target: string, type: 'create' | 'update' | 'delete' | 'access' = 'access') => {
    const logs = JSON.parse(localStorage.getItem('teratur_audit_logs') || '[]');
    const newLog = {
      id: Date.now(),
      user: user?.name || 'Guest',
      action,
      target,
      time: new Date().toLocaleString('id-ID'),
      ip: '127.0.0.1', // Mock IP
      type
    };
    localStorage.setItem('teratur_audit_logs', JSON.stringify([newLog, ...logs].slice(0, 100)));
  };

  useEffect(() => {
    // Load current session
    const storedUser = localStorage.getItem('teratur_auth');
    const storedToken = localStorage.getItem('teratur_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem('teratur_auth');
        localStorage.removeItem('teratur_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (authUser: AuthUser, authToken: string) => {
    localStorage.setItem('teratur_auth', JSON.stringify(authUser));
    localStorage.setItem('teratur_token', authToken);
    setUser(authUser);
    setToken(authToken);
    
    // Direct log for login since state might not be updated yet
    const logs = JSON.parse(localStorage.getItem('teratur_audit_logs') || '[]');
    const newLog = {
      id: Date.now(),
      user: authUser.name,
      action: 'Login ke Sistem',
      target: 'Terminal Web',
      time: new Date().toLocaleString('id-ID'),
      ip: '127.0.0.1',
      type: 'access' as const
    };
    localStorage.setItem('teratur_audit_logs', JSON.stringify([newLog, ...logs].slice(0, 100)));
  };

  const logout = () => {
    addAuditLog('Logout dari Sistem', 'Terminal Web', 'access');
    localStorage.removeItem('teratur_auth');
    localStorage.removeItem('teratur_token');
    setUser(null);
    setToken(null);
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
    token,
    isLoading,
    isSuperAdmin: user?.role === 'superadmin',
    isManager: user?.role === 'manager',
    isCashier: user?.role === 'cashier',
    login,
    logout,
    checkAccess,
    hasFeature,
    addAuditLog,
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
