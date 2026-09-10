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
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
      <div className="w-full max-w-2xl bg-white border-l border-[#E2E8F0] h-full flex flex-col shadow-2xl relative">
        
        {/* DRAWER HEADER */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-start justify-between bg-white">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0B1F3A]">{contact.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EAF2FF] text-[#155EEF] border border-[#BFDBFE]">
                {contact.status}
              </span>
            </div>
            <p className="text-xs text-[#475569] mt-1">{contact.brokerage} &bull; <span className="font-mono text-[#64748B]">{contact.licenseNumber}</span></p>
          </div>

          <button onClick={onClose} className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg border border-[#E2E8F0] bg-[#F5F8FC]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACTIONS BAR - HIDE WRITE ACTIONS COMPLETELY FOR READ_ONLY */}
        {!isReadOnly && (
          <div className="p-4 bg-[#F5F8FC] border-b border-[#E2E8F0] flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenCallModal(contact)}
                className="px-3.5 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" /> Call Realtor
              </button>
              
              {contact.status === 'Active in Outreach' ? (
                <button
                  onClick={() => updateContact(contact.id, { status: 'Declined' })}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#EAF2FF] text-[#0F172A] text-xs font-semibold flex items-center gap-1.5"
                >
                  <Pause className="w-3.5 h-3.5 text-[#155EEF]" /> Pause Cadence
                </button>
              ) : (
                <button
                  onClick={() => updateContact(contact.id, { status: 'Active in Outreach' })}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#EAF2FF] text-[#0F172A] text-xs font-semibold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-[#16A34A]" /> Enroll Cadence
                </button>
              )}

              <button
                onClick={() => updateContact(contact.id, { status: 'Do Not Contact' })}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-rose-50 text-[#E11D48] text-xs font-semibold flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" /> Set DNC
              </button>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#64748B] uppercase font-bold">Grade</div>
              <div className="font-extrabold font-mono text-[#155EEF] text-sm">{contact.grade} ({contact.score})</div>
            </div>
          </div>
        )}

        {/* METADATA GRID */}
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-[#E2E8F0] text-xs bg-[#F5F8FC]">
          <div>
            <span className="text-[#64748B] block text-[10px] uppercase font-bold">Market</span>
            <span className="text-[#0B1F3A] font-semibold">{contact.market}</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px] uppercase font-bold">Owner</span>
            <span className="text-[#0B1F3A] font-semibold">{contact.ownerName}</span>
          </div>
          <div>
            <span className="text-[#64748B] block text-[10px] uppercase font-bold">Last Contact</span>
            <span className="text-[#475569] font-mono">{contact.lastContacted}</span>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-[#E2E8F0] bg-white px-4">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'timeline' ? 'border-[#155EEF] text-[#155EEF]' : 'border-transparent text-[#64748B]'
            }`}
          >
            Activity Timeline
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'notes' ? 'border-[#155EEF] text-[#155EEF]' : 'border-transparent text-[#64748B]'
            }`}
          >
            Agent Notes ({notesList.length})
          </button>
        </div>

        {/* TAB CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F7F9FC]">
          
          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-6">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-white border-2 border-[#155EEF]" />
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-[#0B1F3A]">{ev.title}</h4>
                    <span className="text-[10px] text-[#64748B] font-mono">{ev.time}</span>
                  </div>
                  <p className="text-xs text-[#0F172A] bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-xs">
                    {ev.desc}
                  </p>
                  <div className="text-[9px] text-[#64748B] mt-1">Actor: {ev.actor}</div>
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
                    className="w-full p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#155EEF]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 btn-executive-primary text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Save Note To Contact
                  </button>
                </form>
              )}

              <div className="space-y-2 pt-2">
                {notesList.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-[#E2E8F0] text-xs text-[#0F172A] shadow-xs">
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
