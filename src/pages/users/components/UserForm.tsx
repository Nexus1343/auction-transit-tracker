
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { User, Role, addUser, updateUser } from "../../../services/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRoles } from "../../../services/user";
import { fetchDealers } from "../../../services/dealer";

interface UserFormProps {
  selectedUser: User | null;
  onSuccess: () => void;
  isLoading: boolean;
}

const UserForm = ({ selectedUser, onSuccess, isLoading }: UserFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    mobile: '',
    role_id: null,
    status: 'active',
    dealer_id: null
  });
  const [isDealerUser, setIsDealerUser] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        mobile: selectedUser.mobile,
        role_id: selectedUser.role_id,
        status: selectedUser.status || 'active',
        dealer_id: selectedUser.dealer_id,
        auth_id: selectedUser.auth_id
      });

      // Check if user has Dealer role
      if (selectedUser.role?.name === 'Dealer') {
        setIsDealerUser(true);
      }
    }
  }, [selectedUser]);

  // Fetch roles
  const { data: roles = [] } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles
  });

  // Fetch dealers for association
  const { data: dealers = [] } = useQuery({
    queryKey: ['dealers'],
    queryFn: fetchDealers,
    enabled: isDealerUser
  });

  // Mutations for adding/updating user
  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onSuccess();
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', selectedUser?.id] });
      onSuccess();
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    const roleId = value === 'none' ? null : parseInt(value);
    setFormData(prev => ({ ...prev, role_id: roleId }));
    
    // Check if selected role is dealer
    const selectedRole = roles.find(role => role.id === roleId);
    setIsDealerUser(selectedRole?.name === 'Dealer');
    
    // If switching away from dealer role, clear dealer_id
    if (selectedRole?.name !== 'Dealer') {
      setFormData(prev => ({ ...prev, dealer_id: null }));
    }
  };

  const handleDealerChange = (value: string) => {
    const dealerId = value === 'none' ? null : parseInt(value);
    setFormData(prev => ({ ...prev, dealer_id: dealerId }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedUser) {
      updateUserMutation.mutate(formData);
    } else {
      addUserMutation.mutate(formData);
    }
  };

  const isFormLoading = isLoading || 
    addUserMutation.isPending || 
    updateUserMutation.isPending;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              name="mobile"
              value={formData.mobile || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role_id?.toString() || 'none'}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Role</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isDealerUser && (
            <div>
              <Label htmlFor="dealer">Associated Dealer</Label>
              <Select
                value={formData.dealer_id?.toString() || 'none'}
                onValueChange={handleDealerChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a dealer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Dealer</SelectItem>
                  {dealers.map(dealer => (
                    <SelectItem key={dealer.id} value={dealer.id?.toString() || ""}>
                      {dealer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSuccess}
          disabled={isFormLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isFormLoading}
        >
          {isFormLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {selectedUser ? 'Update User' : 'Add User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
