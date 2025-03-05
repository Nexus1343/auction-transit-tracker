
import React from 'react';
import { useProfileData } from './hooks/useProfileData';
import { useProfileActions } from './hooks/useProfileActions';
import ProfileHeader from './components/ProfileHeader';
import ProfileSummaryCard from './components/ProfileSummaryCard';
import ProfileDetailsForm from './components/ProfileDetailsForm';
import PasswordChangeDialog from './components/PasswordChangeDialog';
import LoadingState from './components/LoadingState';

const ProfilePage = () => {
  const {
    profileData,
    isEditing,
    setIsEditing,
    showPasswordDialog,
    setShowPasswordDialog,
    passwordData,
    setPasswordData,
    isLoading,
    handleChange
  } = useProfileData();

  const { handleProfileUpdate, handlePasswordChange } = useProfileActions(
    profileData,
    setIsEditing,
    passwordData,
    setPasswordData,
    setShowPasswordDialog
  );

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50">
      {/* Header */}
      <ProfileHeader 
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleProfileUpdate={handleProfileUpdate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <ProfileSummaryCard 
          profileData={profileData}
          setShowPasswordDialog={setShowPasswordDialog}
        />

        {/* Main Profile Form */}
        <ProfileDetailsForm 
          profileData={profileData}
          handleChange={handleChange}
          isEditing={isEditing}
        />
      </div>

      {/* Password Change Dialog */}
      <PasswordChangeDialog 
        showPasswordDialog={showPasswordDialog}
        setShowPasswordDialog={setShowPasswordDialog}
        handlePasswordChange={handlePasswordChange}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
      />
    </div>
  );
};

export default ProfilePage;
