import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Send, MessageSquare, Building, ArrowUpRight, Flame, Bot, Sparkles } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { contacts, conversations, deals, currentUser } = useApp();

  const activeContacts = contacts.filter(c => !c.isArchived);
  const activeDeals = deals.filter(d => !d.isArchived);

  const totalContacts = activeContacts.length;
  const activeOutreach = activeContacts.filter(c => c.status === 'Active in Outreach' || c.status === 'Responded').length;
  const optedOut = activeContacts.filter(c => c.status === 'Opted Out' || c.status === 'Do Not Contact').length;

  const totalDealsCount = activeDeals.length;
  const activePipelineValue = activeDeals.reduce((acc, d) => acc + d.askingPrice, 0);

  const gradeACount = conversations.filter(c => c.grade === 'A').length;
  const gradeBCount = conversations.filter(c => c.grade === 'B').length;
  const gradeCCount = conversations.filter(c => c.grade === 'C').length;
  const gradeDCount = conversations.filter(c => c.grade === 'D').length;

  const needsHumanCount = conversations.filter(c => c.status === 'Needs Human').length;
  const leadsWithAddressCount = conversations.filter(c => c.status === 'Leads With Address').length;

  const isAgent = currentUser.role === 'AGENT';
  const isReadOnly = currentUser.role === 'READ_ONLY';
  const isManager = currentUser.role === 'MANAGER';

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Welcome Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#202641]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#7c5cfc]/15 text-[#9b8afb] border border-[#7c5cfc]/30 uppercase shrink-0">
              ROLE: {currentUser.role.replace('_', ' ')}
            </span>
            <span className="text-xs text-[#a7adc0] font-medium">Dallas-Fort Worth Acquisitions Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f5f5f7]">
            {isAgent ? `Acquisitions Workbench — ${currentUser.name}` :
             isManager ? 'Acquisitions Workload & Team Telemetry' :
             isReadOnly ? 'Executive Investment Overview' :
             'Executive Acquisition Dashboard'}
          </h1>
          <p className="text-xs text-[#a7adc0] mt-1">
            Real-time telemetry on realtor outreach, AI conversation grades, and high-probability deals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('contacts')}
            className="flex-1 sm:flex-initial px-4 py-2 bg-[#12162a] border border-[#202641] hover:border-[#7c5cfc]/40 text-[#f5f5f7] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Users className="w-4 h-4 text-[#7c5cfc]" /> Contacts Directory
          </button>
          <button
            onClick={() => onNavigate('deals')}
            className="flex-1 sm:flex-initial px-4 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#7c5cfc]/20 transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Building className="w-4 h-4" /> Deals Workspace
          </button>
        </div>
      </div>

      {/* KPI TOP METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Contact Metric */}
        <div
          onClick={() => onNavigate('contacts')}
          className="executive-panel executive-panel-hover rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-[#101323] border border-[#202641] text-[#a7adc0]">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-[#737b91] group-hover:text-[#9b8afb] flex items-center gap-0.5">
              Inspect <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#f5f5f7] tracking-tight">{totalContacts}</div>
          <div className="text-xs font-semibold text-[#a7adc0] mt-0.5">Total Realtor Contacts</div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#202641] text-[11px] text-[#737b91]">
            <span><strong className="text-[#35b77a]">{activeOutreach}</strong> Active</span>
            <span>&bull;</span>
            <span><strong className="text-[#737b91]">{optedOut}</strong> Opt-out</span>
          </div>
        </div>

        {/* Outreach Metric */}
        <div
          onClick={() => onNavigate('contacts')}
          className="executive-panel executive-panel-hover rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-[#101323] border border-[#202641] text-[#a7adc0]">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-[#737b91] group-hover:text-[#9b8afb] flex items-center gap-0.5">
              Activity <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#f5f5f7] tracking-tight">1,482</div>
          <div className="text-xs font-semibold text-[#a7adc0] mt-0.5">Outreach Dispatched (24h)</div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#202641] text-[11px] text-[#737b91]">
            <span>Reply Rate: <strong className="text-[#35b77a]">18.4%</strong></span>
            <span>&bull;</span>
            <span>SMS: 84%</span>
          </div>
        </div>

        {/* Conversation Metric */}
        <div
          onClick={() => onNavigate('conversations')}
          className="executive-panel executive-panel-hover rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-[#7c5cfc]/15 text-[#9b8afb] border border-[#7c5cfc]/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-[#737b91] group-hover:text-[#9b8afb] flex items-center gap-0.5">
              Inbox <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#f5f5f7] tracking-tight">{conversations.length}</div>
          <div className="text-xs font-semibold text-[#a7adc0] mt-0.5">Active Dialog Threads</div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#202641] text-[11px] text-[#737b91]">
            <span><strong className="text-[#9b8afb]">{needsHumanCount}</strong> Needs Human</span>
            <span>&bull;</span>
            <span><strong className="text-[#35b77a]">{leadsWithAddressCount}</strong> Addresses</span>
          </div>
        </div>

        {/* Deals Metric */}
        <div
          onClick={() => onNavigate('deals')}
          className="executive-panel executive-panel-hover rounded-2xl p-5 cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-[#101323] border border-[#202641] text-[#a7adc0]">
              <Building className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-[#737b91] group-hover:text-[#9b8afb] flex items-center gap-0.5">
              Pipeline <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl font-bold text-[#f5f5f7] tracking-tight">${(activePipelineValue / 1000000).toFixed(2)}M</div>
          <div className="text-xs font-semibold text-[#a7adc0] mt-0.5">Active Deals Volume</div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#202641] text-[11px] text-[#737b91]">
            <span><strong className="text-[#35b77a]">{totalDealsCount}</strong> Active Deals</span>
          </div>
        </div>

      </div>

      {/* SECOND ROW: AI QUALIFICATION & ACTION QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grade Distribution Breakdown - AI Qualification Card */}
        <div className="executive-panel rounded-2xl p-5 sm:p-6 lg:col-span-1 flex flex-col justify-between relative overflow-hidden border-[#7c5cfc]/30 shadow-[0_0_20px_rgba(124,92,252,0.08)]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#7c5cfc]/20 text-[#a855f7] border border-[#7c5cfc]/30">
                  <Bot className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider truncate">AI Qualification Telemetry</h3>
              </div>
              <button onClick={() => onNavigate('conversations')} className="text-xs text-[#9b8afb] hover:underline shrink-0">Details &rarr;</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-center">
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#070811] border border-[#35b77a]/30">
                <div className="text-lg sm:text-xl font-bold text-[#35b77a]">{gradeACount}</div>
                <div className="text-[10px] uppercase font-bold text-[#737b91] mt-0.5 truncate">Grade A</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#070811] border border-[#5965d8]/30">
                <div className="text-lg sm:text-xl font-bold text-[#5965d8]">{gradeBCount}</div>
                <div className="text-[10px] uppercase font-bold text-[#737b91] mt-0.5 truncate">Grade B</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#070811] border border-[#9b8afb]/30">
                <div className="text-lg sm:text-xl font-bold text-[#9b8afb]">{gradeCCount}</div>
                <div className="text-[10px] uppercase font-bold text-[#737b91] mt-0.5 truncate">Grade C</div>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#070811] border border-[#d05a72]/30">
                <div className="text-lg sm:text-xl font-bold text-[#d05a72]">{gradeDCount}</div>
                <div className="text-[10px] uppercase font-bold text-[#737b91] mt-0.5 truncate">Grade D</div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl bg-[#070811] border border-[#7c5cfc]/40 text-xs text-[#f5f5f7] flex items-center justify-between shadow-[inset_0_0_12px_rgba(124,92,252,0.1)] gap-2">
            <span className="flex items-center gap-2 truncate">
              <Sparkles className="w-4 h-4 text-[#a855f7] shrink-0" /> <span className="truncate">AI High-Intent Threads</span>
            </span>
            <span className="font-bold font-mono text-[#9b8afb] text-xs sm:text-sm shrink-0">{gradeACount + gradeBCount} Qualified</span>
          </div>
        </div>

        {/* Priority Attention Queue */}
        <div className="executive-panel rounded-2xl p-5 sm:p-6 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Priority Attention Queue</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7c5cfc] text-white shrink-0">
                {needsHumanCount + leadsWithAddressCount} Items
              </span>
            </div>
            {!isReadOnly && (
              <button onClick={() => onNavigate('leadqueue')} className="text-xs text-[#9b8afb] hover:underline self-start sm:self-auto">
                Open Lead Queue &rarr;
              </button>
            )}
          </div>

          <div className="space-y-3">
            {conversations.slice(0, 3).map((conv) => (
              <div
                key={conv.id}
                onClick={() => onNavigate('conversations', conv.id)}
                className="p-3.5 rounded-xl bg-[#070811] border border-[#202641] hover:border-[#7c5cfc]/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-[#101323] text-[#f5f5f7] font-bold text-xs flex items-center justify-center border border-[#202641] shrink-0 mt-0.5 sm:mt-0">
                    {conv.grade}
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="text-xs font-bold text-white flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                      <span>{conv.realtorName}</span>
                      <span className="text-[#737b91] hidden sm:inline">&bull;</span>
                      <span className="text-[#a7adc0] font-normal text-[11px] sm:text-xs">({conv.brokerage})</span>
                    </div>
                    <div className="text-[11px] text-[#a7adc0] truncate">
                      "{conv.latestMessage}"
                    </div>
                  </div>
                </div>

                <span className="self-start sm:self-center shrink-0 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#101323] text-[#9b8afb] border border-[#202641] whitespace-nowrap">
                  {conv.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
