import React, { useState } from 'react';
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
import { RealtorContact, PropertyDeal } from './types/crm';

export const MainAppContent: React.FC = () => {
  const { isAuthenticated, setActiveConversationId } = useApp();
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Selected drawer objects
  const [selectedContact, setSelectedContact] = useState<RealtorContact | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<PropertyDeal | null>(null);
  const [callingContact, setCallingContact] = useState<RealtorContact | null>(null);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleNavigateWithTarget = (tab: string, convId?: string) => {
    setActiveTab(tab);
    if (convId) {
      setActiveConversationId(convId);
    }
  };

  return (
    <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardPage onNavigate={handleNavigateWithTarget} />}
      {activeTab === 'contacts' && <ContactsPage onSelectContact={(c) => setSelectedContact(c)} />}
      {activeTab === 'conversations' && <ConversationsPage />}
      {activeTab === 'leadqueue' && <LeadQueuePage onNavigate={handleNavigateWithTarget} />}
      {activeTab === 'deals' && <DealsPage onSelectDeal={(d) => setSelectedDeal(d)} />}
      {activeTab === 'reports' && <ReportsPage />}
      {activeTab === 'settings' && <SettingsPage />}

      {/* DRAWERS & MODALS */}
      <ContactDetailDrawer
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onOpenCallModal={(c) => setCallingContact(c)}
      />

      <DealDetailDrawer
        deal={selectedDeal}
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
