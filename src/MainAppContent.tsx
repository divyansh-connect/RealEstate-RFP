import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './components/DashboardPage';
import { ContactsPage } from './components/ContactsPage';
import { ContactDetailDrawer } from './components/ContactDetailDrawer';
import { ConversationsPage } from './components/ConversationsPage';
import { LeadQueuePage } from './components/LeadQueuePage';
import { DealsPage } from './components/DealsPage';
import { DealDetailDrawer } from './components/DealDetailDrawer';
import { ReportsPage } from './components/ReportsPage';
import { SettingsPage } from './components/SettingsPage';
import { ClickToCallModal } from './components/ClickToCallModal';
import type { RealtorContact, PropertyDeal } from './types/crm';

export const MainAppContent: React.FC = () => {
  const { isAuthenticated, setActiveConversationId, currentUser, deals } = useApp();
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Selected drawer objects
  const [selectedContact, setSelectedContact] = useState<RealtorContact | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<PropertyDeal | null>(null);
  const [callingContact, setCallingContact] = useState<RealtorContact | null>(null);

  // Always reset active view tab to 'dashboard' when logging in
  useEffect(() => {
    if (isAuthenticated) {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Strict Navigation Access Verification Matrix
  const allowedTabs: Record<string, string[]> = {
    ADMIN: ['dashboard', 'contacts', 'conversations', 'leadqueue', 'deals', 'reports', 'settings'],
    MANAGER: ['dashboard', 'contacts', 'conversations', 'leadqueue', 'deals', 'reports', 'settings'],
    AGENT: ['dashboard', 'contacts', 'conversations', 'leadqueue', 'deals'],
    READ_ONLY: ['dashboard', 'contacts', 'conversations', 'deals', 'reports']
  };

  const userRole = currentUser.role;
  const userAllowedTabs = allowedTabs[userRole] || ['dashboard'];

  // Guard against unauthorized route tab selection
  const safeActiveTab = userAllowedTabs.includes(activeTab) ? activeTab : 'dashboard';

  const handleNavigateWithTarget = (tab: string, convId?: string) => {
    if (userAllowedTabs.includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('dashboard');
    }
    if (convId) {
      setActiveConversationId(convId);
    }
  };

  const activeDealObj = deals.find(d => d.id === selectedDeal?.id) || selectedDeal;

  return (
    <AppShell activeTab={safeActiveTab} setActiveTab={handleNavigateWithTarget}>
      {safeActiveTab === 'dashboard' && <DashboardPage onNavigate={handleNavigateWithTarget} />}
      {safeActiveTab === 'contacts' && <ContactsPage onSelectContact={(c) => setSelectedContact(c)} />}
      {safeActiveTab === 'conversations' && <ConversationsPage />}
      {safeActiveTab === 'leadqueue' && <LeadQueuePage onNavigate={handleNavigateWithTarget} />}
      {safeActiveTab === 'deals' && <DealsPage onSelectDeal={(d) => setSelectedDeal(d)} />}
      {safeActiveTab === 'reports' && <ReportsPage />}
      {safeActiveTab === 'settings' && <SettingsPage />}

      {/* DRAWERS & MODALS */}
      <ContactDetailDrawer
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onOpenCallModal={(c) => setCallingContact(c)}
      />

      <DealDetailDrawer
        deal={activeDealObj}
        onClose={() => setSelectedDeal(null)}
        onOpenConversation={(convId) => {
          setSelectedDeal(null);
          handleNavigateWithTarget('conversations', convId);
        }}
      />

      <ClickToCallModal
        contact={callingContact}
        onClose={() => setCallingContact(null)}
      />
    </AppShell>
  );
};
