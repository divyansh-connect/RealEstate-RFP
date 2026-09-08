import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Send,
  MessageSquare,
  Building,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { contacts, conversations, deals, currentUser } = useApp();

  // Metrics dynamic calculation
  const totalContacts = contacts.length;
  const activeOutreach = contacts.filter(c => c.status === 'Enrolled' || c.status === 'Engaged').length;
  const totalResponded = contacts.filter(c => c.status === 'Engaged' || c.status === 'Converted').length;
  const optedOut = contacts.filter(c => c.status === 'Opted Out' || c.status === 'DNC').length;

  const totalDeals = deals.length;
  const activePipelineValue = deals.reduce((acc, d) => acc + d.askingPrice, 0);

  const gradeACount = conversations.filter(c => c.grade === 'A').length;
  const gradeBCount = conversations.filter(c => c.grade === 'B').length;
  const gradeCCount = conversations.filter(c => c.grade === 'C').length;
  const gradeDCount = conversations.filter(c => c.grade === 'D').length;

  const needsHumanCount = conversations.filter(c => c.status === 'Needs Human').length;
  const leadsWithAddressCount = conversations.filter(c => c.status === 'Leads With Address').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              ROLE: {currentUser.role}
            </span>
            <span className="text-xs text-slate-400 font-medium">DFW Acquisition Hub</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Executive Acquisition Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry on realtor outreach, AI conversation grades, and high-probability deals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('contacts')}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-amber-400" /> View Contacts
          </button>
          <button
            onClick={() => onNavigate('deals')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer"
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
          className="luxury-card luxury-card-hover rounded-2xl p-5 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-400 flex items-center gap-0.5">
              Manage <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{totalContacts}</div>
          <div className="text-xs font-semibold text-slate-300 mt-0.5">Total Realtor Contacts</div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span><strong className="text-emerald-400">{activeOutreach}</strong> Active</span>
            <span>&bull;</span>
            <span><strong className="text-slate-400">{optedOut}</strong> DNC/Opt-out</span>
          </div>
        </div>

        {/* Outreach Metric */}
        <div
          onClick={() => onNavigate('conversations')}
          className="luxury-card luxury-card-hover rounded-2xl p-5 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-400 flex items-center gap-0.5">
              Activity <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">1,482</div>
          <div className="text-xs font-semibold text-slate-300 mt-0.5">Outreach Dispatched (24h)</div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span>Reply Rate: <strong className="text-emerald-400">18.4%</strong></span>
            <span>&bull;</span>
            <span>SMS: 84%</span>
          </div>
        </div>

        {/* Conversation Metric */}
        <div
          onClick={() => onNavigate('conversations')}
          className="luxury-card luxury-card-hover rounded-2xl p-5 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-400 flex items-center gap-0.5">
              Inbox <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{conversations.length}</div>
          <div className="text-xs font-semibold text-slate-300 mt-0.5">Active AI Threads</div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span><strong className="text-amber-400">{needsHumanCount}</strong> Needs Human</span>
            <span>&bull;</span>
            <span><strong className="text-emerald-400">{leadsWithAddressCount}</strong> Addresses</span>
          </div>
        </div>

        {/* Deals Metric */}
        <div
          onClick={() => onNavigate('deals')}
          className="luxury-card luxury-card-hover rounded-2xl p-5 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-400 flex items-center gap-0.5">
              Pipeline <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">${(activePipelineValue / 1000000).toFixed(2)}M</div>
          <div className="text-xs font-semibold text-slate-300 mt-0.5">Active Deals Volume</div>
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <span><strong className="text-emerald-400">{totalDeals}</strong> Active Deals</span>
            <span>&bull;</span>
            <span>Avg: ${(activePipelineValue / Math.max(totalDeals, 1) / 1000).toFixed(0)}k</span>
          </div>
        </div>

      </div>

      {/* SECOND ROW: CONVERSATION GRADES & ACTION QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grade Distribution Bar & Breakdown */}
        <div className="luxury-card rounded-2xl p-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Conversation Quality</h3>
              <button onClick={() => onNavigate('conversations')} className="text-xs text-amber-400 hover:underline">Details &rarr;</button>
            </div>
            <p className="text-xs text-slate-400 mb-5">
              AI qualification grades based on address discovery, price feedback, and seller timeline.
            </p>

            {/* Visual Grade Distribution Pills */}
            <div className="grid grid-cols-4 gap-2 mb-6 text-center">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xl font-bold text-emerald-400">{gradeACount}</div>
                <div className="text-[10px] uppercase font-bold text-emerald-300 mt-1">Grade A</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-xl font-bold text-blue-400">{gradeBCount}</div>
                <div className="text-[10px] uppercase font-bold text-blue-300 mt-1">Grade B</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-xl font-bold text-amber-400">{gradeCCount}</div>
                <div className="text-[10px] uppercase font-bold text-amber-300 mt-1">Grade C</div>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <div className="text-xl font-bold text-rose-400">{gradeDCount}</div>
                <div className="text-[10px] uppercase font-bold text-rose-300 mt-1">Grade D</div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" /> High-Intent Conversations
            </span>
            <span className="font-bold font-mono text-amber-400">{gradeACount + gradeBCount} Threads</span>
          </div>
        </div>

        {/* Hot Leads / Needs Action Widget */}
        <div className="luxury-card rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Priority Attention Queue</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {needsHumanCount + leadsWithAddressCount} Items
              </span>
            </div>
            <button onClick={() => onNavigate('leadqueue')} className="text-xs text-amber-400 hover:underline">
              Open Lead Queue &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {conversations.slice(0, 3).map((conv) => (
              <div
                key={conv.id}
                onClick={() => onNavigate('conversations')}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    conv.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {conv.grade}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      {conv.realtorName} &bull; <span className="text-slate-400 font-normal">{conv.brokerage}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                      {conv.latestMessage}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    conv.status === 'Needs Human' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {conv.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* THIRD ROW: RECENT DEALS & SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Deals Table Preview */}
        <div className="luxury-card rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Deals Overview</h3>
            <button onClick={() => onNavigate('deals')} className="text-xs text-amber-400 hover:underline">View Pipeline &rarr;</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Property Address</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Asking Price</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {deals.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{d.address}</div>
                      <div className="text-[10px] text-slate-400">{d.city}, {d.state} {d.zip}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                        {d.stage}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      ${d.askingPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{d.ownerName}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('deals')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System & Telemetry Integration Status */}
        <div className="luxury-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">System Telemetry</h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Twilio SMS Gateway
                </span>
                <span className="text-[10px] font-mono text-emerald-400">99.98% Latency</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Microsoft 365 Email
                </span>
                <span className="text-[10px] font-mono text-emerald-400">Connected</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> AI Classification Engine
                </span>
                <span className="text-[10px] font-mono text-amber-400">Active (v2.4)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Last sync: 2 mins ago</span>
            <span className="text-emerald-400">0 Failed Jobs</span>
          </div>
        </div>

      </div>

    </div>
  );
};
