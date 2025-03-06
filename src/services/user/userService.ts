
import { supabase } from "@/integrations/supabase/client";
import { User, Role, Permission, UserPermission, RolePermission } from "./types";
import { toast } from "sonner";

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select(`
        *,
        role:role_id(id, name, permissions)
      `)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
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
        *,
        role:role_id(id, name, permissions)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
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
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    
    toast.success('User added successfully');
    return data;
  } catch (error: any) {
    console.error('Error adding user:', error);
    toast.error('Failed to add user');
    return null;
  }
};

export const updateUser = async (user: User): Promise<User | null> => {
  if (!user.id) {
    toast.error('User ID is required for updating');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_profile')
      .update(user)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    
    toast.success('User updated successfully');
    return data;
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
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data || [];
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
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching permissions:', error);
    toast.error('Failed to fetch permissions');
    return [];
  }
};

export const fetchUserPermissions = async (userId: number): Promise<UserPermission[]> => {
  try {
    const { data, error } = await supabase
      .from('user_permissions')
      .select(`
        *,
        permission:permission_id(*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching user permissions:', error);
    toast.error('Failed to fetch user permissions');
    return [];
  }
};

export const fetchRolePermissions = async (roleId: number): Promise<RolePermission[]> => {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select(`
        *,
        permission:permission_id(*)
      `)
      .eq('role_id', roleId);

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching role permissions:', error);
    toast.error('Failed to fetch role permissions');
    return [];
  }
};

export const updateUserPermissions = async (
  userId: number, 
  permissionIds: number[]
): Promise<boolean> => {
  try {
    // First delete all existing permissions
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
