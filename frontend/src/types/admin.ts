export interface AdminDashboardStats {
  totalUsers: number;
  totalAgents: number;
  totalProperties: number;
  publishedProperties: number;
  pendingProperties: number;
  rejectedProperties: number;
  suspendedProperties: number;
  totalInquiries: number;
  pendingReports: number;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}
