
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from '@/integrations/supabase/client';

export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: number;
  auth_id?: string;
  name: string;
  email: string;
  mobile?: string;
  role_id: number;
  role: string;
  status: UserStatus;
  lastLogin?: string;
}

export interface UserRole {
  id: number;
  name: string;
  permissions: Record<string, { read: boolean; write: boolean; delete?: boolean }>;
  created_at?: string;
  updated_at?: string;
}

interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data: users, error } = await supabase
      .from('user_profile')
      .select(`
        *,
        app_roles (
          id,
          name,
          permissions
        )
      `);

    if (error) throw error;

    return users.map((user: any) => ({
      id: user.id,
      auth_id: user.auth_id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      role_id: user.role_id,
      role: user.app_roles?.name || 'Regular User',
      status: (user.status || 'Active') as UserStatus,
      lastLogin: user.last_login_at || ''
    })) as User[];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const fetchRoles = async (): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('app_roles')
      .select('*');

    if (error) throw error;

    return data.map((role: any) => ({
      id: role.id,
      name: role.name,
      permissions: typeof role.permissions === 'string' 
        ? JSON.parse(role.permissions) 
        : role.permissions,
      created_at: role.created_at,
      updated_at: role.updated_at
    })) as UserRole[];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

export const addUser = async (userData: Omit<User, 'id' | 'role' | 'status'> & { password: string }): Promise<APIResponse> => {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        name: userData.name
      }
    });

    if (authError) throw authError;

    // Add role_id and other details
    const { error: profileError } = await supabase
      .from('user_profile')
      .update({ 
        role_id: userData.role_id,
        mobile: userData.mobile 
      })
      .eq('auth_id', authData.user.id);

    if (profileError) throw profileError;

    return {
      success: true,
      message: 'User created successfully'
    };
  } catch (error: any) {
    console.error('Error adding user:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while creating user'
    };
  }
};

export const updateUser = async (id: number, userData: Partial<User> & { password?: string }): Promise<APIResponse> => {
  try {
    // Get auth_id from user_profile
    const { data: userData2, error: userError } = await supabase
      .from('user_profile')
      .select('auth_id')
      .eq('id', id)
      .single();

    if (userError) throw userError;

    const updates: Record<string, any> = {};
    
    // Update auth user if email or password changed
    if (userData.email || userData.password) {
      const authUpdates: Record<string, any> = {};
      
      if (userData.email) authUpdates.email = userData.email;
      if (userData.password) authUpdates.password = userData.password;
      
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userData2.auth_id,
        authUpdates
      );

      if (authError) throw authError;
    }

    // Update user profile
    if (userData.name) updates.name = userData.name;
    if (userData.mobile !== undefined) updates.mobile = userData.mobile;
    if (userData.role_id) updates.role_id = userData.role_id;
    if (userData.status) updates.status = userData.status;

    if (Object.keys(updates).length > 0) {
      const { error: profileError } = await supabase
        .from('user_profile')
        .update(updates)
        .eq('id', id);

      if (profileError) throw profileError;
    }

    return {
      success: true,
      message: 'User updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while updating user'
    };
  }
};

export const deleteUser = async (id: number): Promise<APIResponse> => {
  try {
    // Get auth_id from user_profile
    const { data: userData, error: userError } = await supabase
      .from('user_profile')
      .select('auth_id')
      .eq('id', id)
      .single();

    if (userError) throw userError;

    // Delete auth user (this will cascade to user_profile due to RLS)
    const { error: authError } = await supabase.auth.admin.deleteUser(userData.auth_id);

    if (authError) throw authError;

    return {
      success: true,
      message: 'User deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while deleting user'
    };
  }
};
