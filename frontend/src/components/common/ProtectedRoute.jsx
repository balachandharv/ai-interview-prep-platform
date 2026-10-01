import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[rgba(6,182,212,0.12)] border-t-[var(--aqua-400)] rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)] font-medium animate-pulse">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
