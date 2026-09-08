import React, { useState } from 'react';
import type { RealtorContact } from '../types/crm';
import { useApp } from '../context/AppContext';
import { X, Mail, Phone, Pause, Play, Ban } from 'lucide-react';

interface ContactDrawerProps {
  contact: RealtorContact | null;
  onClose: () => void;
  onOpenCallModal: (contact: RealtorContact) => void;
}

export const ContactDetailDrawer: React.FC<ContactDrawerProps> = ({ contact, onClose, onOpenCallModal }) => {
  const { updateContact, currentUser, logAuditAction } = useApp();
  const [activeTab, setActiveTab] = useState<'timeline' | 'notes'>('timeline');
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>(contact?.notes || [
    'Agent mentioned seller is highly motivated for all-cash quick close.',
    'Confirmed TREC active status and verified license details.'
  ]);

  if (!contact) return null;

  const isReadOnly = currentUser.role === 'READ_ONLY';

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotesList([newNote, ...notesList]);
    setNewNote('');
    logAuditAction(`Added manual note to contact`, `Contact #${contact.id}`);
  };

  const timelineEvents = [
    { type: 'sms_reply', title: 'Realtor SMS Reply Received', desc: '"Yes, 4812 Bordeaux Ave in Highland Park! Asking $1,450,000..."', time: '10 mins ago', actor: contact.name },
    { type: 'ai_response', title: 'AI Automation Dispatched', desc: 'Asked for exact property address and asking price.', time: '12 mins ago', actor: 'Apex AI Bot' },
    { type: 'sms_sent', title: 'Outreach SMS Sent', desc: 'Initial cadence touchpoint #1 dispatched.', time: '15 mins ago', actor: 'Cadence Engine' },
    { type: 'status_change', title: 'Status Changed to Engaged', desc: 'Realtor replied positively to outreach.', time: '15 mins ago', actor: 'System' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-[#070811] border-l border-[#202641] h-full flex flex-col shadow-2xl relative">
        
        {/* DRAWER HEADER */}
        <div className="p-6 border-b border-[#202641] flex items-start justify-between bg-[#0b0d18]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{contact.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#101323] text-[#9b8afb] border border-[#202641]">
                {contact.status}
              </span>
            </div>
            <p className="text-xs text-[#a7adc0] mt-1">{contact.brokerage} &bull; <span className="font-mono text-slate-300">{contact.licenseNumber}</span></p>
          </div>

          <button onClick={onClose} className="p-1.5 text-[#737b91] hover:text-white rounded-lg border border-[#202641]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACTIONS BAR - HIDE WRITE ACTIONS COMPLETELY FOR READ_ONLY */}
        {!isReadOnly && (
          <div className="p-4 bg-[#0b0d18]/60 border-b border-[#202641] flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenCallModal(contact)}
                className="px-3.5 py-1.5 rounded-lg bg-[#35b77a] hover:bg-[#2fa26c] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Phone className="w-3.5 h-3.5" /> Call Realtor
              </button>
              
              {contact.status === 'Enrolled' ? (
                <button
                  onClick={() => updateContact(contact.id, { status: 'New' })}
                  className="px-3 py-1.5 rounded-lg bg-[#101323] hover:bg-[#171c33] text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Pause className="w-3.5 h-3.5 text-[#9b8afb]" /> Pause Cadence
                </button>
              ) : (
                <button
                  onClick={() => updateContact(contact.id, { status: 'Enrolled' })}
                  className="px-3 py-1.5 rounded-lg bg-[#101323] hover:bg-[#171c33] text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-[#35b77a]" /> Enroll Cadence
                </button>
              )}

              <button
                onClick={() => updateContact(contact.id, { status: 'Opted Out' })}
                className="px-3 py-1.5 rounded-lg bg-[#101323] hover:bg-[#d05a72]/20 text-[#d05a72] text-xs font-semibold flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" /> Set DNC
              </button>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#737b91] uppercase font-bold">Grade</div>
              <div className="font-bold font-mono text-[#9b8afb] text-sm">{contact.grade} ({contact.score})</div>
            </div>
          </div>
        )}

        {/* METADATA GRID */}
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-[#202641] text-xs bg-[#070811]">
          <div>
            <span className="text-[#737b91] block text-[10px] uppercase font-bold">Market</span>
            <span className="text-white font-medium">{contact.market}</span>
          </div>
          <div>
            <span className="text-[#737b91] block text-[10px] uppercase font-bold">Owner</span>
            <span className="text-white font-medium">{contact.ownerName}</span>
          </div>
          <div>
            <span className="text-[#737b91] block text-[10px] uppercase font-bold">Last Contact</span>
            <span className="text-[#a7adc0] font-mono">{contact.lastContacted}</span>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-[#202641] bg-[#0b0d18] px-4">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'timeline' ? 'border-[#7c5cfc] text-[#9b8afb]' : 'border-transparent text-[#737b91]'
            }`}
          >
            Activity Timeline
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'notes' ? 'border-[#7c5cfc] text-[#9b8afb]' : 'border-transparent text-[#737b91]'
            }`}
          >
            Agent Notes ({notesList.length})
          </button>
        </div>

        {/* TAB CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="relative pl-6 border-l-2 border-[#202641] space-y-6">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#070811] border-2 border-[#7c5cfc]" />
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                    <span className="text-[10px] text-[#737b91] font-mono">{ev.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 bg-[#101323] p-3 rounded-xl border border-[#202641]">
                    {ev.desc}
                  </p>
                  <div className="text-[9px] text-[#737b91] mt-1">Actor: {ev.actor}</div>
                </div>
              ))}
            </div>
          )}

          {/* NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {!isReadOnly && (
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={3}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Log specific realtor requirements..."
                    className="w-full p-3 bg-[#101323] border border-[#202641] rounded-xl text-xs text-white placeholder-[#737b91] focus:outline-none focus:border-[#7c5cfc]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6847e8] text-white font-bold text-xs rounded-xl"
                  >
                    Save Note To Contact
                  </button>
                </form>
              )}

              <div className="space-y-2 pt-2">
                {notesList.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#101323] border border-[#202641] text-xs text-[#f5f5f7]">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
