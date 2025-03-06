
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Role, Permission } from "./types";

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
