import { ApiClient } from './api';
import { PagedResponse } from '../types/api';
import { Inquiry, InquiryCreateInput, InquiryStatus, PropertyReport } from '../types/inquiry';

export const inquiryService = {
  createInquiry: (data: InquiryCreateInput): Promise<Inquiry> => {
    return ApiClient.post<Inquiry>('/inquiries', data);
  },

  getSentInquiries: (page = 0, size = 15): Promise<PagedResponse<Inquiry>> => {
    return ApiClient.get<PagedResponse<Inquiry>>('/inquiries/sent', { page, size });
  },

  getReceivedInquiries: (page = 0, size = 15): Promise<PagedResponse<Inquiry>> => {
    return ApiClient.get<PagedResponse<Inquiry>>('/inquiries/received', { page, size });
  },

  updateStatus: (id: string, status: InquiryStatus, notes?: string): Promise<Inquiry> => {
    return ApiClient.patch<Inquiry>(`/inquiries/${id}/status`, { status, notes });
  },

  submitReport: (propertyId: string, reason: string, description: string): Promise<PropertyReport> => {
    return ApiClient.post<PropertyReport>('/reports', { propertyId, reason, description });
  },
};
