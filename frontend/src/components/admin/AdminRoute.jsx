import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // If authenticated but not admin, we might want to warn them
    if (isAuthenticated && user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
      toast.error('Access Denied: Requires Admin Privileges');
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin layouts can be injected here or inside the Outlet if preferred.
  // For now, just render the route.
  return <Outlet />;
};

export default AdminRoute;
