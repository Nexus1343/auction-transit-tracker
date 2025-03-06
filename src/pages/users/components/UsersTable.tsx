
import React from 'react';
import { User } from "../../../services/user/types";
import { formatDistanceToNow } from 'date-fns';

interface UsersTableProps {
  users: User[];
  searchTerm: string;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: number) => void;
}

const UsersTable = ({ users, searchTerm, onEditUser, onDeleteUser }: UsersTableProps) => {
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.mobile && user.mobile.toLowerCase().includes(searchLower)) ||
      (user.role?.name && user.role.name.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Mobile</th>
            <th scope="col" className="px-6 py-3">Role</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr className="bg-white border-b">
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            filteredUsers.map(user => (
              <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.name}
                </td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.mobile || '-'}</td>
                <td className="px-6 py-4">{user.role?.name || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status || 'unknown'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditUser(user)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteUser(user.id || 0)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
