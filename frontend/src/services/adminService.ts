import { ApiClient } from './api';
import { PagedResponse } from '../types/api';
import { AdminDashboardStats, AuditLog } from '../types/admin';
import { PropertyFilter, PropertySummary } from '../types/property';
import { Role, User, UserStatus } from '../types/auth';
import { PropertyReport } from '../types/inquiry';

export const adminService = {
  getStats: (): Promise<AdminDashboardStats> => {
    return ApiClient.get<AdminDashboardStats>('/admin/dashboard');
  },

  getAllProperties: (filter?: PropertyFilter): Promise<PagedResponse<PropertySummary>> => {
    return ApiClient.get<PagedResponse<PropertySummary>>('/admin/properties', filter);
  },

  approveProperty: (id: string): Promise<void> => {
    return ApiClient.post(`/admin/properties/${id}/approve`);
  },

  rejectProperty: (id: string, reason: string): Promise<void> => {
    return ApiClient.post(`/admin/properties/${id}/reject`, { reason });
  },

  suspendProperty: (id: string, reason?: string): Promise<void> => {
    return ApiClient.post(`/admin/properties/${id}/suspend`, { reason });
  },

  restoreProperty: (id: string): Promise<void> => {
    return ApiClient.post(`/admin/properties/${id}/restore`);
  },

  searchUsers: (params?: { query?: string; role?: Role; status?: UserStatus; page?: number; size?: number }): Promise<PagedResponse<User>> => {
    return ApiClient.get<PagedResponse<User>>('/admin/users', params);
  },

  updateUserStatus: (id: string, status: UserStatus): Promise<void> => {
    return ApiClient.patch(`/admin/users/${id}/status`, { status });
  },

  updateUserRole: (id: string, role: Role): Promise<void> => {
    return ApiClient.patch(`/admin/users/${id}/role`, { role });
  },

  getReports: (status?: string, page = 0, size = 15): Promise<PagedResponse<PropertyReport>> => {
    return ApiClient.get<PagedResponse<PropertyReport>>('/admin/reports', { status, page, size });
  },

  resolveReport: (id: string, status: string, adminNotes?: string): Promise<PropertyReport> => {
    return ApiClient.patch<PropertyReport>(`/admin/reports/${id}/resolve`, { status, adminNotes });
  },

  getAuditLogs: (page = 0, size = 20): Promise<PagedResponse<AuditLog>> => {
    return ApiClient.get<PagedResponse<AuditLog>>('/admin/audit-logs', { page, size });
  },
};
