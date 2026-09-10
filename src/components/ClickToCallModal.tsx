import React, { useState } from 'react';
import type { RealtorContact } from '../types/crm';
import { useApp } from '../context/AppContext';
import { Phone, X, PhoneOff } from 'lucide-react';

interface CallModalProps {
  contact: RealtorContact | null;
  onClose: () => void;
}

export const ClickToCallModal: React.FC<CallModalProps> = ({ contact, onClose }) => {
  const { logAuditAction } = useApp();
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState('Spoke with Agent');

  if (!contact) return null;

  const handleStartCall = () => {
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('connected');
    }, 1500);
  };

  const handleEndCall = () => {
    setCallStatus('ended');
  };

  const handleSaveCall = (e: React.FormEvent) => {
    e.preventDefault();
    logAuditAction(`Logged phone call (${callOutcome})`, `Contact #${contact.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="executive-panel w-full max-w-md rounded-2xl p-6 relative bg-white border border-[#E2E8F0] shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-[#64748B] hover:text-[#0F172A]">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF2FF] text-[#155EEF] border border-[#155EEF]/20 font-bold text-xl flex items-center justify-center mx-auto shadow-sm">
            {contact.name.substring(0, 2)}
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#0B1F3A]">{contact.name}</h3>
            <p className="text-xs text-[#475569]">{contact.brokerage} &bull; {contact.phone}</p>
          </div>

          {callStatus === 'idle' && (
            <button
              onClick={handleStartCall}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" /> Initiate Dialing Session
            </button>
          )}

          {callStatus === 'calling' && (
            <div className="py-4 space-y-2">
              <div className="text-[#155EEF] font-mono text-xs font-bold animate-pulse">Dialing {contact.phone}...</div>
            </div>
          )}

          {callStatus === 'connected' && (
            <div className="py-4 space-y-3">
              <div className="text-emerald-600 font-mono text-sm font-bold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Connected (00:42)
              </div>
              <button
                onClick={handleEndCall}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
              >
                <PhoneOff className="w-4 h-4" /> End Call
              </button>
            </div>
          )}

          {callStatus === 'ended' && (
            <form onSubmit={handleSaveCall} className="space-y-3 text-xs text-left pt-2">
              <div>
                <label className="block text-[#475569] font-semibold mb-1">Call Outcome</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#155EEF] shadow-sm cursor-pointer"
                >
                  <option value="Spoke with Agent">Spoke with Agent (Interested)</option>
                  <option value="Left Voicemail">Left Voicemail</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Wrong Number / DNC">Wrong Number / DNC</option>
                </select>
              </div>

              <div>
                <label className="block text-[#475569] font-semibold mb-1">Call Notes</label>
                <textarea
                  rows={3}
                  required
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#155EEF] shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 btn-executive-primary text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Save Call Summary To Timeline
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
