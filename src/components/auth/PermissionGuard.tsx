
import React from 'react';
import { useCurrentUserPermissions } from '@/hooks/useCurrentUserPermissions';

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGuard = ({ permission, children, fallback = null }: PermissionGuardProps) => {
  const { hasPermission, isLoading } = useCurrentUserPermissions();

  if (isLoading) {
    return null;
  }

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default PermissionGuard;
