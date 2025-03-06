
import { useEffect, useState } from 'react';
import { fetchPermissions, fetchRolePermissions, fetchUserPermissions } from '@/services/user/userService';
import { Permission, UserPermission, RolePermission } from '@/services/user/types';

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
