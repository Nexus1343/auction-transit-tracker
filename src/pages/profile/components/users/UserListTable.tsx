
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { User } from '@/services/user/userService';

interface UserListTableProps {
  users: User[];
  currentUser?: { id: string } | null;
  handleEditUser: (user: User) => void;
  handleDeleteUser: (user: User) => void;
}

const UserListTable: React.FC<UserListTableProps> = ({ 
  users, 
  currentUser, 
  handleEditUser, 
  handleDeleteUser 
}) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Mobile</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Login</th>
          <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className="border-b hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-600">#{user.id}</td>
            <td className="px-4 py-3">
              <div className="font-medium">{user.name}</div>
            </td>
            <td className="px-4 py-3 text-gray-600">{user.email}</td>
            <td className="px-4 py-3 text-gray-600">{user.mobile || '-'}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 text-xs rounded-full ${
                user.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                user.role === 'Regular User' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
            </td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 text-xs rounded-full ${
                user.status === 'Active' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {user.status}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-600">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end space-x-2">
                <button 
                  onClick={() => handleEditUser(user)}
                  className="p-1 hover:bg-gray-100 rounded"
                  disabled={currentUser?.id === user.auth_id}
                >
                  <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
                <button 
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => handleDeleteUser(user)}
                  disabled={currentUser?.id === user.auth_id}
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserListTable;
