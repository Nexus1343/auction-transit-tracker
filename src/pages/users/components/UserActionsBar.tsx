
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, RefreshCw } from "lucide-react";

interface UserActionsBarProps {
  onAddUser: () => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const UserActionsBar = ({
  onAddUser,
  searchTerm,
  onSearchChange,
  onRefresh,
  isLoading
}: UserActionsBarProps) => {
  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 border-b">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8 w-full"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        <Button onClick={onAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
    </div>
  );
};

export default UserActionsBar;
