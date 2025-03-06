
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Permission, UserPermission, RolePermission } from '@/services/user/types';

// Fetch all permissions
export const fetchPermissions = async (): Promise<Permission[]> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('category', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching permissions:', error);
    return [];
  }
};

// Fetch user permissions
export const fetchUserPermissions = async (userId: number): Promise<UserPermission[]> => {
  try {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
};

// Fetch role permissions
export const fetchRolePermissions = async (roleId: number): Promise<RolePermission[]> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('*')
      .eq('role_id', roleId);
    
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching role permissions:', error);
    return [];
  }
};

export const usePermissions = (userId?: number, roleId?: number) => {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const permissions = await fetchPermissions();
        setAllPermissions(permissions);

        if (userId) {
          const userPerms = await fetchUserPermissions(userId);
          setUserPermissions(userPerms);
        }

        if (roleId) {
          const rolePerms = await fetchRolePermissions(roleId);
          setRolePermissions(rolePerms);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load permissions');
        console.error('Error loading permissions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, roleId]);

  // Get array of permission IDs for user
  const userPermissionIds = userPermissions.map(up => up.permission_id);
  
  // Get array of permission IDs for role
  const rolePermissionIds = rolePermissions.map(rp => rp.permission_id);

  // Group permissions by category
  const permissionsByCategory = allPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return {
    allPermissions,
    userPermissions,
    rolePermissions,
    userPermissionIds,
    rolePermissionIds,
    permissionsByCategory,
    isLoading,
    error
  };
};
