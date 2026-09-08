import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Conversation, Grade } from '../types/crm';
import {
  Bot,
  User,
  Send,
  Building,
  Flame,
  Search,
  X,
  ArrowLeft,
  Info,
  MessageSquare,
  Sliders
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
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile View Switcher State ('list' | 'chat' | 'details')
  const [mobileView, setMobileView] = useState<'list' | 'chat' | 'details'>('chat');

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

    return matchesSearch && matchesCategory;
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
  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col max-w-7xl mx-auto space-y-4">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2">
            <span>Conversations Workspace</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#7c5cfc]/15 text-[#9b8afb] border border-[#7c5cfc]/30 shrink-0 whitespace-nowrap">
              {conversations.length} Active Dialogs
            </span>
          </h1>
          <p className="text-xs text-[#a7adc0] mt-1">
            Real-time SMS dialogs, address extraction, AI takeover switches, and conversation qualification scoring.
          </p>
        </div>

        {activeConv && activeConv.status === 'Needs Human' && !isReadOnly && (
          <button
            onClick={() => claimLead(activeConv.id)}
            className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7c5cfc]/20 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0 whitespace-nowrap"
          >
            <Flame className="w-4 h-4" /> Claim & Take Over
          </button>
        )}
      </div>

      {/* MOBILE SEGMENTED VIEW SWITCHER (VISIBLE ONLY ON MOBILE < LG) */}
      <div className="lg:hidden flex items-center bg-[#070811] p-1 rounded-xl border border-[#202641]">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileView === 'list' ? 'bg-[#7c5cfc] text-white shadow-md' : 'text-[#a7adc0]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Threads ({filteredConversations.length})
        </button>
        <button
          onClick={() => setMobileView('chat')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileView === 'chat' ? 'bg-[#7c5cfc] text-white shadow-md' : 'text-[#a7adc0]'
          }`}
        >
          <Send className="w-3.5 h-3.5" /> Chat
        </button>
        <button
          onClick={() => setMobileView('details')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileView === 'details' ? 'bg-[#7c5cfc] text-white shadow-md' : 'text-[#a7adc0]'
          }`}
        >
          <Info className="w-3.5 h-3.5" /> Details
        </button>
      </div>

      {/* WORKSPACE MAIN 3-COLUMN LAYOUT */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        
        {/* COLUMN 1: CONVERSATION LIST (4 COLS) */}
        <div className={`lg:col-span-4 executive-panel rounded-2xl flex flex-col overflow-hidden ${
          mobileView === 'list' ? 'flex h-full' : 'hidden lg:flex'
        }`}>
          
          {/* List Search & Filters */}
          <div className="p-3 border-b border-[#202641] space-y-2 bg-[#070811]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#737b91] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search realtor or dialog..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#101323] border border-[#202641] rounded-xl text-xs text-[#f5f5f7] focus:outline-none focus:border-[#7c5cfc]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
              {(['ALL', 'Needs Human', 'Leads With Address', 'Wants Call'] as string[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    filterCategory === cat ? 'bg-[#7c5cfc] text-white' : 'bg-[#101323] text-[#a7adc0] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#202641]">
            {filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setMobileView('chat');
                  }}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected ? 'bg-[#171c33] border-l-4 border-[#7c5cfc]' : 'hover:bg-[#171c33]/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-xs text-white flex items-center gap-1.5">
                      {conv.realtorName}
                    </span>
                    <span className="text-[10px] text-[#737b91] font-mono">{conv.timestamp}</span>
                  </div>

                  <div className="text-[11px] text-[#a7adc0] line-clamp-2 mb-2 font-light">
                    {conv.latestMessage}
                  </div>

                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded font-bold uppercase bg-[#101323] text-[#9b8afb] border border-[#202641]">
                      Grade {conv.grade} ({conv.score})
                    </span>

                    <span className="px-2 py-0.5 rounded font-mono bg-[#070811] text-[#a7adc0] border border-[#202641]">
                      {conv.aiStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* COLUMN 2: THREAD & COMPOSER (5 COLS) */}
        <div className={`lg:col-span-5 executive-panel rounded-2xl flex flex-col overflow-hidden ${
          mobileView === 'chat' ? 'flex h-full' : 'hidden lg:flex'
        }`}>
          
          {/* Thread Header */}
          {activeConv && (
            <div className="p-3 border-b border-[#202641] bg-[#070811] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileView('list')}
                  className="lg:hidden p-1.5 rounded-lg bg-[#101323] border border-[#202641] text-[#a7adc0] hover:text-white"
                  title="Back to Threads List"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div>
                  <div className="text-xs font-bold text-white leading-tight">{activeConv.realtorName}</div>
                  <div className="text-[10px] text-[#a7adc0]">{activeConv.brokerage} &bull; {activeConv.realtorPhone}</div>
                </div>
              </div>

              {/* AI Controls & Mobile Info Button */}
              <div className="flex items-center gap-2">
                {!isReadOnly && (
                  <div className="flex items-center gap-1 bg-[#101323] p-1 rounded-xl border border-[#202641]">
                    <button
                      onClick={() => toggleAiTakeover(activeConv.id, 'Active')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        activeConv.aiStatus === 'Active' ? 'bg-[#7c5cfc] text-white shadow-md' : 'text-[#a7adc0] hover:text-white'
                      }`}
                    >
                      AI Active
                    </button>
                    <button
                      onClick={() => toggleAiTakeover(activeConv.id, 'Human Takeover')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        activeConv.aiStatus === 'Human Takeover' ? 'bg-[#5965d8] text-white shadow-md' : 'text-[#a7adc0] hover:text-white'
                      }`}
                    >
                      Human
                    </button>
                    <button
                      onClick={() => toggleAiTakeover(activeConv.id, 'AI Off')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        activeConv.aiStatus === 'AI Off' ? 'bg-[#d05a72] text-white shadow-md' : 'text-[#a7adc0] hover:text-white'
                      }`}
                    >
                      Off
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setMobileView('details')}
                  className="lg:hidden p-1.5 rounded-lg bg-[#101323] border border-[#202641] text-[#9b8afb] hover:text-white"
                  title="View Qualification Details"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070811]/60">
            {activeConv?.messages.map((m) => {
              const isRealtor = m.sender === 'realtor';
              const isAi = m.sender === 'ai';

              return (
                <div key={m.id} className={`flex flex-col ${isRealtor ? 'items-start' : 'items-end'}`}>
                  <div className="flex items-center gap-1.5 mb-1 text-[9px] text-[#737b91]">
                    {isAi && <Bot className="w-3 h-3 text-[#a855f7]" />}
                    {!isRealtor && !isAi && <User className="w-3 h-3 text-[#7c5cfc]" />}
                    <span className="font-bold">
                      {isRealtor ? activeConv.realtorName : isAi ? 'Apex AI Agent' : 'Human Specialist'}
                    </span>
                    <span>&bull; {m.timestamp}</span>
                  </div>

                  <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    isRealtor ? 'bg-[#101323] border border-[#202641] text-[#f5f5f7] rounded-tl-none' :
                    isAi ? 'bg-[#7c5cfc]/15 border border-[#7c5cfc]/30 text-[#f5f5f7] rounded-tr-none' :
                    'bg-[#5965d8]/20 border border-[#5965d8]/40 text-[#f5f5f7] rounded-tr-none font-medium'
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Composer */}
          <div className="p-3 border-t border-[#202641] bg-[#070811]">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                disabled={isReadOnly}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={isReadOnly ? 'Read-only role cannot send messages' : 'Type response to realtor...'}
                className="flex-1 px-3.5 py-2 bg-[#101323] border border-[#202641] rounded-xl text-xs text-white placeholder-[#737b91] focus:outline-none focus:border-[#7c5cfc]"
              />
              <button
                type="submit"
                disabled={isReadOnly || !messageInput.trim()}
                className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </form>
          </div>

        </div>

        {/* COLUMN 3: REALTOR & AI CONTEXT PANEL (3 COLS) */}
        <div className={`lg:col-span-3 executive-panel rounded-2xl p-4 flex flex-col justify-between overflow-y-auto space-y-4 ${
          mobileView === 'details' ? 'flex h-full' : 'hidden lg:flex'
        }`}>
          
          {activeConv && (
            <>
              <div>
                <div className="lg:hidden flex items-center justify-between pb-3 mb-2 border-b border-[#202641]">
                  <button
                    onClick={() => setMobileView('chat')}
                    className="flex items-center gap-1 text-xs text-[#9b8afb] font-bold"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Chat
                  </button>
                  <span className="text-xs font-bold text-white uppercase">Qualification Panel</span>
                </div>

                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
                  Thread Classification
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#101323] text-[#9b8afb] border border-[#202641]">
                    {activeConv.classification}
                  </span>
                </h3>

                {/* Grade & Score Box */}
                <div className="p-3.5 rounded-xl bg-[#070811] border border-[#202641] mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-[#737b91] uppercase font-bold">Grade Rating</span>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setOverrideGradeVal(activeConv.grade);
                          setOverrideScoreVal(activeConv.score);
                          setShowOverrideModal(true);
                        }}
                        className="text-[10px] text-[#9b8afb] hover:underline"
                      >
                        Override Grade
                      </button>
                    )}
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#9b8afb]">
                    Grade {activeConv.grade} <span className="text-xs text-[#737b91] font-normal">({activeConv.score}/100)</span>
                  </div>
                  <p className="text-[11px] text-[#a7adc0] mt-1 leading-snug">
                    {activeConv.gradeReason}
                  </p>
                </div>

                {/* Property Captured Box */}
                {activeConv.propertyCaptured ? (
                  <div className="p-3.5 rounded-xl bg-[#070811] border border-[#7c5cfc]/30 text-xs">
                    <div className="flex items-center gap-1.5 text-[#35b77a] font-bold mb-2">
                      <Building className="w-4 h-4" /> Captured Opportunity
                    </div>
                    <div className="font-bold text-white">{activeConv.propertyCaptured.address}</div>
                    <div className="text-[11px] text-[#a7adc0] mb-2">{activeConv.propertyCaptured.city}, {activeConv.propertyCaptured.state}</div>

                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between text-[#a7adc0]">
                        <span>Asking Price:</span>
                        <strong className="text-white">${activeConv.propertyCaptured.askingPrice.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between text-[#a7adc0]">
                        <span>Timeline:</span>
                        <strong className="text-[#9b8afb]">{activeConv.propertyCaptured.timeline}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#070811] border border-[#202641] text-[11px] text-[#737b91] text-center">
                    No property address captured in thread yet.
                  </div>
                )}
              </div>
            </>
          )}

        </div>

      </div>

      {/* MANUAL GRADE OVERRIDE MODAL */}
      {showOverrideModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-md rounded-2xl p-6 relative">
            <button onClick={() => setShowOverrideModal(false)} className="absolute top-5 right-5 text-[#737b91] hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Manual Grade Override</h3>
            
            <form onSubmit={handleGradeOverrideSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a7adc0] font-semibold mb-1">New Grade</label>
                <select
                  value={overrideGradeVal}
                  onChange={(e) => setOverrideGradeVal(e.target.value as Grade)}
                  className="w-full p-2.5 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                >
                  <option value="A">Grade A (Hot Lead)</option>
                  <option value="B">Grade B (Moderate)</option>
                  <option value="C">Grade C (Low Priority)</option>
                  <option value="D">Grade D (Unqualified)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#a7adc0] font-semibold mb-1">Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overrideScoreVal}
                  onChange={(e) => setOverrideScoreVal(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a7adc0] font-semibold mb-1">Reason / Justification</label>
                <textarea
                  rows={3}
                  required
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full p-2.5 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7c5cfc] hover:bg-[#6847e8] text-white font-bold rounded-xl"
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
