
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('Protected Route - Auth state:', { isLoading, isAuthenticated: !!user });
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth loading state has been active for too long, might be stuck');
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
          <p className="mt-2 text-xs text-gray-400">If this takes too long, try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated, rendering outlet');
  return <Outlet />;
};

export default ProtectedRoute;
