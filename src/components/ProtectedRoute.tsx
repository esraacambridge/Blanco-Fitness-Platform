import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/Feedback';

export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, role, loading, roleLoading } = useAuth();

  if (loading || (user && roleLoading)) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && role !== 'admin' && role !== 'super_admin') return <Navigate to="/login" replace />;

  return <>{children}</>;
}
