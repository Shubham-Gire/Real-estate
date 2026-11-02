import { ApiClient } from './api';
import {
  AgentCrmStats,
  AgentProfile,
  AgentProfileUpdateInput,
  CrmContact,
  CrmContactCreateInput,
  CrmDeal,
  CrmDealCreateInput,
  CrmLead,
  CrmLeadCreateInput,
  CrmNote,
  CrmNoteCreateInput,
  CrmShowing,
  CrmShowingCreateInput,
  CrmShowingStatusUpdateInput,
  DealStatus,
  LeadStage,
  ShowingStatus,
} from '../types/crm';

export const crmService = {
  // Stats
  getCrmStats: (): Promise<AgentCrmStats> => {
    return ApiClient.get<AgentCrmStats>('/crm/stats');
  },

  // Leads
  getLeads: (stage?: LeadStage): Promise<CrmLead[]> => {
    return ApiClient.get<CrmLead[]>('/crm/leads', { stage });
  },

  createLead: (data: CrmLeadCreateInput): Promise<CrmLead> => {
    return ApiClient.post<CrmLead>('/crm/leads', data);
  },

  updateLeadStage: (id: string, stage: LeadStage, notes?: string): Promise<CrmLead> => {
    return ApiClient.patch<CrmLead>(`/crm/leads/${id}/stage`, { stage, notes });
  },

  // Deals
  getDeals: (status?: DealStatus): Promise<CrmDeal[]> => {
    return ApiClient.get<CrmDeal[]>('/crm/deals', { status });
  },

  createDeal: (data: CrmDealCreateInput): Promise<CrmDeal> => {
    return ApiClient.post<CrmDeal>('/crm/deals', data);
  },

  updateDealStatus: (id: string, status: DealStatus): Promise<CrmDeal> => {
    return ApiClient.patch<CrmDeal>(`/crm/deals/${id}/status?status=${status}`);
  },

  // Contacts
  getContacts: (): Promise<CrmContact[]> => {
    return ApiClient.get<CrmContact[]>('/crm/contacts');
  },

  createContact: (data: CrmContactCreateInput): Promise<CrmContact> => {
    return ApiClient.post<CrmContact>('/crm/contacts', data);
  },

  // Showings & Tours (Agent)
  getShowings: (status?: ShowingStatus): Promise<CrmShowing[]> => {
    return ApiClient.get<CrmShowing[]>('/crm/showings', { status });
  },

  updateShowingStatus: (id: string, data: CrmShowingStatusUpdateInput): Promise<CrmShowing> => {
    return ApiClient.patch<CrmShowing>(`/crm/showings/${id}/status`, data);
  },

  // Showings & Tours (Public & Client)
  requestShowing: (data: CrmShowingCreateInput): Promise<CrmShowing> => {
    return ApiClient.post<CrmShowing>('/showings', data);
  },

  getMyShowings: (): Promise<CrmShowing[]> => {
    return ApiClient.get<CrmShowing[]>('/showings/my');
  },

  // Notes
  getNotes: (entityType: string, entityId: string): Promise<CrmNote[]> => {
    return ApiClient.get<CrmNote[]>('/crm/notes', { entityType, entityId });
  },

  createNote: (data: CrmNoteCreateInput): Promise<CrmNote> => {
    return ApiClient.post<CrmNote>('/crm/notes', data);
  },

  // Profile
  getAgentProfile: (): Promise<AgentProfile> => {
    return ApiClient.get<AgentProfile>('/crm/profile');
  },

  updateAgentProfile: (data: AgentProfileUpdateInput): Promise<AgentProfile> => {
    return ApiClient.put<AgentProfile>('/crm/profile', data);
  },
};
