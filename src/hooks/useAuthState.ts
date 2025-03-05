
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserPermissions, processPermissions, createAdminPermissions } from '@/utils/auth/permissionUtils';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions>({});

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
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user role:', userError);
        setUserRole('User');
        setPermissions({
          '': { read: true, write: false, delete: false }
        });
        setIsLoading(false);
        return;
      }

      console.log('User profile data:', userData);

      if (userData && userData.roles) {
        const roleData = userData.roles;
        const roleName = roleData.name;
        
        console.log('Role data:', roleData);
        console.log('Role name:', roleName);
        
        setUserRole(roleName);
        
        if (roleName === 'Admin') {
          console.log('Admin user detected, setting full permissions');
          setPermissions(createAdminPermissions());
        } else {
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
        }
      } else {
        // Set default values even if no role information is available
        console.warn('No roles found for user', userId);
        setUserRole('User');
        setPermissions({
          '': { read: true, write: false, delete: false }
        });
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      // Default values on error and stop loading
      setUserRole('User');
      setPermissions({
        '': { read: true, write: false, delete: false }
      });
    } finally {
      // Critical: Always set isLoading to false here to prevent infinite loading
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const setupAuth = async () => {
      try {
        console.log('Setting up auth...');
        setIsLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        console.log('Session:', session ? 'Found' : 'Not found');
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          // No user is logged in, set loading to false
          console.log('No user logged in, setting loading to false');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in setupAuth:', error);
        setIsLoading(false);
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          console.log('Auth state changed, event:', _event);
          setSession(session);
          setUser(session?.user || null);
          
          if (session?.user) {
            await fetchUserRole(session.user.id);
          } else {
            setUserRole(null);
            setPermissions({});
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error in onAuthStateChange:', error);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    isLoading,
    userRole,
    permissions
  };
};
