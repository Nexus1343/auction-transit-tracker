
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UserRole {
  id: number;
  name: string;
  permissions: {
    [key: string]: {
      read: boolean;
      write: boolean;
      delete?: boolean;
    };
  };
}

export interface User {
  id: number;
  auth_id?: string;
  name: string;
  email: string;
  mobile?: string;
  role_id?: number;
  role?: string;
  status?: 'Active' | 'Inactive';
  lastLogin?: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data: users, error } = await supabase
      .from('user_profile')
      .select(`
        id,
        auth_id,
        name,
        email,
        mobile,
        role_id,
        app_roles(name)
      `)
      .order('name');

    if (error) throw error;

    // Fetch last sign in data from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    const transformedUsers = users.map(user => ({
      id: user.id,
      auth_id: user.auth_id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || '',
      role_id: user.role_id,
      role: user.app_roles?.name || 'Regular User',
      status: 'Active', // Default, could be fetched from auth users if needed
      lastLogin: authUsers?.users?.find(au => au.id === user.auth_id)?.last_sign_in_at || ''
    }));

    return transformedUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const fetchRoles = async (): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('app_roles')
      .select('*')
      .order('id');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};

export const addUser = async (userData: {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  role_id: number;
}): Promise<{ success: boolean; message: string; user?: User }> => {
  try {
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        name: userData.name
      }
    });

    if (authError) throw authError;

    // The user profile should be created automatically by the database trigger,
    // but we need to update it with the role_id
    const { data: profileData, error: profileError } = await supabase
      .from('user_profile')
      .update({
        name: userData.name,
        mobile: userData.mobile,
        role_id: userData.role_id
      })
      .eq('auth_id', authData.user.id)
      .select('*');

    if (profileError) throw profileError;

    const { data: roleData } = await supabase
      .from('app_roles')
      .select('name')
      .eq('id', userData.role_id)
      .single();

    return {
      success: true,
      message: 'User created successfully',
      user: {
        id: profileData[0].id,
        auth_id: authData.user.id,
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        role_id: userData.role_id,
        role: roleData?.name || 'Regular User',
        status: 'Active'
      }
    };
  } catch (error: any) {
    console.error('Error adding user:', error);
    return { success: false, message: error.message || 'Failed to create user' };
  }
};

export const updateUser = async (
  userId: number,
  userData: Partial<{
    name: string;
    email: string;
    password: string;
    mobile: string;
    role_id: number;
    status: 'Active' | 'Inactive';
  }>
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the auth_id from user_profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profile')
      .select('auth_id')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Update auth user if needed
    if (userData.email || userData.password) {
      const authUpdates: any = {};
      if (userData.email) authUpdates.email = userData.email;
      if (userData.password) authUpdates.password = userData.password;

      const { error: authError } = await supabase.auth.admin.updateUserById(
        profileData.auth_id,
        authUpdates
      );

      if (authError) throw authError;
    }

    // Update profile data
    const profileUpdates: any = {};
    if (userData.name) profileUpdates.name = userData.name;
    if (userData.mobile) profileUpdates.mobile = userData.mobile;
    if (userData.role_id) profileUpdates.role_id = userData.role_id;

    if (Object.keys(profileUpdates).length > 0) {
      const { error: updateError } = await supabase
        .from('user_profile')
        .update(profileUpdates)
        .eq('id', userId);

      if (updateError) throw updateError;
    }

    return { success: true, message: 'User updated successfully' };
  } catch (error: any) {
    console.error('Error updating user:', error);
    return { success: false, message: error.message || 'Failed to update user' };
  }
};

export const deleteUser = async (userId: number): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the auth_id from user_profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profile')
      .select('auth_id')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(
      profileData.auth_id
    );

    if (authError) throw authError;

    // The profile should be deleted automatically by the cascade delete

    return { success: true, message: 'User deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return { success: false, message: error.message || 'Failed to delete user' };
  }
};
