import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import toast from 'react-hot-toast';
import ProtectedRoute from './ProtectedRoute';
import { useEffect } from 'react';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access restricted to administrators');
    }
  }, [user]);

  if (user && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default AdminRoute;
