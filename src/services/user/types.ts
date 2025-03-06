
export interface User {
  id?: number;
  name: string;
  email: string;
  mobile: string | null;
  role_id: number | null;
  role?: Role;
  status: string;
  dealer_id?: number | null;
  auth_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: any;
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  description: string | null;
  category: string;
  created_at?: string;
  updated_at?: string;
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
