import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  roles: UserRole[];
  featureId?: string;
}

export const ProtectedRoute = ({ children, roles, featureId }: ProtectedRouteProps) => {
  const { user, isLoading, checkAccess, hasFeature } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (!checkAccess(roles)) {
        // Redirect based on role
        const defaultRoute = user.role === 'cashier' ? '/transactions' : '/laporan/penjualan';
        navigate(defaultRoute);
      } else if (featureId && !hasFeature(featureId)) {
        // Feature is disabled for this user
        const defaultRoute = user.role === 'cashier' ? '/transactions' : '/dashboard';
        navigate(defaultRoute);
      }
    }
  }, [user, isLoading, roles, featureId, navigate, checkAccess, hasFeature]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !checkAccess(roles) || (featureId && !hasFeature(featureId))) {
    return null;
  }

  return <>{children}</>;
};
