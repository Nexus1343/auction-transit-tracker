
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
