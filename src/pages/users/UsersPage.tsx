
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, fetchUsers, deleteUser } from "../../services/user";
import UserActionsBar from './components/UserActionsBar';
import UsersTable from './components/UsersTable';
import UserDialog from './components/UserDialog';

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch users using React Query
  const { 
    data: users = [], 
    isLoading: isUsersLoading,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  // Mutation for deleting a user
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(id);
    }
  };

  const isLoading = isUsersLoading || deleteUserMutation.isPending;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage your system users</p>
        </div>
      </div>

      <Card>
        <UserActionsBar
          onAddUser={handleAddUser}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onRefresh={() => refetchUsers()}
          isLoading={isLoading}
        />

        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <UsersTable 
              users={users}
              searchTerm={searchTerm}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </div>
      </Card>

      <UserDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default UsersPage;
