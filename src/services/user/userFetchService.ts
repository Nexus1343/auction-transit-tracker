
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Role, Permission } from "./types";

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
