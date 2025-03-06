
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCurrentUserPermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // First, get the user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profile')
          .select('id, role_id')
          .eq('auth_id', user.id)
          .single();

        if (profileError) throw profileError;
        
        if (!profile) {
          setPermissions([]);
          setIsLoading(false);
          return;
        }

        // Get role permissions
        const { data: rolePermissions, error: roleError } = await supabase
          .from('role_permissions')
          .select(`
            permission:permission_id(name)
          `)
          .eq('role_id', profile.role_id);

        if (roleError) throw roleError;

        // Get user-specific permissions
        const { data: userPermissions, error: userError } = await supabase
          .from('user_permissions')
          .select(`
            permission:permission_id(name)
          `)
          .eq('user_id', profile.id);

        if (userError) throw userError;

        // Combine role and user permissions
        const rolePerms = rolePermissions.map(rp => rp.permission?.name).filter(Boolean) as string[];
        const userPerms = userPermissions.map(up => up.permission?.name).filter(Boolean) as string[];
        
        // Merge permissions (user permissions override role permissions)
        setPermissions([...new Set([...rolePerms, ...userPerms])]);
      } catch (err) {
        console.error('Error fetching permissions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const hasPermission = (permissionName: string): boolean => {
    return permissions.includes(permissionName);
  };

  return {
    permissions,
    hasPermission,
    isLoading
  };
};
