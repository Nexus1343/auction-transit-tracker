
import React from 'react';
import { Users, RotateCw } from 'lucide-react';
import { useUserManagement } from './hooks/useUserManagement';
import UserListHeader from './components/users/UserListHeader';
import UserListTable from './components/users/UserListTable';
import UserListFooter from './components/users/UserListFooter';
import UserForm from './components/users/UserForm';
import DeleteConfirmationDialog from './components/users/DeleteConfirmationDialog';

const UserManagementPage = () => {
  const {
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    selectedUser,
    isLoading,
    isSubmitting,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    userToDelete,
    formData,
    currentUser,
    roles,
    getFilteredUsers,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleInputChange,
    handleSubmit,
    confirmDeleteUser,
    loadUsers
  } = useUserManagement();

  const filteredUsers = getFilteredUsers();

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage system users, roles, and permissions</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <UserListHeader 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          handleAddUser={handleAddUser}
          loadUsers={loadUsers}
          isLoading={isLoading}
        />

        <div className="p-4 overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RotateCw className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <UserListTable 
              users={filteredUsers} 
              currentUser={currentUser}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
            />
          )}
          {!isLoading && filteredUsers.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No users found matching your search criteria
            </div>
          )}
        </div>

        <UserListFooter 
          filteredUserCount={filteredUsers.length} 
          totalUserCount={filteredUsers.length} 
        />
      </div>

      <UserForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        selectedUser={selectedUser}
        roles={roles}
      />

      <DeleteConfirmationDialog 
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteUser}
        user={userToDelete}
      />
    </div>
  );
};

export default UserManagementPage;
