
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface RoleBasedRouteProps {
  resource: string;
  requiredAction: 'read' | 'write' | 'delete';
  redirectPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  resource,
  requiredAction,
  redirectPath = '/'
}) => {
  const { isLoading, user, hasPermission } = useAuth();

  useEffect(() => {
    console.log('Role Based Route - Auth state:', { 
      isLoading, 
      isAuthenticated: !!user,
      resource,
      requiredAction,
      hasPermission: user ? hasPermission(resource, requiredAction) : false
    });
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth loading state has been active for too long, might be stuck');
      }
    }, 10000); // 10 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [isLoading, user, resource, requiredAction, hasPermission]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
          <p className="mt-2 text-xs text-gray-400">If this takes too long, try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(resource, requiredAction)) {
    console.log(`User doesn't have permission: ${resource}:${requiredAction}, redirecting to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('User has necessary permissions, rendering outlet');
  return <Outlet />;
};

export default RoleBasedRoute;
