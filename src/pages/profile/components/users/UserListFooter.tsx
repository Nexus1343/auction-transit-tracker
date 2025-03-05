
import React from 'react';

interface UserListFooterProps {
  filteredUserCount: number;
  totalUserCount: number;
}

const UserListFooter: React.FC<UserListFooterProps> = ({ 
  filteredUserCount, 
  totalUserCount 
}) => {
  return (
    <div className="p-4 border-t flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing 1 to {filteredUserCount} of {totalUserCount} entries
      </div>
      <div className="flex space-x-1">
        <button className="px-3 py-1 border rounded bg-blue-500 text-white">1</button>
        <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">2</button>
        <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">Next</button>
      </div>
    </div>
  );
};

export default UserListFooter;
