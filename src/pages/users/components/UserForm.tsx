
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus } from "lucide-react";
import { User, Role, addUser, updateUser } from "../../../services/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRoles } from "../../../services/user";
import { fetchDealers, addDealer } from "../../../services/dealer";
import { Dealer } from "../../../services/dealer/types";
import { toast } from "sonner";

interface UserFormProps {
  selectedUser: User | null;
  onSuccess: () => void;
  isLoading: boolean;
}

type DealerSelectionType = 'existing' | 'new' | 'none';

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
  const [dealerSelectionType, setDealerSelectionType] = useState<DealerSelectionType>('existing');
  const [dealerFormData, setDealerFormData] = useState<Dealer>({
    name: '',
    email: null,
    password: null,
    mobile: null,
    buyer_id: null,
    buyer_id_2: null,
    dealer_fee: 0,
    dealer_fee_2: 0,
    transport_price_id: null,
    container_price_id: null
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [createDealerProfile, setCreateDealerProfile] = useState(false);

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

      // Set dealer selection type based on existing data
      if (selectedUser.dealer_id) {
        setDealerSelectionType('existing');
      } else if (selectedUser.role?.name === 'Dealer') {
        setDealerSelectionType('none');
      }

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
    queryFn: fetchDealers
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

  // Mutation for adding dealer
  const addDealerMutation = useMutation({
    mutationFn: addDealer,
    onSuccess: (data) => {
      if (data && data.id) {
        // Update the user form with the new dealer ID
        setFormData(prev => ({ ...prev, dealer_id: data.id }));
        
        // Submit the user after the dealer is created
        if (selectedUser) {
          updateUserMutation.mutate({
            ...formData,
            dealer_id: data.id
          });
        } else {
          addUserMutation.mutate({
            ...formData,
            dealer_id: data.id
          });
        }
        
        queryClient.invalidateQueries({ queryKey: ['dealers'] });
        toast.success('Dealer profile created successfully');
      }
    },
    onError: (error) => {
      toast.error('Failed to create dealer profile');
      console.error('Error creating dealer profile:', error);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If creating a dealer profile, sync relevant fields
    if (createDealerProfile && (name === 'name' || name === 'email' || name === 'mobile')) {
      setDealerFormData(prev => ({ 
        ...prev, 
        [name]: name === 'email' || name === 'mobile' ? value || null : value 
      }));
    }
  };

  const handleDealerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDealerFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    const roleId = value === 'none' ? null : parseInt(value);
    setFormData(prev => ({ ...prev, role_id: roleId }));
    
    // Check if selected role is dealer
    const selectedRole = roles.find(role => role.id === roleId);
    const isDealer = selectedRole?.name === 'Dealer';
    setIsDealerUser(isDealer);
    
    // If not a dealer role, clear dealer association
    if (!isDealer) {
      setFormData(prev => ({ ...prev, dealer_id: null }));
      setDealerSelectionType('existing');
      setCreateDealerProfile(false);
    }
  };

  const handleDealerSelectionTypeChange = (value: string) => {
    setDealerSelectionType(value as DealerSelectionType);
    
    if (value === 'new') {
      setCreateDealerProfile(true);
      setCurrentStep(1);
      
      // Pre-populate dealer form with user data
      setDealerFormData(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email || null,
        mobile: formData.mobile || null
      }));
    } else {
      setCreateDealerProfile(false);
      
      if (value === 'none') {
        setFormData(prev => ({ ...prev, dealer_id: null }));
      }
    }
  };

  const handleDealerChange = (value: string) => {
    const dealerId = value === 'none' ? null : parseInt(value);
    setFormData(prev => ({ ...prev, dealer_id: dealerId }));
    
    // If a dealer is selected, check if there's an email to sync
    if (dealerId) {
      const selectedDealer = dealers.find(dealer => dealer.id === dealerId);
      if (selectedDealer?.email && selectedDealer.email !== formData.email) {
        if (window.confirm(`Sync email with dealer profile? (${selectedDealer.email})`)) {
          setFormData(prev => ({ ...prev, email: selectedDealer.email || '' }));
        }
      }
    }
  };

  const handleDealerPriceChange = (name: string, value: string) => {
    setDealerFormData(prev => ({ 
      ...prev, 
      [name]: value === 'none' ? null : parseInt(value) 
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleNextStep = () => {
    // Validate first step before proceeding
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.role_id) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If creating a new dealer profile
    if (isDealerUser && dealerSelectionType === 'new') {
      if (currentStep === 1) {
        handleNextStep();
        return;
      }
      
      // Validate dealer form data
      if (!dealerFormData.name) {
        toast.error('Dealer name is required');
        return;
      }
      
      // Create dealer profile first, then user will be created in the onSuccess callback
      addDealerMutation.mutate({
        ...dealerFormData,
        email: dealerFormData.email || formData.email || null,
        mobile: dealerFormData.mobile || formData.mobile || null
      });
      return;
    }
    
    // Normal user creation/update flow
    if (selectedUser) {
      updateUserMutation.mutate(formData);
    } else {
      addUserMutation.mutate(formData);
    }
  };

  const isFormLoading = isLoading || 
    addUserMutation.isPending || 
    updateUserMutation.isPending ||
    addDealerMutation.isPending;

  // Render different forms based on the current step
  const renderFormStep = () => {
    if (currentStep === 1 || !createDealerProfile) {
      // Step 1: User information
      return (
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
                <Label htmlFor="dealerSelectionType">Dealer Association</Label>
                <Select
                  value={dealerSelectionType}
                  onValueChange={handleDealerSelectionTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select association type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existing">Select Existing Dealer</SelectItem>
                    <SelectItem value="new">Create New Dealer</SelectItem>
                    <SelectItem value="none">No Association</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {isDealerUser && dealerSelectionType === 'existing' && (
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
      );
    } else {
      // Step 2: Dealer information
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="dealerName">Dealer Name</Label>
              <Input
                id="dealerName"
                name="name"
                value={dealerFormData.name}
                onChange={handleDealerInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dealerEmail">Dealer Email</Label>
              <Input
                id="dealerEmail"
                name="email"
                type="email"
                value={dealerFormData.email || ''}
                onChange={handleDealerInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="dealerMobile">Dealer Mobile</Label>
              <Input
                id="dealerMobile"
                name="mobile"
                value={dealerFormData.mobile || ''}
                onChange={handleDealerInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="buyerId">Buyer ID</Label>
              <Input
                id="buyerId"
                name="buyer_id"
                value={dealerFormData.buyer_id || ''}
                onChange={handleDealerInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="buyerId2">Buyer ID 2</Label>
              <Input
                id="buyerId2"
                name="buyer_id_2"
                value={dealerFormData.buyer_id_2 || ''}
                onChange={handleDealerInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="dealerFee">Dealer Fee</Label>
              <Input
                id="dealerFee"
                name="dealer_fee"
                type="number"
                value={dealerFormData.dealer_fee?.toString() || '0'}
                onChange={handleDealerInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="dealerFee2">Dealer Fee 2</Label>
              <Input
                id="dealerFee2"
                name="dealer_fee_2"
                type="number"
                value={dealerFormData.dealer_fee_2?.toString() || '0'}
                onChange={handleDealerInputChange}
              />
            </div>
            
            <div>
              <Label htmlFor="transportPriceId">Transport Price</Label>
              <Select
                value={dealerFormData.transport_price_id?.toString() || 'none'}
                onValueChange={(value) => handleDealerPriceChange('transport_price_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transport price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {/* Add transport prices here */}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="containerPriceId">Container Price</Label>
              <Select
                value={dealerFormData.container_price_id?.toString() || 'none'}
                onValueChange={(value) => handleDealerPriceChange('container_price_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select container price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {/* Add container prices here */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderFormStep()}

      <div className="flex justify-end space-x-2 mt-6">
        {createDealerProfile && currentStep === 2 && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePrevStep}
            disabled={isFormLoading}
          >
            Back
          </Button>
        )}
        
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
          {createDealerProfile && currentStep === 1 ? 'Next' : 
            selectedUser ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
