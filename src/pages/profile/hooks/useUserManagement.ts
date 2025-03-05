
import { useState, useEffect } from 'react';
import { User, UserRole, UserStatus, fetchUsers, fetchRoles, addUser, updateUser, deleteUser } from '@/services/user';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role_id: 0,
    status: 'Active' as UserStatus
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = !searchTerm || 
        Object.values(user).some(value => 
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesSearch;
    });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      mobile: '',
      role_id: roles.find(r => r.name === 'Regular User')?.id || 0,
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      mobile: user.mobile || '',
      role_id: user.role_id || roles.find(r => r.name === user.role)?.id || 0,
      status: user.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'role_id' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || (!selectedUser && !formData.password)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedUser) {
        // Update existing user
        const result = await updateUser(selectedUser.id, {
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
          mobile: formData.mobile,
          role_id: formData.role_id,
          status: formData.status
        });

        if (result.success) {
          toast({
            title: 'Success',
            description: 'User updated successfully'
          });
          loadUsers();
          setIsModalOpen(false);
        } else {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive'
          });
        }
      } else {
        // Add new user
        const result = await addUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          role_id: formData.role_id
        });

        if (result.success) {
          toast({
            title: 'Success',
            description: 'User created successfully'
          });
          loadUsers();
          setIsModalOpen(false);
        } else {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive'
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const result = await deleteUser(userToDelete.id);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'User deleted successfully'
        });
        loadUsers();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive'
      });
    } finally {
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    selectedUser,
    users,
    roles,
    isLoading,
    isSubmitting,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    userToDelete,
    formData,
    currentUser,
    getFilteredUsers,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleInputChange,
    handleSubmit,
    confirmDeleteUser,
    loadUsers
  };
};
