import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Building, UserCheck, MessageSquare } from 'lucide-react';

interface LeadQueueProps {
  onNavigate: (tab: string, convId?: string) => void;
}

export const LeadQueuePage: React.FC<LeadQueueProps> = ({ onNavigate }) => {
  const { conversations, claimLead, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'address' | 'needs_human'>('address');

  const leadsWithAddress = conversations.filter(c => c.status === 'Leads With Address');
  const needsHumanLeads = conversations.filter(c => c.status === 'Needs Human' || c.status === 'Wants Call');

  const activeList = activeTab === 'address' ? leadsWithAddress : needsHumanLeads;
  const isReadOnly = currentUser.role === 'READ_ONLY';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
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
        {activeList.map((conv) => (
          <div
            key={conv.id}
            className="executive-panel executive-panel-hover rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center bg-[#101323] text-[#9b8afb] border border-[#202641]">
                  {conv.grade}
                </span>
                <span className="font-bold text-white text-sm">{conv.realtorName}</span>
                <span className="text-[#a7adc0] text-xs font-normal">({conv.brokerage})</span>
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
                <button
                  onClick={() => claimLead(conv.id)}
                  className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Claim Lead
                </button>
              )}

              <button
                onClick={() => onNavigate('conversations', conv.id)}
                className="px-4 py-2 bg-[#101323] border border-[#202641] hover:border-[#7c5cfc]/40 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#9b8afb]" /> Open Thread
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
