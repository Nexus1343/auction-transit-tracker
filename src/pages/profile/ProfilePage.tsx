
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Key, 
  Save, 
  Camera,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for profile data
  const [profileData, setProfileData] = useState({
    id: 0,
    name: '',
    email: '',
    password: '********',
    mobile: '',
    buyer_id: '',
    buyer_id_2: '',
    dealer_fee: 0,
    dealer_fee_2: 0,
    transport_price_id: 0,
    container_price_id: 0,
    user_id: 0,
    profile_image: null
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for password change
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for pricing plans (from the pricing tables)
  const [transportPricePlans, setTransportPricePlans] = useState([]);
  const [containerPricePlans, setContainerPricePlans] = useState([]);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        // Fetch user profile from user_profile table
        const { data: userProfile, error: userProfileError } = await supabase
          .from('user_profile')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
          
        if (userProfileError) throw userProfileError;
        
        if (userProfile) {
          // Fetch dealer info if exists
          const { data: dealerData, error: dealerError } = await supabase
            .from('dealers')
            .select('*')
            .eq('user_id', userProfile.id)
            .maybeSingle();
            
          if (dealerError) throw dealerError;
          
          setProfileData({
            id: dealerData?.id || 0,
            name: userProfile.name || '',
            email: userProfile.email || '',
            password: '********',
            mobile: userProfile.mobile || dealerData?.mobile || '',
            buyer_id: dealerData?.buyer_id || '',
            buyer_id_2: dealerData?.buyer_id_2 || '',
            dealer_fee: dealerData?.dealer_fee || 0,
            dealer_fee_2: dealerData?.dealer_fee_2 || 0,
            transport_price_id: dealerData?.transport_price_id || 0,
            container_price_id: dealerData?.container_price_id || 0,
            user_id: userProfile.id || 0,
            profile_image: null
          });
        }
        
        // Fetch transport price plans
        const { data: transportPrices, error: transportError } = await supabase
          .from('transport_prices')
          .select('id, city, state');
          
        if (transportError) throw transportError;
        
        setTransportPricePlans(transportPrices?.map(tp => ({
          id: tp.id,
          name: `${tp.city || ''}, ${tp.state || ''} Transportation`
        })) || []);
        
        // Fetch container price plans
        const { data: containerPrices, error: containerError } = await supabase
          .from('container_prices')
          .select('id, port, vehicle_type');
          
        if (containerError) throw containerError;
        
        setContainerPricePlans(containerPrices?.map(cp => ({
          id: cp.id,
          name: `${cp.port || ''} - ${cp.vehicle_type || ''} Container`
        })) || []);
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: "Error loading profile",
          description: "Failed to load your profile information",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, toast]);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
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
    } catch (error) {
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
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Password change failed",
        description: error.message || "Failed to update your password",
        variant: "destructive"
      });
    }
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto bg-gray-50 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">View and manage your profile information</p>
        </div>
        <div>
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4 relative">
              <User className="w-16 h-16 text-blue-500" />
              <div className="absolute bottom-0 right-0">
                <button className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h2 className="text-xl font-bold">{profileData.name}</h2>
            <p className="text-gray-500">{profileData.email}</p>
            <div className="mt-4 flex flex-col items-center space-y-2 w-full">
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Admin
              </div>
              <div className="text-sm text-gray-500">
                ID: {profileData.id}
              </div>
              <button 
                onClick={() => setShowPasswordDialog(true)}
                className="mt-4 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <Key className="w-4 h-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Main Profile Form */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    className="pl-10 w-full p-2 border rounded-lg"
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="pl-10 w-full p-2 border rounded-lg"
                    value={profileData.email}
                    disabled={true} // Email should not be editable as it's tied to auth
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="mobile"
                    className="pl-10 w-full p-2 border rounded-lg"
                    value={profileData.mobile}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Dialog */}
      {showPasswordDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowPasswordDialog(false)}></div>
          <div className="bg-white rounded-lg shadow-lg z-10 max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button 
                onClick={() => setShowPasswordDialog(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <form className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
