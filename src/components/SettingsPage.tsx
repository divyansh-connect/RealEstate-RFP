import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types/crm';
import { Save, Bot, Sliders, Shield, Users, Check, UserPlus, X } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, users, addUser, toggleUserStatus, currentUser } = useApp();
  
  const isAdmin = currentUser.role === 'ADMIN';
  const isManager = currentUser.role === 'MANAGER';

  // STRICT TAB FILTERING FOR SETTINGS:
  // Admin sees: AI, Outreach, Grading, Pipeline, Templates, Users & Roles, Integrations
  // Manager sees ONLY: AI, Outreach, Grading, Pipeline, Templates
  const allTabs = [
    { id: 'ai', label: 'AI Persona & Rules', icon: Bot, roles: ['ADMIN', 'MANAGER'] },
    { id: 'general', label: 'Outreach & Throttles', icon: Sliders, roles: ['ADMIN', 'MANAGER'] },
    { id: 'grading', label: 'Grading Weights', icon: Shield, roles: ['ADMIN', 'MANAGER'] },
    { id: 'users', label: 'Users & Roles (RBAC)', icon: Users, roles: ['ADMIN'] },
    { id: 'integrations', label: 'Integrations & Gateways', icon: Sliders, roles: ['ADMIN'] }
  ];

  const visibleTabs = allTabs.filter(t => t.roles.includes(currentUser.role));
  const [activeTab, setActiveTab] = useState<string>('ai');

  // Form local state
  const [instructions, setInstructions] = useState(settings.aiInstructions);
  const [maxReplies, setMaxReplies] = useState(settings.aiMaxConsecutiveReplies);
  const [cadenceDays, setCadenceDays] = useState(settings.cadenceIntervalDays);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // User Management Modal State (Admin Only)
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('AGENT');
  const [newUserTitle, setNewUserTitle] = useState('Acquisition Agent');

  const safeActiveTab = visibleTabs.some(t => t.id === activeTab) ? activeTab : 'ai';

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      aiInstructions: instructions,
      aiMaxConsecutiveReplies: maxReplies,
      cadenceIntervalDays: cadenceDays
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      avatar: newUserName.substring(0, 2).toUpperCase(),
      title: newUserTitle,
      status: 'Active'
    });
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          CRM & AI Engine Settings
        </h1>
        <p className="text-xs text-[#a7adc0] mt-1">
          Configure outreach sending throttles, AI conversation fine-tuning, qualification grade weights, and user RBAC.
        </p>
      </div>

      {/* TAB NAVIGATION - RESTRICTED BASED ON ROLE */}
      <div className="flex border-b border-[#202641] space-x-6 overflow-x-auto">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              safeActiveTab === t.id ? 'border-[#7c5cfc] text-[#9b8afb]' : 'border-transparent text-[#737b91] hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* TAB: INTEGRATIONS VIEW (ADMIN ONLY - MANAGER CANNOT SEE THIS TAB AT ALL) */}
      {safeActiveTab === 'integrations' && isAdmin && (
        <div className="executive-panel rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider">Gateway Credentials</h3>
          <div className="space-y-3">
            <div className="p-3 bg-[#070811] rounded-xl border border-[#202641] flex justify-between items-center">
              <span>SMS Gateway (Twilio):</span>
              <span className="font-mono text-[#35b77a] font-bold">Connected (AC7482910••••3819)</span>
            </div>
            <div className="p-3 bg-[#070811] rounded-xl border border-[#202641] flex justify-between items-center">
              <span>Email Gateway (Microsoft 365):</span>
              <span className="font-mono text-[#35b77a] font-bold">Connected (ms_live_••••9901)</span>
            </div>
            <div className="p-3 bg-[#070811] rounded-xl border border-[#202641] flex justify-between items-center">
              <span>AI Engine (OpenAI GPT-4o):</span>
              <span className="font-mono text-[#35b77a] font-bold">Connected (sk-proj-••••4812)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB: USER MANAGEMENT (ADMIN ONLY - MANAGER CANNOT SEE THIS TAB AT ALL) */}
      {safeActiveTab === 'users' && isAdmin && (
        <div className="executive-panel rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#202641]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active System Users ({users.length})</h3>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-1.5 bg-[#7c5cfc] text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add User
            </button>
          </div>

          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="p-3.5 rounded-xl bg-[#070811] border border-[#202641] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {u.name}
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#101323] text-[#9b8afb] border border-[#202641]">
                      {u.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#a7adc0]">{u.email} &bull; {u.title}</div>
                </div>

                {u.id !== currentUser.id && (
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                      u.status === 'Active' ? 'bg-[#101323] text-[#d05a72] hover:bg-[#d05a72]/20' : 'bg-[#35b77a]/20 text-[#35b77a]'
                    }`}
                  >
                    {u.status === 'Active' ? 'Deactivate User' : 'Reactivate User'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FORM BODY FOR COMMON SETTINGS (AI, OUTREACH, GRADING) */}
      {(safeActiveTab === 'ai' || safeActiveTab === 'general' || safeActiveTab === 'grading') && (
        <form onSubmit={handleSaveSettings} className="executive-panel rounded-2xl p-6 space-y-6">
          
          {safeActiveTab === 'ai' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a7adc0] font-bold mb-2">Global AI Persona Instructions</label>
                <textarea
                  rows={5}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full p-3.5 bg-[#070811] border border-[#202641] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>

              <div>
                <label className="block text-[#a7adc0] font-bold mb-1">AI Consecutive Reply Cap</label>
                <input
                  type="number"
                  value={maxReplies}
                  onChange={(e) => setMaxReplies(Number(e.target.value))}
                  className="w-32 p-2.5 bg-[#070811] border border-[#202641] rounded-xl text-white font-mono focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>
            </div>
          )}

          {safeActiveTab === 'general' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#a7adc0] font-bold mb-1">Cadence Re-Touch Interval (Days)</label>
                <input
                  type="number"
                  value={cadenceDays}
                  onChange={(e) => setCadenceDays(Number(e.target.value))}
                  className="w-32 p-2.5 bg-[#070811] border border-[#202641] rounded-xl text-white font-mono focus:outline-none focus:border-[#7c5cfc]"
                />
              </div>
            </div>
          )}

          {safeActiveTab === 'grading' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider mb-2">Qualification Scoring Weights</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#070811] rounded-xl border border-[#202641]">
                  <span className="text-[#737b91] block text-[10px]">Address Captured</span>
                  <strong className="text-[#9b8afb] text-sm font-mono">{settings.gradeWeights.address}% Weight</strong>
                </div>
                <div className="p-3 bg-[#070811] rounded-xl border border-[#202641]">
                  <span className="text-[#737b91] block text-[10px]">Price Response</span>
                  <strong className="text-[#9b8afb] text-sm font-mono">{settings.gradeWeights.price}% Weight</strong>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#202641] flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-3 bg-[#7c5cfc] hover:bg-[#6847e8] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7c5cfc]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save System Settings
            </button>

            {savedSuccess && (
              <span className="text-xs text-[#35b77a] font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Configuration Saved!
              </span>
            )}
          </div>

        </form>
      )}

      {/* ADD USER MODAL (ADMIN ONLY) */}
      {showAddUserModal && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="executive-panel w-full max-w-md rounded-2xl p-6 relative space-y-4">
            <button onClick={() => setShowAddUserModal(false)} className="absolute top-5 right-5 text-[#737b91] hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white">Add System User</h3>
            
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a7adc0] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full p-2.5 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a7adc0] font-semibold mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full p-2.5 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#a7adc0] font-semibold mb-1">Role Assignment</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-[#070811] border border-[#202641] rounded-xl text-white focus:outline-none"
                >
                  <option value="ADMIN">ADMIN (Full Access)</option>
                  <option value="MANAGER">MANAGER (Team Workload)</option>
                  <option value="AGENT">AGENT (Assigned Work)</option>
                  <option value="READ_ONLY">READ_ONLY (View Only)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7c5cfc] text-white font-bold rounded-xl mt-3"
              >
                Create User & Assign Role
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
