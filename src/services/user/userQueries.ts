
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, UserStatus } from './types';

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data: users, error } = await supabase
      .from('user_profile')
      .select(`
        *,
        roles (
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
      role: user.roles?.name || 'Regular User',
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
      .from('roles')
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
