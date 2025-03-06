
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserPermissions } from "../../../services/user";

interface PermissionsFormProps {
  userId: number;
  roleId: number | null;
  onSuccess: () => void;
}

const PermissionsForm = ({ userId, roleId, onSuccess }: PermissionsFormProps) => {
  const queryClient = useQueryClient();
  const { 
    permissionsByCategory, 
    userPermissionIds, 
    rolePermissionIds,
    isLoading 
  } = usePermissions(userId, roleId || undefined);

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(userPermissionIds);

  // Mutation for updating permissions
  const updatePermissionsMutation = useMutation({
    mutationFn: (permissionIds: number[]) => updateUserPermissions(userId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      onSuccess();
    }
  });

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePermissionsMutation.mutate(selectedPermissions);
  };

  const isFormLoading = isLoading || updatePermissionsMutation.isPending;

  return (
    <form onSubmit={handleSubmit}>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-4">
            <p>
              The user will inherit all permissions from their assigned role. Custom permissions below will override role-based permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {Object.entries(permissionsByCategory).map(([category, permissions]) => (
              <Card key={category}>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">{category}</CardTitle>
                  <CardDescription>Manage {category.toLowerCase()} permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {permissions.map(permission => {
                      const isInRole = rolePermissionIds.includes(permission.id);
                      
                      return (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox 
                            id={`permission-${permission.id}`}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`permission-${permission.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                              {isInRole && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                  From Role
                                </span>
                              )}
                            </label>
                            {permission.description && (
                              <p className="text-sm text-gray-500">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

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
          Save Permissions
        </Button>
      </div>
    </form>
  );
};

export default PermissionsForm;
