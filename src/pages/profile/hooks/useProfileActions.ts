
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProfileData {
  id: number;
  name: string;
  mobile: string;
  user_id: number;
  buyer_id: string;
  buyer_id_2: string;
  dealer_fee: number;
  dealer_fee_2: number;
  transport_price_id: number;
  container_price_id: number;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const useProfileActions = (
  profileData: ProfileData,
  setIsEditing: (value: boolean) => void,
  passwordData: PasswordData,
  setPasswordData: (data: PasswordData) => void,
  setShowPasswordDialog: (value: boolean) => void
) => {
  const { toast } = useToast();

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update user_profile
      const { error: userProfileError } = await supabase
        .from('user_profile')
        .update({
          name: profileData.name,
          mobile: profileData.mobile
        })
        .eq('id', profileData.user_id);
        
      if (userProfileError) throw userProfileError;
      
      // Update dealer if exists
      if (profileData.id) {
        const { error: dealerError } = await supabase
          .from('dealers')
          .update({
            mobile: profileData.mobile,
            buyer_id: profileData.buyer_id,
            buyer_id_2: profileData.buyer_id_2,
            dealer_fee: profileData.dealer_fee,
            dealer_fee_2: profileData.dealer_fee_2,
            transport_price_id: profileData.transport_price_id,
            container_price_id: profileData.container_price_id
          })
          .eq('id', profileData.id);
          
        if (dealerError) throw dealerError;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile information",
        variant: "destructive"
      });
    }
  };
  
  // Handle password change
  const handlePasswordChange = async () => {
    // Validate password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setShowPasswordDialog(false);
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Password change failed",
        description: error.message || "Failed to update your password",
        variant: "destructive"
      });
    }
  };

  return {
    handleProfileUpdate,
    handlePasswordChange
  };
};
