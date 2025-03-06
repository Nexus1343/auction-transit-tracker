
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Role, Permission, UserPermission } from "./types";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select(`
        id,
        name,
        email,
        mobile,
        role_id,
        status,
        auth_id,
        dealer_id,
        role:roles(
          id,
          name,
          permissions
        )
      `);
    
    if (error) throw error;
    
    // Transform the data to match the User type
    const users: User[] = data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role_id: user.role_id,
      status: user.status,
      auth_id: user.auth_id,
      dealer_id: user.dealer_id,
      role: user.role ? {
        id: user.role.id,
        name: user.role.name,
        permissions: Array.isArray(user.role.permissions) 
          ? user.role.permissions 
          : typeof user.role.permissions === 'string'
            ? JSON.parse(user.role.permissions)
            : []
      } : undefined
    }));
    
    return users;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    toast.error('Failed to fetch users');
    return [];
  }
};

export const fetchUser = async (id: number): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select(`
        id,
        name,
        email,
        mobile,
        role_id,
        status,
        auth_id,
        dealer_id,
        role:roles(
          id,
          name,
          permissions
        ),
        user_permissions:user_permissions(
          permission_id
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Transform the data to match the User type
    const user: User = {
      id: data.id,
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      role_id: data.role_id,
      status: data.status,
      auth_id: data.auth_id,
      dealer_id: data.dealer_id,
      role: data.role ? {
        id: data.role.id,
        name: data.role.name,
        permissions: Array.isArray(data.role.permissions) 
          ? data.role.permissions 
          : typeof data.role.permissions === 'string'
            ? JSON.parse(data.role.permissions)
            : []
      } : undefined
    };
    
    return user;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    toast.error('Failed to fetch user');
    return null;
  }
};

export const addUser = async (user: User): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .insert([
        {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role_id: user.role_id,
          status: user.status || 'active',
          dealer_id: user.dealer_id
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('User added successfully');
    return data as unknown as User;
  } catch (error: any) {
    console.error('Error adding user:', error);
    toast.error('Failed to add user');
    return null;
  }
};

export const updateUser = async (user: User): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .update({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role_id: user.role_id,
        status: user.status,
        dealer_id: user.dealer_id
      })
      .eq('id', user.id || 0)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('User updated successfully');
    return data as unknown as User;
  } catch (error: any) {
    console.error('Error updating user:', error);
    toast.error('Failed to update user');
    return null;
  }
};

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_profile')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('User deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting user:', error);
    toast.error('Failed to delete user');
    return false;
  }
};

export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*');
    
    if (error) throw error;
    
    // Transform the data to match the Role type
    const roles: Role[] = data.map(role => ({
      id: role.id,
      name: role.name,
      permissions: Array.isArray(role.permissions) 
        ? role.permissions 
        : typeof role.permissions === 'string'
          ? JSON.parse(role.permissions)
          : [],
      created_at: role.created_at,
      updated_at: role.updated_at
    }));
    
    return roles;
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    toast.error('Failed to fetch roles');
    return [];
  }
};

export const fetchPermissions = async (): Promise<Permission[]> => {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*');
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching permissions:', error);
    toast.error('Failed to fetch permissions');
    return [];
  }
};

export const fetchUserPermissions = async (userId: number): Promise<number[]> => {
  try {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('permission_id')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return data.map(item => item.permission_id);
  } catch (error: any) {
    console.error('Error fetching user permissions:', error);
    toast.error('Failed to fetch user permissions');
    return [];
  }
};

export const updateUserPermissions = async (userId: number, permissionIds: number[]): Promise<boolean> => {
  try {
    // First delete all existing user permissions
    const { error: deleteError } = await supabase
      .from('user_permissions')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) throw deleteError;
    
    // Then insert the new permissions
    if (permissionIds.length > 0) {
      const permissionsToInsert = permissionIds.map(permissionId => ({
        user_id: userId,
        permission_id: permissionId
      }));
      
      const { error: insertError } = await supabase
        .from('user_permissions')
        .insert(permissionsToInsert);
      
      if (insertError) throw insertError;
    }
    
    toast.success('User permissions updated successfully');
    return true;
  } catch (error: any) {
    console.error('Error updating user permissions:', error);
    toast.error('Failed to update user permissions');
    return false;
  }
};
