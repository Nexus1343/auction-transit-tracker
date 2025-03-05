
import React, { useState } from 'react';
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

const ProfilePage = () => {
  const { user } = useAuth();
  
  // State for profile data
  const [profileData, setProfileData] = useState({
    id: 133,
    name: 'Mirian Kazaishvili',
    email: user?.email || 'mkazaishvili@americars.ge',
    username: 'mkazaishvili',
    password: '********',
    mobile: '+995 577 123 456',
    buyer_id: 'Atlantic',
    buyer_id_2: 'Atlantic',
    dealer_fee: 290.00,
    dealer_fee_2: 270.00,
    transport_price_id: 1,
    container_price_id: 1,
    user_id: 5,
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
  const transportPricePlans = [
    { id: 1, name: 'Standard Transportation Pricing' },
    { id: 2, name: 'Premium Transportation Pricing' },
    { id: 3, name: 'Economy Transportation Pricing' }
  ];
  
  const containerPricePlans = [
    { id: 1, name: 'Standard Container Pricing' },
    { id: 2, name: 'Premium Container Pricing' },
    { id: 3, name: 'Economy Container Pricing' }
  ];
  
  // Sample activity history
  const activityHistory = [
    { date: '2025-03-04 14:30', action: 'Updated dealer fee' },
    { date: '2025-03-01 10:15', action: 'Changed transport pricing plan' },
    { date: '2025-02-28 09:45', action: 'Updated contact information' }
  ];

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would implement the actual update logic
  };

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
                Super Dealer
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
                    className="pl-10 w-full p-2 border rounded-lg"
                    defaultValue={profileData.name}
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
                    defaultValue={profileData.email}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  defaultValue={profileData.username}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="pl-10 w-full p-2 border rounded-lg"
                    defaultValue={profileData.mobile}
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
                    onClick={() => setShowPasswordDialog(false)}
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
