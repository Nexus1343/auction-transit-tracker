
import React, { createContext, useContext, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import { UserPermissions, checkPermission } from '@/utils/auth/permissionUtils';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userRole: string | null;
  permissions: UserPermissions;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (resource: string, action: 'read' | 'write' | 'delete') => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session, isLoading, userRole, permissions } = useAuthState();
  const { isLoading: authActionLoading, signIn, signUp, signOut } = useAuthActions();
  const { toast } = useToast();

  useEffect(() => {
    // Log auth state for debugging
    console.log('Auth Provider State:', { 
      isAuthenticated: !!user, 
      isLoading, 
      authActionLoading,
      userRole
    });
  }, [user, isLoading, authActionLoading, userRole]);

  const hasPermission = (resource: string, action: 'read' | 'write' | 'delete'): boolean => {
    return checkPermission(permissions, resource, action, userRole);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading: isLoading || authActionLoading, 
      userRole,
      permissions,
      signIn, 
      signUp, 
      signOut,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
