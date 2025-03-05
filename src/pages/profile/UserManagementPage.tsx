import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RotateCw,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@americars.ge',
      mobile: '+1 555-123-4567',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2025-02-28 14:30:22'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@americars.ge',
      mobile: '+1 555-987-6543',
      role: 'Regular User',
      status: 'Active',
      lastLogin: '2025-03-01 09:15:43'
    },
    {
      id: 3,
      name: 'Giga Chumburidze',
      email: 'gigachumburidze@americars.ge',
      mobile: '577038877',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2025-03-02 11:22:05'
    },
    {
      id: 4,
      name: 'Zviad Wulukidze',
      email: 'zwulukidze@americars.ge',
      mobile: '+995 599-123-456',
      role: 'Regular User',
      status: 'Inactive',
      lastLogin: '2025-02-15 08:45:19'
    },
    {
      id: 5,
      name: 'Makho Khidasheli',
      email: 'makhok@americars.ge',
      mobile: '+995 577-345-678',
      role: 'Regular User',
      status: 'Active',
      lastLogin: '2025-03-03 10:17:36'
    },
    {
      id: 6,
      name: 'Giorgi Didebashvili',
      email: 'giorgid@americars.ge',
      mobile: '+995 591-234-567',
      role: 'Regular User',
      status: 'Active',
      lastLogin: '2025-03-01 08:20:11'
    }
  ];

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        Object.values(user).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesSearch;
    });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage system users, roles, and permissions</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleAddUser}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
            <select className="border rounded-lg px-3 py-2">
              <option>20 entries</option>
              <option>50 entries</option>
              <option>100 entries</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="pl-9 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-x-auto">
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
              {getFilteredUsers().map(user => (
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
                  <td className="px-4 py-3 text-gray-600">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1 to {getFilteredUsers().length} of {getFilteredUsers().length} entries
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border rounded bg-blue-500 text-white">1</button>
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => setIsModalOpen(false)}>
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
                    className="w-full p-2 border rounded-lg"
                    defaultValue={selectedUser?.name}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-lg"
                    defaultValue={selectedUser?.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    defaultValue={selectedUser?.mobile}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select 
                    className="w-full p-2 border rounded-lg"
                    defaultValue={selectedUser?.role === 'Admin' ? 'admin' : 
                                selectedUser?.role === 'Regular User' ? 'regularUser' : ''}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="regularUser">Regular User</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full p-2 border rounded-lg pr-10"
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
                    className="w-full p-2 border rounded-lg"
                    defaultValue={selectedUser?.status || 'Active'}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                {selectedUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
