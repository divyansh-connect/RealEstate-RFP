import React, { createContext, useContext, useState } from 'react';
import type { UserProfile, UserRole, RealtorContact, Conversation, PropertyDeal, AppNotification, AuditLogItem, Grade, DealStage } from '../types/crm';
import { MOCK_USERS, INITIAL_CONTACTS, INITIAL_CONVERSATIONS, INITIAL_DEALS, INITIAL_NOTIFICATIONS, INITIAL_AUDIT_LOGS } from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  
  // User Management
  users: UserProfile[];
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
  toggleUserStatus: (id: string) => void;
  
  // Contacts State & Actions (CRUD + Soft Delete)
  contacts: RealtorContact[];
  addContact: (contact: Omit<RealtorContact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<RealtorContact>) => void;
  archiveContact: (id: string) => void;
  bulkUpdateContacts: (ids: string[], updates: Partial<RealtorContact>) => void;
  importContacts: (newContacts: Omit<RealtorContact, 'id'>[]) => void;
  
  // Conversations State & Actions
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => void;
  toggleAiTakeover: (conversationId: string, aiStatus: 'Active' | 'Human Takeover' | 'AI Off') => void;
  overrideGrade: (conversationId: string, newGrade: Grade, newScore: number, reason: string) => void;
  
  // Deals State & Actions (CRUD)
  deals: PropertyDeal[];
  activeDealId: string | null;
  setActiveDealId: (id: string | null) => void;
  addDeal: (deal: Omit<PropertyDeal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDealStage: (dealId: string, newStage: DealStage) => void;
  updateDeal: (dealId: string, updates: Partial<PropertyDeal>) => void;
  archiveDeal: (dealId: string) => void;
  addGeneratedContract: (dealId: string, contract: { templateName: string; fileName: string; fileType: 'pdf' | 'docx'; generatedBy: string }) => void;
  claimLead: (conversationId: string, assignedUserId?: string, assignedUserName?: string) => void;
  
  // Notifications & Audit Logs
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  auditLogs: AuditLogItem[];
  logAuditAction: (action: string, affectedRecord: string) => void;
  
  // Settings & Rules State
  settings: {
    cadenceIntervalDays: number;
    sendingHoursStart: string;
    sendingHoursEnd: string;
    aiInstructions: string;
    aiMaxConsecutiveReplies: number;
    globalAiEnabled: boolean;
    gradeWeights: { response: number; address: number; price: number; timeline: number };
  };
  updateSettings: (newSettings: Partial<AppContextType['settings']>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]); // Admin default
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  
  const [contacts, setContacts] = useState<RealtorContact[]>(INITIAL_CONTACTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');
  
  const [deals, setDeals] = useState<PropertyDeal[]>(INITIAL_DEALS);
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  
  const [settings, setSettings] = useState({
    cadenceIntervalDays: 3,
    sendingHoursStart: '08:00',
    sendingHoursEnd: '18:00',
    aiInstructions: 'Identify whether the realtor has an off-market property. Collect address, asking price, condition, and closing timeline. Keep messages professional, concise, and helpful.',
    aiMaxConsecutiveReplies: 4,
    globalAiEnabled: true,
    gradeWeights: { response: 25, address: 35, price: 20, timeline: 20 }
  });

  const setCurrentUserRole = (role: UserRole) => {
    const userForRole = users.find(u => u.role === role) || {
      ...currentUser,
      role
    };
    setCurrentUser(userForRole);
    logAuditAction(`Switched active view role to ${role}`, 'User Session');
  };

  const login = (email: string, role: UserRole = 'ADMIN') => {
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      avatar: email.substring(0, 2).toUpperCase(),
      title: 'Real Estate Executive',
      status: 'Active' as const
    };
    setCurrentUser(match);
    setIsAuthenticated(true);
    logAuditAction(`User logged in as ${match.role}`, `User Profile (${match.email})`);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addUser = (userData: Omit<UserProfile, 'id'>) => {
    const newUser = { ...userData, id: `usr-${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
    logAuditAction(`Added user ${newUser.name} (${newUser.role})`, `User #${newUser.id}`);
  };

  const updateUser = (id: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    logAuditAction(`Updated user profile`, `User #${id}`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Deactivated' : 'Active';
        return { ...u, status: nextStatus as 'Active' | 'Deactivated' };
      }
      return u;
    }));
    logAuditAction(`Toggled user activation status`, `User #${id}`);
  };

  const addContact = (contactData: Omit<RealtorContact, 'id'>) => {
    const newId = `cnt-${Date.now()}`;
    const newContact: RealtorContact = { ...contactData, id: newId };
    setContacts(prev => [newContact, ...prev]);
    logAuditAction(`Created new contact ${newContact.name}`, `Contact #${newId}`);
  };

  const updateContact = (id: string, updates: Partial<RealtorContact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logAuditAction(`Updated contact details for ID ${id}`, `Contact #${id}`);
  };

  const archiveContact = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, isArchived: true, status: 'Archived' } : c));
    logAuditAction(`Soft-deleted (archived) contact`, `Contact #${id}`);
  };

  const bulkUpdateContacts = (ids: string[], updates: Partial<RealtorContact>) => {
    setContacts(prev => prev.map(c => ids.includes(c.id) ? { ...c, ...updates } : c));
    logAuditAction(`Bulk updated ${ids.length} contacts`, `Contacts Batch (${ids.join(', ')})`);
  };

  const importContacts = (newContactsData: Omit<RealtorContact, 'id'>[]) => {
    const created = newContactsData.map((c, i) => ({
      ...c,
      id: `cnt-imp-${Date.now()}-${i}`
    }));
    setContacts(prev => [...created, ...prev]);
    logAuditAction(`Imported ${created.length} contacts via CSV`, 'CSV Import Wizard');
  };

  const sendMessage = (conversationId: string, text: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const isAiActive = conv.aiStatus === 'Active';
        const sender = isAiActive ? 'ai' : 'human';
        const newMsg = {
          id: `msg-${Date.now()}`,
          sender: sender as 'ai' | 'human',
          text,
          timestamp: 'Just now',
          channel: 'sms' as const
        };
        return {
          ...conv,
          latestMessage: text,
          timestamp: 'Just now',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));
  };

  const toggleAiTakeover = (conversationId: string, aiStatus: 'Active' | 'Human Takeover' | 'AI Off') => {
    setConversations(prev => prev.map(conv => conv.id === conversationId ? { ...conv, aiStatus } : conv));
    logAuditAction(`Changed AI status to ${aiStatus}`, `Conversation #${conversationId}`);
  };

  const overrideGrade = (conversationId: string, newGrade: Grade, newScore: number, reason: string) => {
    setConversations(prev => prev.map(conv => conv.id === conversationId ? {
      ...conv,
      grade: newGrade,
      score: newScore,
      gradeReason: `[Manual Override by ${currentUser.name}]: ${reason}`
    } : conv));
    logAuditAction(`Manually overridden grade to ${newGrade} (${newScore})`, `Conversation #${conversationId}`);
  };

  const addDeal = (dealData: Omit<PropertyDeal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeal: PropertyDeal = {
      ...dealData,
      id: `dl-${Date.now()}`,
      createdAt: 'Just now',
      updatedAt: 'Just now'
    };
    setDeals(prev => [newDeal, ...prev]);
    logAuditAction(`Manually created deal for ${newDeal.address}`, `Deal #${newDeal.id}`);
  };

  const updateDealStage = (dealId: string, newStage: DealStage) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage, updatedAt: 'Just now' } : d));
    logAuditAction(`Moved deal stage to ${newStage}`, `Deal #${dealId}`);
  };

  const updateDeal = (dealId: string, updates: Partial<PropertyDeal>) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, ...updates, updatedAt: 'Just now' } : d));
    logAuditAction(`Updated deal parameters`, `Deal #${dealId}`);
  };

  const archiveDeal = (dealId: string) => {
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, isArchived: true, stage: 'Trash' } : d));
    logAuditAction(`Soft-deleted (archived) deal`, `Deal #${dealId}`);
  };

  const addGeneratedContract = (dealId: string, contract: { templateName: string; fileName: string; fileType: 'pdf' | 'docx'; generatedBy: string }) => {
    const contractObj = {
      id: `ctr-${Date.now()}`,
      ...contract,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      version: 1
    };

    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const existing = d.generatedContracts || [];
        contractObj.version = existing.length + 1;
        return {
          ...d,
          generatedContracts: [contractObj, ...existing]
        };
      }
      return d;
    }));

    logAuditAction(`Generated contract version ${contractObj.version}`, `Deal #${dealId}`);
  };

  const claimLead = (conversationId: string, assignedUserId?: string, assignedUserName?: string) => {
    const targetUserId = assignedUserId || currentUser.id;
    const targetUserName = assignedUserName || currentUser.name;

    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    // Update conversation assignedOwner, status to Assigned, and switch AI to Human Takeover
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          assignedOwnerId: targetUserId,
          assignedOwnerName: targetUserName,
          status: 'Assigned',
          aiStatus: 'Human Takeover'
        };
      }
      return c;
    }));

    // Update Realtor Contact owner if matching contact exists
    if (conv.contactId) {
      setContacts(prev => prev.map(cnt => {
        if (cnt.id === conv.contactId) {
          return {
            ...cnt,
            ownerId: targetUserId,
            ownerName: targetUserName,
            status: 'Engaged'
          };
        }
        return cnt;
      }));
    }

    logAuditAction(`Claimed lead (assigned to ${targetUserName})`, `Conversation #${conversationId}`);

    // Create deal if property captured and deal doesn't exist yet
    if (conv.propertyCaptured && !deals.some(d => d.conversationId === conversationId)) {
      const newDeal: PropertyDeal = {
        id: `dl-${Date.now()}`,
        conversationId,
        contactId: conv.contactId,
        address: conv.propertyCaptured.address,
        city: conv.propertyCaptured.city,
        state: conv.propertyCaptured.state,
        zip: conv.propertyCaptured.zip,
        askingPrice: conv.propertyCaptured.askingPrice,
        beds: conv.propertyCaptured.beds,
        baths: conv.propertyCaptured.baths,
        sqft: conv.propertyCaptured.sqft,
        yearBuilt: 2005,
        propertyType: 'Single Family Residence',
        stage: 'Qualifying',
        isAiInbound: true,
        ownerId: targetUserId,
        ownerName: targetUserName,
        grade: conv.grade,
        score: conv.score,
        realtorName: conv.realtorName,
        realtorBrokerage: conv.brokerage,
        realtorPhone: conv.realtorPhone,
        realtorEmail: conv.realtorEmail,
        createdAt: 'Just now',
        updatedAt: 'Just now',
        source: 'AI Conversation Capture'
      };
      setDeals(prev => [newDeal, ...prev]);
    }

    logAuditAction(`Assigned/claimed lead to ${targetUserName}`, `Conversation #${conversationId}`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const logAuditAction = (action: string, affectedRecord: string) => {
    const newLog: AuditLogItem = {
      id: `aud-${Date.now()}`,
      actor: `${currentUser.name} (${currentUser.role})`,
      action,
      timestamp: 'Just now',
      affectedRecord
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateSettings = (newSettings: Partial<AppContextType['settings']>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAuditAction(`Updated system configuration settings`, 'System Administration');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUserRole,
      isAuthenticated,
      login,
      logout,
      users,
      addUser,
      updateUser,
      toggleUserStatus,
      contacts,
      addContact,
      updateContact,
      archiveContact,
      bulkUpdateContacts,
      importContacts,
      conversations,
      activeConversationId,
      setActiveConversationId,
      sendMessage,
      toggleAiTakeover,
      overrideGrade,
      deals,
      activeDealId,
      setActiveDealId,
      addDeal,
      updateDealStage,
      updateDeal,
      archiveDeal,
      addGeneratedContract,
      claimLead,
      notifications,
      markNotificationRead,
      auditLogs,
      logAuditAction,
      settings,
      updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
