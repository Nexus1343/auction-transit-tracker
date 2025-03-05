
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type UserPermission = {
  read: boolean;
  write: boolean;
  delete?: boolean;
};

type UserPermissions = {
  [resource: string]: UserPermission;
};

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for user ID:', userId);
      
      const { data, error } = await supabase
        .from('user_profile')
        .select(`
          role_id,
          roles (
            id, name, permissions
          )
        `)
        .eq('auth_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return;
      }

      console.log('User profile data:', data);

      if (data && data.roles) {
        const roleData = data.roles;
        const roleName = roleData.name;
        
        console.log('Role data:', roleData);
        console.log('Role name:', roleName);
        console.log('Role permissions (raw):', roleData.permissions);
        
        let rolePermissions: UserPermissions = {};

        try {
          if (typeof roleData.permissions === 'string') {
            const parsedPermissions = JSON.parse(roleData.permissions);
            console.log('Parsed permissions:', parsedPermissions);
            if (parsedPermissions && typeof parsedPermissions === 'object' && !Array.isArray(parsedPermissions)) {
              rolePermissions = validatePermissionsObject(parsedPermissions);
            }
          } else if (roleData.permissions && typeof roleData.permissions === 'object' && !Array.isArray(roleData.permissions)) {
            console.log('Object permissions:', roleData.permissions);
            rolePermissions = validatePermissionsObject(roleData.permissions);
          }
        } catch (e) {
          console.error('Error parsing permissions:', e);
          rolePermissions = {};
        }

        console.log('Final processed permissions:', rolePermissions);
        
        setUserRole(roleName);
        setPermissions(rolePermissions);
      } else {
        console.warn('No roles found for user', userId);
        // Set default permissions - giving basic access to dashboard
        setUserRole('User');
        setPermissions({
          '': { read: true, write: false, delete: false }
        });
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  };

  const validatePermissionsObject = (obj: any): UserPermissions => {
    const validatedPermissions: UserPermissions = {};
    
    Object.keys(obj).forEach(resource => {
      const resourcePermissions = obj[resource];
      
      if (resourcePermissions && typeof resourcePermissions === 'object') {
        validatedPermissions[resource] = {
          read: Boolean(resourcePermissions.read),
          write: Boolean(resourcePermissions.write),
          delete: resourcePermissions.delete !== undefined ? Boolean(resourcePermissions.delete) : undefined
        };
      }
    });
    
    // Ensure at least dashboard access
    if (!validatedPermissions['']) {
      validatedPermissions[''] = { read: true, write: false, delete: false };
    }
    
    return validatedPermissions;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
          setPermissions({});
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const hasPermission = (resource: string, action: 'read' | 'write' | 'delete'): boolean => {
    console.log(`Checking permission for ${resource}:${action}`, { permissions });
    
    // If resource is empty (dashboard) and we're checking read permission
    if (resource === '' && action === 'read') {
      return true; // Always allow dashboard access
    }
    
    // Special case: Admin role has all permissions
    if (userRole === 'Admin') {
      console.log('User is Admin, granting all permissions');
      return true;
    }
    
    // Check specific permission
    if (!permissions || !permissions[resource]) {
      return false;
    }
    
    return !!permissions[resource][action];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
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
