
import { supabase } from '@/integrations/supabase/client';
import { User, APIResponse } from './types';

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
