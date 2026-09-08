import React, { useState } from 'react';
import { RealtorContact } from '../types/crm';
import { useApp } from '../context/AppContext';
import { Phone, X, Mic, MicOff, PhoneOff, Check } from 'lucide-react';

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
    }, 2000);
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
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="luxury-card w-full max-w-md rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xl flex items-center justify-center mx-auto">
            {contact.name.substring(0, 2)}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{contact.name}</h3>
            <p className="text-xs text-slate-400">{contact.brokerage} &bull; {contact.phone}</p>
          </div>

          {callStatus === 'idle' && (
            <button
              onClick={handleStartCall}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-slate-950" /> Initiate Dialing Session
            </button>
          )}

          {callStatus === 'calling' && (
            <div className="py-4 space-y-2">
              <div className="text-amber-400 font-mono text-xs font-bold animate-pulse">Dialing {contact.phone}...</div>
            </div>
          )}

          {callStatus === 'connected' && (
            <div className="py-4 space-y-3">
              <div className="text-emerald-400 font-mono text-sm font-bold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Connected (00:42)
              </div>
              <button
                onClick={handleEndCall}
                className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <PhoneOff className="w-4 h-4" /> End Call
              </button>
            </div>
          )}

          {callStatus === 'ended' && (
            <form onSubmit={handleSaveCall} className="space-y-3 text-xs text-left pt-2">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Call Outcome</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Spoke with Agent">Spoke with Agent (Interested)</option>
                  <option value="Left Voicemail">Left Voicemail</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Wrong Number / DNC">Wrong Number / DNC</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Call Notes</label>
                <textarea
                  rows={3}
                  required
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Record summary of conversation..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400"
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
