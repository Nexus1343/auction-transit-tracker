
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import UserForm from './UserForm';
import PermissionsForm from './PermissionsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "../../../services/user";
import { fetchUser } from "../../../services/user";
import { useQuery } from "@tanstack/react-query";

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
}

const UserDialog = ({
  isOpen,
  onOpenChange,
  selectedUser
}: UserDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");

  // Reset active tab when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("details");
    }
  }, [isOpen]);

  // If we have a selected user, fetch the complete user data with permissions
  const { 
    data: userData,
    isLoading: isUserLoading
  } = useQuery({
    queryKey: ['user', selectedUser?.id],
    queryFn: () => selectedUser?.id ? fetchUser(selectedUser.id) : null,
    enabled: !!selectedUser?.id && isOpen
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {selectedUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogDescription>
            {selectedUser ? 'Update user details and permissions' : 'Create a new user account'}
          </DialogDescription>
        </DialogHeader>
        
        {selectedUser && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">User Details</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <UserForm 
                selectedUser={userData || selectedUser} 
                onSuccess={() => onOpenChange(false)}
                isLoading={isUserLoading}
              />
            </TabsContent>
            <TabsContent value="permissions">
              {selectedUser?.id && (
                <PermissionsForm 
                  userId={selectedUser.id} 
                  roleId={userData?.role_id || selectedUser.role_id}
                  onSuccess={() => onOpenChange(false)}
                />
              )}
            </TabsContent>
          </Tabs>
        )}

        {!selectedUser && (
          <UserForm 
            selectedUser={null} 
            onSuccess={() => onOpenChange(false)}
            isLoading={false}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
