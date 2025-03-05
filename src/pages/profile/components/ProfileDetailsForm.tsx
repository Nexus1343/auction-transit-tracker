
import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
}

interface ProfileDetailsFormProps {
  profileData: ProfileData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
}

const ProfileDetailsForm = ({ profileData, handleChange, isEditing }: ProfileDetailsFormProps) => {
  return (
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
                disabled={true}
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
  );
};

export default ProfileDetailsForm;
