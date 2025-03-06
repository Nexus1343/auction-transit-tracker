
export interface User {
  id?: number;
  name: string;
  email: string;
  mobile?: string | null;
  role_id: number | null;
  role?: Role;
  status?: string;
  auth_id?: string | null;
  dealer_id?: number | null;
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  category: string;
  description?: string;
  created_at?: string;
}

export interface UserPermission {
  id: number;
  user_id: number;
  permission_id: number;
  permission?: Permission;
  created_at?: string;
}

export interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  permission?: Permission;
  created_at?: string;
}
