
import React, { useState } from 'react';
import { Eye, EyeOff, X, RotateCw } from 'lucide-react';
import { User, UserRole, UserStatus } from '@/services/user/userService';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    name: string;
    email: string;
    password: string;
    mobile: string;
    role_id: number;
    status: UserStatus;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  selectedUser: User | null;
  roles: UserRole[];
}

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  isSubmitting,
  selectedUser,
  roles
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{selectedUser ? 'Edit User' : 'Add New User'}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border rounded-lg"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border rounded-lg"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                className="w-full p-2 border rounded-lg"
                value={formData.mobile}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select 
                name="role_id"
                className="w-full p-2 border rounded-lg"
                value={formData.role_id}
                onChange={handleInputChange}
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-2 border rounded-lg pr-10"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={selectedUser ? "Leave blank to keep current" : ""}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select 
                name="status"
                className="w-full p-2 border rounded-lg"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <RotateCw className="w-4 h-4 mr-2 animate-spin" />
                {selectedUser ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              selectedUser ? 'Update User' : 'Create User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
