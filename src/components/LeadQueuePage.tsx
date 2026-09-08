import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Building, UserCheck, MessageSquare, Search, CheckCircle, UserPlus, X } from 'lucide-react';

interface LeadQueueProps {
  onNavigate: (tab: string, convId?: string) => void;
}

export const LeadQueuePage: React.FC<LeadQueueProps> = ({ onNavigate }) => {
  const { conversations, claimLead, currentUser, users } = useApp();
  const [activeTab, setActiveTab] = useState<'address' | 'needs_human'>('address');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const leadsWithAddress = conversations.filter(c => c.status === 'Leads With Address' || (c.status === 'Assigned' && !!c.propertyCaptured));
  const needsHumanLeads = conversations.filter(c => c.status === 'Needs Human' || c.status === 'Wants Call' || (c.status === 'Assigned' && !c.propertyCaptured));

  const activeList = (activeTab === 'address' ? leadsWithAddress : needsHumanLeads).filter(conv => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = conv.realtorName.toLowerCase().includes(q);
    const brokerMatch = conv.brokerage.toLowerCase().includes(q);
    const addressMatch = conv.propertyCaptured?.address.toLowerCase().includes(q) || false;
    const msgMatch = conv.latestMessage.toLowerCase().includes(q);
    const ownerMatch = conv.assignedOwnerName?.toLowerCase().includes(q) || false;
    return nameMatch || brokerMatch || addressMatch || msgMatch || ownerMatch;
  });

  const isReadOnly = currentUser.role === 'READ_ONLY';
  const isAdminOrManager = currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER';

  const handleClaim = (convId: string, targetUserId?: string, targetUserName?: string) => {
    claimLead(convId, targetUserId, targetUserName);
    const assignedTo = targetUserName || currentUser.name;
    showToast(`Lead assigned to ${assignedTo} successfully.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 relative">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#161b33] border border-[#7c5cfc] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-[#35b77a]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Priority Lead Queue
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-[#7c5cfc]/15 text-[#9b8afb] border border-[#7c5cfc]/30">
              {leadsWithAddress.length + needsHumanLeads.length} Action Items
            </span>
          </h1>
          <p className="text-xs text-[#a7adc0] mt-1">
            Dedicated triage workspace for high-intent realtor replies, captured addresses, and AI escalations.
          </p>
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#737b91] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, address, brokerage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101323] border border-[#202641] focus:border-[#7c5cfc] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-[#737b91] focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737b91] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-[#202641] space-x-4">
        <button
          onClick={() => setActiveTab('address')}
          className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'address' ? 'border-[#7c5cfc] text-[#9b8afb]' : 'border-transparent text-[#737b91] hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" /> LEADS WITH ADDRESS ({leadsWithAddress.length})
        </button>

        <button
          onClick={() => setActiveTab('needs_human')}
          className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'needs_human' ? 'border-[#7c5cfc] text-[#9b8afb]' : 'border-transparent text-[#737b91] hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4 text-[#7c5cfc]" /> NEEDS HUMAN TAKEOVER ({needsHumanLeads.length})
        </button>
      </div>

      {/* LEADS LIST CARDS */}
      <div className="space-y-4">
        {activeList.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#737b91] bg-[#101323]/50 rounded-2xl border border-[#202641]">
            No leads found matching your criteria.
          </div>
        ) : (
          activeList.map((conv) => {
            const isAssigned = !!conv.assignedOwnerName;

            return (
              <div
                key={conv.id}
                className="executive-panel executive-panel-hover rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center bg-[#101323] text-[#9b8afb] border border-[#202641]">
                      {conv.grade}
                    </span>
                    <span className="font-bold text-white text-sm">{conv.realtorName}</span>
                    <span className="text-[#a7adc0] text-xs font-normal">({conv.brokerage})</span>
                    
                    {/* OWNER BADGE */}
                    {isAssigned ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#35b77a]/15 text-[#35b77a] border border-[#35b77a]/30 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> Assigned to {conv.assignedOwnerName}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Unassigned
                      </span>
                    )}

                    <span className="text-[10px] text-[#737b91] font-mono ml-auto md:ml-2">&bull; {conv.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 bg-[#070811] p-3 rounded-xl border border-[#202641]">
                    "{conv.latestMessage}"
                  </p>

                  {conv.propertyCaptured && (
                    <div className="flex items-center gap-3 text-xs text-[#35b77a] font-medium">
                      <span>📍 {conv.propertyCaptured.address}, {conv.propertyCaptured.city}</span>
                      <span>&bull;</span>
                      <span>Asking: ${conv.propertyCaptured.askingPrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#202641]">
                  {!isReadOnly && (
                    <>
                      {/* ADMIN / MANAGER REASSIGNMENT SELECTOR */}
                      {isAdminOrManager && (
                        <div className="relative flex items-center">
                          <select
                            value={conv.assignedOwnerId || ''}
                            onChange={(e) => {
                              const selectedUser = users.find(u => u.id === e.target.value);
                              if (selectedUser) {
                                handleClaim(conv.id, selectedUser.id, selectedUser.name);
                              }
                            }}
                            className="px-3 py-2 bg-[#101323] border border-[#202641] hover:border-[#7c5cfc]/40 text-slate-200 text-xs font-semibold rounded-xl transition-all appearance-none pr-8 cursor-pointer focus:outline-none focus:border-[#7c5cfc]"
                          >
                            <option value="" disabled>Assign Owner...</option>
                            {users.map(u => (
                              <option key={u.id} value={u.id} className="bg-[#101323] text-white">
                                {u.name} ({u.role})
                              </option>
                            ))}
                          </select>
                          <UserPlus className="w-3.5 h-3.5 text-[#9b8afb] absolute right-2.5 pointer-events-none" />
                        </div>
                      )}

                      {/* CLAIM LEAD BUTTON - SHOW IF UNASSIGNED OR ASSIGNED TO ANOTHER USER */}
                      {(!isAssigned || conv.assignedOwnerId !== currentUser.id) && (
                        <button
                          onClick={() => handleClaim(conv.id)}
                          className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          {isAssigned ? 'Reassign to Me' : 'Claim Lead'}
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => onNavigate('conversations', conv.id)}
                    className="px-4 py-2 bg-[#101323] border border-[#202641] hover:border-[#7c5cfc]/40 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#9b8afb]" /> Open Thread
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

