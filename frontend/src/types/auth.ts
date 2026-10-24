export type Role = 'ROLE_USER' | 'ROLE_AGENT' | 'ROLE_ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string;
  agencyName?: string;
  licenseNumber?: string;
  bio?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string;
  agencyName?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  agencyName?: string;
  licenseNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfileUpdate {
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  agencyName?: string;
  licenseNumber?: string;
  bio?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
