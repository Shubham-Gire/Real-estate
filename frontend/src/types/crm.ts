export type LeadStage =
  | 'NEW_LEAD'
  | 'CONTACTED'
  | 'SHOWING_SCHEDULED'
  | 'OFFER_NEGOTIATION'
  | 'UNDER_CONTRACT'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export type LeadPriority = 'HOT' | 'WARM' | 'COLD';

export type LeadSource =
  | 'WEBSITE'
  | 'REFERRAL'
  | 'ZILLOW'
  | 'OPEN_HOUSE'
  | 'PHONE'
  | 'DIRECT';

export type DealStatus = 'ACTIVE' | 'WON' | 'LOST';

export type DealStage =
  | 'OFFER_SUBMITTED'
  | 'UNDER_CONTRACT'
  | 'CLOSING_INSPECTION'
  | 'SETTLEMENT'
  | 'CLOSED';

export type ContactType = 'BUYER' | 'SELLER' | 'INVESTOR' | 'TENANT';

export type ShowingStatus = 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export type ShowingType = 'IN_PERSON' | 'VIRTUAL_TOUR';

export type NoteType = 'CALL' | 'EMAIL' | 'MEETING' | 'SHOWING' | 'GENERAL';

export interface CrmLead {
  id: string;
  agentId: string;
  clientId?: string;
  propertyId?: string;
  propertyTitle?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  stage: LeadStage;
  source: LeadSource;
  budget?: number;
  priority: LeadPriority;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmLeadCreateInput {
  propertyId?: string;
  clientId?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  stage?: LeadStage;
  source?: LeadSource;
  budget?: number;
  priority?: LeadPriority;
  notes?: string;
}

export interface CrmLeadStageUpdateInput {
  stage: LeadStage;
  notes?: string;
}

export interface CrmDeal {
  id: string;
  agentId: string;
  leadId?: string;
  propertyId?: string;
  propertyTitle?: string;
  dealName: string;
  clientName: string;
  dealValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: DealStatus;
  stage: DealStage;
  expectedCloseDate?: string;
  closedAt?: string;
  createdAt: string;
}

export interface CrmDealCreateInput {
  leadId?: string;
  propertyId?: string;
  dealName: string;
  clientName: string;
  dealValue: number;
  commissionRate?: number;
  status?: DealStatus;
  stage?: DealStage;
  expectedCloseDate?: string;
}

export interface CrmContact {
  id: string;
  agentId: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  contactType: ContactType;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocations?: string;
  notes?: string;
  lastContactedAt?: string;
  createdAt: string;
}

export interface CrmContactCreateInput {
  userId?: string;
  fullName: string;
  email: string;
  phone?: string;
  contactType: ContactType;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocations?: string;
  notes?: string;
}

export interface CrmShowing {
  id: string;
  agentId: string;
  propertyId: string;
  propertyTitle: string;
  propertyCity?: string;
  propertyAddress?: string;
  propertyImageUrl?: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  showingTime: string;
  showingType: ShowingType;
  status: ShowingStatus;
  notes?: string;
  feedback?: string;
  createdAt: string;
}

export interface CrmShowingCreateInput {
  propertyId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  showingTime: string;
  showingType?: ShowingType;
  notes?: string;
}

export interface CrmShowingStatusUpdateInput {
  status: ShowingStatus;
  notes?: string;
  feedback?: string;
}

export interface CrmNote {
  id: string;
  agentId: string;
  entityType: string;
  entityId: string;
  noteType: NoteType;
  content: string;
  createdAt: string;
}

export interface CrmNoteCreateInput {
  entityType: string;
  entityId: string;
  noteType: NoteType;
  content: string;
}

export interface AgentProfile {
  id: string;
  userId: string;
  agentName: string;
  agentEmail: string;
  agentPhone?: string;
  avatarUrl?: string;
  licenseNumber?: string;
  agencyName?: string;
  specialties?: string;
  experienceYears?: number;
  commissionRate?: number;
  rating?: number;
  verified?: boolean;
  bio?: string;
  createdAt: string;
}

export interface AgentProfileUpdateInput {
  licenseNumber?: string;
  agencyName?: string;
  specialties?: string;
  experienceYears?: number;
  commissionRate?: number;
  bio?: string;
}

export interface AgentCrmStats {
  totalLeads: number;
  activePipelineBudget: number;
  activeDealsCount: number;
  activeDealsValue: number;
  closedCommissionYTD: number;
  projectedCommission: number;
  upcomingShowingsCount: number;
  totalContactsCount: number;
  leadsByStage: Record<string, number>;
  dealsByStage: Record<string, number>;
}
