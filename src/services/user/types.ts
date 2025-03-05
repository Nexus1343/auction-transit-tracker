
import { PostgrestError } from "@supabase/supabase-js";

export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: number;
  auth_id?: string;
  name: string;
  email: string;
  mobile?: string;
  role_id: number;
  role: string;
  status: UserStatus;
  lastLogin?: string;
}

export interface UserRole {
  id: number;
  name: string;
  permissions: Record<string, { read: boolean; write: boolean; delete?: boolean }>;
  created_at?: string;
  updated_at?: string;
}

export interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
}
