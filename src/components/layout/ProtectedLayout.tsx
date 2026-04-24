import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { Layout } from './Layout';

interface ProtectedLayoutProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedLayout = ({ children, allowedRoles }: ProtectedLayoutProps) => {
  const { user, isLoading, checkAccess } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (allowedRoles && !checkAccess(allowedRoles)) {
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, allowedRoles, navigate, checkAccess]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !checkAccess(allowedRoles)) {
    return null;
  }

  return <Layout>{children}</Layout>;
};
