
type UserPermission = {
  read: boolean;
  write: boolean;
  delete?: boolean;
};

export type UserPermissions = {
  [resource: string]: UserPermission;
};

/**
 * Process raw permissions data into standardized UserPermissions format
 */
export const processPermissions = (permObj: any): UserPermissions => {
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

/**
 * Create admin permissions with full access to all resources
 */
export const createAdminPermissions = (): UserPermissions => {
  const adminPermissions: UserPermissions = {
    '': { read: true, write: true, delete: true },
    'vehicles': { read: true, write: true, delete: true },
    'dealers': { read: true, write: true, delete: true },
    'pricing': { read: true, write: true, delete: true },
    'users': { read: true, write: true, delete: true },
    'profile': { read: true, write: true, delete: true }
  };
  return adminPermissions;
};

/**
 * Check if a user has permission for a specific resource and action
 */
export const checkPermission = (
  permissions: UserPermissions, 
  resource: string, 
  action: 'read' | 'write' | 'delete',
  userRole: string | null
): boolean => {
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
