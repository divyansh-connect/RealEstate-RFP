import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RealtorContact } from '../types/crm';
import {
  X,
  Mail,
  Phone,
  Building,
  UserCheck,
  Ban,
  Play,
  Pause,
  Send,
  MessageSquare,
  Clock,
  Shield,
  FileText,
  Plus
} from 'lucide-react';

interface ContactDrawerProps {
  contact: RealtorContact | null;
  onClose: () => void;
  onOpenCallModal: (contact: RealtorContact) => void;
}

export const ContactDetailDrawer: React.FC<ContactDrawerProps> = ({ contact, onClose, onOpenCallModal }) => {
  const { updateContact, currentUser, logAuditAction } = useApp();
  const [activeTab, setActiveTab] = useState<'timeline' | 'notes'>('timeline');
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>([
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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl relative">
        
        {/* DRAWER HEADER */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{contact.name}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                contact.status === 'Engaged' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {contact.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{contact.brokerage} &bull; <span className="font-mono text-slate-300">{contact.licenseNumber}</span></p>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ACTIONS BAR */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenCallModal(contact)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Phone className="w-3.5 h-3.5" /> Call Realtor
            </button>
            
            {!isReadOnly && (
              <>
                {contact.status === 'Enrolled' ? (
                  <button
                    onClick={() => updateContact(contact.id, { status: 'New' })}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Pause className="w-3.5 h-3.5 text-amber-400" /> Pause Cadence
                  </button>
                ) : (
                  <button
                    onClick={() => updateContact(contact.id, { status: 'Enrolled' })}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" /> Enroll Cadence
                  </button>
                )}

                <button
                  onClick={() => updateContact(contact.id, { status: 'Opted Out' })}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Ban className="w-3.5 h-3.5" /> Set DNC
                </button>
              </>
            )}
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Grade</div>
            <div className="font-bold font-mono text-emerald-400 text-sm">{contact.grade} ({contact.score})</div>
          </div>
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-3 gap-3 p-4 border-b border-slate-800 text-xs bg-slate-950">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Market</span>
            <span className="text-white font-medium">{contact.market}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Owner</span>
            <span className="text-white font-medium">{contact.ownerName}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Contact</span>
            <span className="text-slate-300 font-mono">{contact.lastContacted}</span>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-4">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'timeline' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            Activity Timeline
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'notes' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400'
            }`}
          >
            Agent Notes ({notesList.length})
          </button>
        </div>

        {/* TAB CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-500" />
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{ev.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    {ev.desc}
                  </p>
                  <div className="text-[9px] text-slate-400 mt-1">Actor: {ev.actor}</div>
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
                    placeholder="Log specific realtor requirements, seller motivations, or call notes..."
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400"
                  >
                    Save Note To Contact
                  </button>
                </form>
              )}

              <div className="space-y-2 pt-2">
                {notesList.map((note, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
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
