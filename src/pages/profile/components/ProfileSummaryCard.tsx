
import React from 'react';
import { User, Camera, Key } from 'lucide-react';

interface ProfileData {
  id: number;
  name: string;
  email: string;
}

interface ProfileSummaryCardProps {
  profileData: ProfileData;
  setShowPasswordDialog: (show: boolean) => void;
}

const ProfileSummaryCard = ({ profileData, setShowPasswordDialog }: ProfileSummaryCardProps) => {
  return (
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
  );
};

export default ProfileSummaryCard;
