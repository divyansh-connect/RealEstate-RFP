export type UserRole = 'ADMIN' | 'MANAGER' | 'AGENT' | 'READ_ONLY';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  status: 'Active' | 'Deactivated';
}

export type ContactStatus = 'New' | 'Enrolled' | 'Engaged' | 'Opted Out' | 'DNC' | 'Converted' | 'Archived';
export type Grade = 'A' | 'B' | 'C' | 'D';

export interface RealtorContact {
  id: string;
  name: string;
  licenseNumber: string;
  brokerage: string;
  email: string;
  phone: string;
  market: string;
  status: ContactStatus;
  ownerId: string;
  ownerName: string;
  tags: string[];
  lastContacted: string;
  lastResponse: string;
  grade: Grade;
  score: number;
  notes: string[];
  isArchived?: boolean;
}

export interface ActivityEvent {
  id: string;
  contactId: string;
  type: 'email_sent' | 'sms_sent' | 'email_reply' | 'sms_reply' | 'ai_response' | 'human_response' | 'call' | 'note' | 'status_change' | 'assignment_change';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export type AIStatus = 'Active' | 'Human Takeover' | 'AI Off';
export type ClassificationType = 'Interested' | 'Not Interested' | 'Has Property' | 'Question' | 'Wants Call' | 'Unclear' | 'Opt-out';

export interface Message {
  id: string;
  sender: 'realtor' | 'ai' | 'human';
  text: string;
  timestamp: string;
  channel: 'sms' | 'email';
}

export interface Conversation {
  id: string;
  contactId: string;
  realtorName: string;
  realtorPhone: string;
  realtorEmail: string;
  brokerage: string;
  latestMessage: string;
  timestamp: string;
  grade: Grade;
  score: number;
  gradeReason: string;
  status: 'Needs Human' | 'Leads With Address' | 'Interested' | 'Not Interested' | 'Questions' | 'Wants Call' | 'Unclear' | 'Opt-out';
  aiStatus: AIStatus;
  unread: boolean;
  classification: ClassificationType;
  messages: Message[];
  propertyCaptured?: {
    address: string;
    city: string;
    state: string;
    zip: string;
    askingPrice: number;
    beds: number;
    baths: number;
    sqft: number;
    condition: string;
    timeline: string;
    intent: string;
  };
}

export type DealStage = 'New Property' | 'Qualifying' | 'Offer Made' | 'Offer Accepted' | 'Offer Rejected' | 'Trash' | 'Duplicate Lead' | 'Need Help';

export interface PropertyDeal {
  id: string;
  conversationId?: string;
  contactId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  askingPrice: number;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  propertyType: string;
  stage: DealStage;
  isAiInbound: boolean;
  ownerId: string;
  ownerName: string;
  grade: Grade;
  score: number;
  realtorName: string;
  realtorBrokerage: string;
  realtorPhone: string;
  realtorEmail: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  isArchived?: boolean;
  offerDetails?: {
    purchasePrice: number;
    earnestMoney: number;
    optionFee: number;
    optionPeriodDays: number;
    closingDate: string;
    buyerEntity: string;
    sellerName: string;
    titleCompany: string;
    financingType: string;
    inspectionPeriodDays: number;
    specialProvisions: string;
  };
  generatedContracts?: Array<{
    id: string;
    templateName: string;
    fileName: string;
    fileType: 'pdf' | 'docx';
    generatedAt: string;
    generatedBy: string;
    version: number;
  }>;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'lead_assigned' | 'conversation_escalated' | 'address_captured' | 'integration_alert' | 'system';
  timestamp: string;
  read: boolean;
  targetPath?: string;
}

export interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  affectedRecord: string;
}
