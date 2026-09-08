import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Building, UserCheck, MessageSquare, ArrowRight, ShieldAlert, Check } from 'lucide-react';

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
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {leadsWithAddress.length + needsHumanLeads.length} Action Items
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated triage workspace for high-intent realtor replies, captured addresses, and AI escalations.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-800 space-x-4">
        <button
          onClick={() => setActiveTab('address')}
          className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'address' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" /> LEADS WITH ADDRESS ({leadsWithAddress.length})
        </button>

        <button
          onClick={() => setActiveTab('needs_human')}
          className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'needs_human' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" /> NEEDS HUMAN TAKEOVER ({needsHumanLeads.length})
        </button>
      </div>

      {/* LEADS LIST CARDS */}
      <div className="space-y-4">
        {activeList.map((conv) => (
          <div
            key={conv.id}
            className="luxury-card luxury-card-hover rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${
                  conv.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {conv.grade}
                </span>
                <span className="font-bold text-white text-sm">{conv.realtorName}</span>
                <span className="text-slate-400 text-xs font-normal">({conv.brokerage})</span>
                <span className="text-[10px] text-slate-400 font-mono ml-auto md:ml-2">&bull; {conv.timestamp}</span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                "{conv.latestMessage}"
              </p>

              {conv.propertyCaptured && (
                <div className="flex items-center gap-3 text-xs text-emerald-400 font-medium">
                  <span>📍 {conv.propertyCaptured.address}, {conv.propertyCaptured.city}</span>
                  <span>&bull;</span>
                  <span>Asking: ${conv.propertyCaptured.askingPrice.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
              {!isReadOnly && (
                <button
                  onClick={() => claimLead(conv.id)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Claim Lead
                </button>
              )}

              <button
                onClick={() => onNavigate('conversations', conv.id)}
                className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Open Thread
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
