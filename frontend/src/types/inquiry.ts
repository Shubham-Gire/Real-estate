export type InquiryStatus = 'NEW' | 'CONTACTED' | 'RESOLVED' | 'CLOSED';

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  senderId?: string;
  recipientId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: InquiryStatus;
  notes?: string;
  createdAt: string;
}

export interface InquiryCreateInput {
  propertyId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterId?: string;
  reporterEmail?: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}
