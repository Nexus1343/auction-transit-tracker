
import React from 'react';
import { Plus, Search, Filter, Download, RotateCw } from 'lucide-react';

interface UserListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleAddUser: () => void;
  loadUsers: () => void;
  isLoading: boolean;
}

const UserListHeader: React.FC<UserListHeaderProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  handleAddUser, 
  loadUsers, 
  isLoading 
}) => {
  return (
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
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg" 
          onClick={loadUsers}
          disabled={isLoading}
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default UserListHeader;
