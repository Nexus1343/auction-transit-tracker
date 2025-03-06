
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "./types";

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

export const updateUser = async (user: User, syncDealerEmail: boolean = false): Promise<User | null> => {
  try {
    // First, check if the email is being updated and if there's a dealer association
    if (syncDealerEmail && user.dealer_id && user.email) {
      // Get the current user to check for email changes
      const { data: currentUser, error: getUserError } = await supabase
        .from('user_profile')
        .select('email')
        .eq('id', user.id || 0)
        .single();
      
      if (!getUserError && currentUser && currentUser.email !== user.email) {
        // Update the associated dealer's email
        const { error: dealerUpdateError } = await supabase
          .from('dealers')
          .update({ email: user.email })
          .eq('id', user.dealer_id);
        
        if (dealerUpdateError) {
          console.error('Error updating dealer email:', dealerUpdateError);
          toast.error('Failed to sync dealer email');
        } else {
          toast.success('Dealer email synchronized successfully');
        }
      }
    }
    
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
