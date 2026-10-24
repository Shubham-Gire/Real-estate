import { ApiClient } from './api';
import { AuthResponse, ChangePasswordRequest, LoginRequest, RegisterRequest, User, UserProfileUpdate } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const res = await ApiClient.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('estatehub_token', res.token);
    localStorage.setItem('estatehub_user', JSON.stringify(res));
    return res;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await ApiClient.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('estatehub_token', res.token);
    localStorage.setItem('estatehub_user', JSON.stringify(res));
    return res;
  },

  getMe: async (): Promise<User> => {
    return ApiClient.get<User>('/auth/me');
  },

  updateProfile: async (data: UserProfileUpdate): Promise<User> => {
    const updated = await ApiClient.put<User>('/auth/profile', data);
    const existing = localStorage.getItem('estatehub_user');
    if (existing) {
      const parsed = JSON.parse(existing);
      localStorage.setItem('estatehub_user', JSON.stringify({ ...parsed, ...updated }));
    }
    return updated;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await ApiClient.post('/auth/change-password', data);
  },

  logout: () => {
    localStorage.removeItem('estatehub_token');
    localStorage.removeItem('estatehub_user');
  },

  getCurrentUserFromStorage: (): AuthResponse | null => {
    const userJson = localStorage.getItem('estatehub_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },
};
