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
      
      const { data: userData, error: userError } = await supabase
        .from('user_profile')
        .select(`
          auth_id,
          role_id,
          roles (
            id, name, permissions
          )
        `)
        .eq('auth_id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user role:', userError);
        return;
      }

      console.log('User profile data:', userData);

      if (userData && userData.roles) {
        const roleData = userData.roles;
        const roleName = roleData.name;
        
        console.log('Role data:', roleData);
        console.log('Role name:', roleName);
        console.log('Role permissions (raw):', roleData.permissions);
        
        setUserRole(roleName);
        
        if (roleName === 'Admin') {
          console.log('Admin user detected, setting full permissions');
          const adminPermissions: UserPermissions = {
            '': { read: true, write: true, delete: true },
            'vehicles': { read: true, write: true, delete: true },
            'dealers': { read: true, write: true, delete: true },
            'pricing': { read: true, write: true, delete: true },
            'users': { read: true, write: true, delete: true },
            'profile': { read: true, write: true, delete: true }
          };
          setPermissions(adminPermissions);
          return;
        }
        
        let rolePermissions: UserPermissions = {};

        try {
          if (typeof roleData.permissions === 'string') {
            const parsedPermissions = JSON.parse(roleData.permissions);
            console.log('Parsed permissions:', parsedPermissions);
            if (parsedPermissions && typeof parsedPermissions === 'object' && !Array.isArray(parsedPermissions)) {
              rolePermissions = processPermissions(parsedPermissions);
            }
          } else if (roleData.permissions && typeof roleData.permissions === 'object' && !Array.isArray(roleData.permissions)) {
            console.log('Object permissions:', roleData.permissions);
            rolePermissions = processPermissions(roleData.permissions);
          }
        } catch (e) {
          console.error('Error parsing permissions:', e);
          rolePermissions = {};
        }

        console.log('Final processed permissions:', rolePermissions);
        setPermissions(rolePermissions);
      } else {
        console.warn('No roles found for user', userId);
        setUserRole('User');
        setPermissions({
          '': { read: true, write: false, delete: false }
        });
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
    }
  };

  const processPermissions = (permObj: any): UserPermissions => {
    const processed: UserPermissions = {};
    
    if ('read' in permObj || 'write' in permObj || 'delete' in permObj) {
      processed[''] = {
        read: Boolean(permObj.read),
        write: Boolean(permObj.write),
        delete: Boolean(permObj.delete)
      };
      
      const resources = ['vehicles', 'dealers', 'pricing', 'users', 'profile'];
      resources.forEach(resource => {
        processed[resource] = {
          read: Boolean(permObj.read),
          write: Boolean(permObj.write),
          delete: Boolean(permObj.delete)
        };
      });
    } else {
      processed[''] = { read: true, write: false, delete: false };
      
      Object.keys(permObj).forEach(key => {
        if (typeof permObj[key] === 'object' && !Array.isArray(permObj[key])) {
          processed[key] = {
            read: Boolean(permObj[key].read),
            write: Boolean(permObj[key].write),
            delete: Boolean(permObj[key].delete)
          };
        }
      });
    }
    
    if (!processed['']) {
      processed[''] = { read: true, write: false, delete: false };
    }
    
    return processed;
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
    console.log(`Checking permission for ${resource}:${action}`, { permissions, userRole });
    
    if (resource === '' && action === 'read') {
      return true;
    }
    
    if (userRole === 'Admin') {
      console.log('User is Admin, granting all permissions');
      return true;
    }
    
    if (!permissions) {
      return false;
    }
    
    if (permissions[resource] && permissions[resource][action] === true) {
      return true;
    }
    
    if (permissions[''] && permissions[''][action] === true) {
      return true;
    }
    
    return false;
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
