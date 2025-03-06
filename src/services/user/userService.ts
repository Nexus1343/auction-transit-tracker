
// Export all user service functions from their respective files
import { fetchUsers, fetchUser } from './userFetchService';
import { addUser, updateUser, deleteUser } from './userCrudService';
import { fetchUserPermissions, updateUserPermissions } from './userPermissionService';
import { fetchRoles, fetchPermissions } from './roleService';

export {
  // User fetching functions
  fetchUsers,
  fetchUser,
  
  // User CRUD operations
  addUser,
  updateUser,
  deleteUser,
  
  // User permissions operations
  fetchUserPermissions,
  updateUserPermissions,
  
  // Role and permissions functions
  fetchRoles,
  fetchPermissions
};
