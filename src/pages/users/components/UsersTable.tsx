
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ShieldCheck, ShieldX, Store } from "lucide-react";
import { User } from "../../../services/user";
import { Badge } from "@/components/ui/badge";

interface UsersTableProps {
  users: User[];
  searchTerm: string;
  onEditUser: (user: User) => void;
  onDeleteUser: (id: number) => void;
}

const UsersTable = ({ users, searchTerm, onEditUser, onDeleteUser }: UsersTableProps) => {
  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      (user.mobile && user.mobile.toLowerCase().includes(searchTermLower)) ||
      (user.role?.name && user.role.name.toLowerCase().includes(searchTermLower))
    );
  });
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">Suspended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Association</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile || '-'}</TableCell>
                <TableCell>
                  {user.role?.name || '-'}
                </TableCell>
                <TableCell>
                  {user.status ? getStatusBadge(user.status) : '-'}
                </TableCell>
                <TableCell>
                  {user.dealer_id ? (
                    <div className="flex items-center">
                      <Store className="h-4 w-4 mr-1 text-blue-500" />
                      <span>Dealer #{user.dealer_id}</span>
                    </div>
                  ) : user.role?.name === 'Dealer' ? (
                    <Badge variant="outline">No Association</Badge>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteUser(user.id as number)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
