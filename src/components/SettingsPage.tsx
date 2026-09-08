import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Bot, Sliders, Shield, Users, Lock, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, currentUser, logAuditAction } = useApp();
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'grading' | 'users'>('ai');

  // Form local state
  const [instructions, setInstructions] = useState(settings.aiInstructions);
  const [maxReplies, setMaxReplies] = useState(settings.aiMaxConsecutiveReplies);
  const [cadenceDays, setCadenceDays] = useState(settings.cadenceIntervalDays);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isReadOnly = currentUser.role === 'READ_ONLY';
  const isAdmin = currentUser.role === 'ADMIN';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    updateSettings({
      aiInstructions: instructions,
      aiMaxConsecutiveReplies: maxReplies,
      cadenceIntervalDays: cadenceDays
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          CRM & AI Engine Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure outreach sending throttles, AI conversation fine-tuning, qualification grade weights, and user roles.
        </p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-slate-800 space-x-6">
        {[
          { id: 'ai', label: 'AI Persona & Instructions', icon: Bot },
          { id: 'general', label: 'Outreach & Throttles', icon: Sliders },
          { id: 'grading', label: 'Grading Criteria Weights', icon: Shield },
          { id: 'users', label: 'Users & Roles (RBAC)', icon: Users }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === t.id ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* FORM BODY */}
      <form onSubmit={handleSaveSettings} className="luxury-card rounded-2xl p-6 space-y-6">
        
        {/* TAB 1: AI SETTINGS */}
        {activeTab === 'ai' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-2">Global AI Persona & Instructions</label>
              <textarea
                rows={5}
                disabled={isReadOnly}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono text-xs leading-relaxed"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Defines standard response objectives, address extraction rules, and polite fallback language.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">AI Consecutive Reply Cap</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={maxReplies}
                onChange={(e) => setMaxReplies(Number(e.target.value))}
                className="w-32 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Maximum automatic AI messages before requiring human team takeover.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Cadence Re-Touch Interval (Days)</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={cadenceDays}
                onChange={(e) => setCadenceDays(Number(e.target.value))}
                className="w-32 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>
        )}

        {/* TAB 3: GRADING WEIGHTS */}
        {activeTab === 'grading' && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">Qualification Scoring Weights</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Address Captured</span>
                <strong className="text-amber-400 text-sm font-mono">{settings.gradeWeights.address}% Weight</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Price Response</span>
                <strong className="text-amber-400 text-sm font-mono">{settings.gradeWeights.price}% Weight</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: USERS & ROLES */}
        {activeTab === 'users' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Alexander Vance (Admin)</div>
                <div className="text-[10px] text-slate-400">Full System Access & Governance</div>
              </div>
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">ADMIN</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Elena Rostova (Manager)</div>
                <div className="text-[10px] text-slate-400">Team Workload & Lead Reassignment</div>
              </div>
              <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">MANAGER</span>
            </div>
          </div>
        )}

        {/* SAVE ACTION */}
        {!isReadOnly && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save System Settings
            </button>

            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Configuration Saved Successfully!
              </span>
            )}
          </div>
        )}

      </form>

    </div>
  );
};
