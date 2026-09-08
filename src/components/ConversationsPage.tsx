import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Conversation, AIStatus, Grade } from '../types/crm';
import {
  MessageSquare,
  Bot,
  User,
  Send,
  ToggleLeft,
  ToggleRight,
  Power,
  ShieldCheck,
  Building,
  Check,
  AlertTriangle,
  Search,
  Filter,
  Flame,
  FileText,
  PhoneCall,
  Sliders,
  ChevronRight,
  X
} from 'lucide-react';

export const ConversationsPage: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    toggleAiTakeover,
    overrideGrade,
    currentUser,
    claimLead
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [gradeFilter, setGradeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Grade Override Modal state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideGradeVal, setOverrideGradeVal] = useState<Grade>('A');
  const [overrideScoreVal, setOverrideScoreVal] = useState<number>(92);
  const [overrideReason, setOverrideReason] = useState('');

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.realtorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brokerage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.latestMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' ? true :
      filterCategory === 'Needs Human' ? c.status === 'Needs Human' :
      filterCategory === 'Leads With Address' ? c.status === 'Leads With Address' :
      filterCategory === 'Wants Call' ? c.status === 'Wants Call' : true;

    const matchesGrade = gradeFilter === 'ALL' ? true : c.grade === gradeFilter;

    return matchesSearch && matchesCategory && matchesGrade;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConv) return;
    sendMessage(activeConv.id, messageInput);
    setMessageInput('');
  };

  const handleGradeOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !overrideReason.trim()) return;
    overrideGrade(activeConv.id, overrideGradeVal, overrideScoreVal, overrideReason);
    setShowOverrideModal(false);
    setOverrideReason('');
  };

  const isReadOnly = currentUser.role === 'READ_ONLY';

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col max-w-7xl mx-auto space-y-4">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            AI Inbox & Realtor Conversations
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {conversations.length} Active Threads
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time SMS/Email dialogs, automated address extraction, AI takeover toggles, and conversation grading.
          </p>
        </div>

        {activeConv && activeConv.status === 'Needs Human' && (
          <button
            onClick={() => claimLead(activeConv.id)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/10 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Flame className="w-4 h-4 text-slate-950" /> Claim Lead & Take Over
          </button>
        )}
      </div>

      {/* WORKSPACE MAIN 3-COLUMN LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        
        {/* COLUMN 1: CONVERSATION LIST (4 COLS) */}
        <div className="lg:col-span-4 luxury-card rounded-2xl flex flex-col overflow-hidden">
          
          {/* List Search & Filters */}
          <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-950/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search realtor or message..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
              {(['ALL', 'Needs Human', 'Leads With Address', 'Wants Call'] as string[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    filterCategory === cat ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected ? 'bg-slate-900/90 border-l-4 border-amber-500' : 'hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      {conv.realtorName}
                      {conv.unread && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{conv.timestamp}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 line-clamp-2 mb-2 font-light">
                    {conv.latestMessage}
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                      conv.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400' :
                      conv.grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      Grade {conv.grade} ({conv.score})
                    </span>

                    <span className={`px-2 py-0.5 rounded font-mono ${
                      conv.aiStatus === 'Active' ? 'bg-purple-500/10 text-purple-300' : 'bg-amber-500/10 text-amber-300'
                    }`}>
                      {conv.aiStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* COLUMN 2: THREAD & COMPOSER (5 COLS) */}
        <div className="lg:col-span-5 luxury-card rounded-2xl flex flex-col overflow-hidden">
          
          {/* Thread Header */}
          {activeConv && (
            <div className="p-3.5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{activeConv.realtorName}</div>
                <div className="text-[10px] text-slate-400">{activeConv.brokerage} &bull; {activeConv.realtorPhone}</div>
              </div>

              {/* AI Controls */}
              {!isReadOnly && (
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => toggleAiTakeover(activeConv.id, 'Active')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      activeConv.aiStatus === 'Active' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Active
                  </button>
                  <button
                    onClick={() => toggleAiTakeover(activeConv.id, 'Human Takeover')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      activeConv.aiStatus === 'Human Takeover' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Human Takeover
                  </button>
                  <button
                    onClick={() => toggleAiTakeover(activeConv.id, 'AI Off')}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      activeConv.aiStatus === 'AI Off' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AI Off
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/30">
            {activeConv?.messages.map((m) => {
              const isRealtor = m.sender === 'realtor';
              const isAi = m.sender === 'ai';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isRealtor ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[9px] text-slate-400">
                    {isAi && <Bot className="w-3 h-3 text-purple-400" />}
                    {!isRealtor && !isAi && <User className="w-3 h-3 text-amber-400" />}
                    <span className="font-bold">
                      {isRealtor ? activeConv.realtorName : isAi ? 'Apex AI Bot' : 'Human Specialist'}
                    </span>
                    <span>&bull; {m.timestamp}</span>
                  </div>

                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    isRealtor ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none' :
                    isAi ? 'bg-purple-950/40 border border-purple-500/30 text-purple-100 rounded-tr-none' :
                    'bg-amber-500/15 border border-amber-500/30 text-amber-100 rounded-tr-none'
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Composer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                disabled={isReadOnly}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={isReadOnly ? 'Read-only role cannot send messages' : 'Type SMS response to realtor...'}
                className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={isReadOnly || !messageInput.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>

        </div>

        {/* COLUMN 3: REALTOR & AI CONTEXT PANEL (3 COLS) */}
        <div className="lg:col-span-3 luxury-card rounded-2xl p-4 flex flex-col justify-between overflow-y-auto space-y-4">
          
          {activeConv && (
            <>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                  Thread Classification
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-amber-400">
                    {activeConv.classification}
                  </span>
                </h3>

                {/* Grade & Score Box */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Qualification Grade</span>
                    {!isReadOnly && (
                      <button
                        onClick={() => {
                          setOverrideGradeVal(activeConv.grade);
                          setOverrideScoreVal(activeConv.score);
                          setShowOverrideModal(true);
                        }}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Override Grade
                      </button>
                    )}
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    Grade {activeConv.grade} <span className="text-xs text-slate-400 font-normal">({activeConv.score}/100)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                    {activeConv.gradeReason}
                  </p>
                </div>

                {/* Property Captured Box */}
                {activeConv.propertyCaptured ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-2">
                      <Building className="w-4 h-4" /> Captured Property Opportunity
                    </div>
                    <div className="font-bold text-white">{activeConv.propertyCaptured.address}</div>
                    <div className="text-[11px] text-slate-400 mb-2">{activeConv.propertyCaptured.city}, {activeConv.propertyCaptured.state}</div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-300">
                        <span>Asking Price:</span>
                        <strong className="text-white">${activeConv.propertyCaptured.askingPrice.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Timeline:</span>
                        <strong className="text-amber-400">{activeConv.propertyCaptured.timeline}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-center">
                    No property address captured in thread yet.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                <div>AI Model: GPT-4o Acquisition Fine-tuned</div>
                <div>Last bot action: 10 mins ago</div>
              </div>
            </>
          )}

        </div>

      </div>

      {/* MANUAL GRADE OVERRIDE MODAL */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="luxury-card w-full max-w-md rounded-2xl p-6 relative">
            <button onClick={() => setShowOverrideModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Manual Grade & Score Override</h3>
            
            <form onSubmit={handleGradeOverrideSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">New Grade</label>
                <select
                  value={overrideGradeVal}
                  onChange={(e) => setOverrideGradeVal(e.target.value as Grade)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="A">Grade A (Hot Lead)</option>
                  <option value="B">Grade B (Moderate)</option>
                  <option value="C">Grade C (Low Priority)</option>
                  <option value="D">Grade D (Unqualified)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Numeric Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overrideScoreVal}
                  onChange={(e) => setOverrideScoreVal(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Justification / Reason</label>
                <textarea
                  rows={3}
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Explain why manual override is necessary..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
              >
                Apply Grade Override
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
