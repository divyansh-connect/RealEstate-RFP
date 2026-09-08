import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types/crm';
import { Building2, Lock, ArrowRight, UserCheck } from 'lucide-react';
import bgImage from '../assets/real_estate_luxury_bg.png';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('alex.vance@apexacquire.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
  };

  return (
    <div className="min-h-screen bg-[#070811] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Crisp High Visibility Luxury Real Estate Background Image (Reduced Blur) */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-xs scale-102 opacity-75 pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark Translucent Tint & Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070811]/50 via-[#070811]/70 to-[#070811]/90 pointer-events-none" />

      {/* Multiple Radiant Violet Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-[#7c5cfc]/35 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#9b8afb]/25 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-[#5965d8]/25 blur-[140px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#12162a]/90 backdrop-blur-md border border-[#7c5cfc]/50 mb-4 shadow-2xl shadow-[#7c5cfc]/40">
            <Building2 className="w-7 h-7 text-[#7c5cfc]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f7] drop-shadow-md">
            APEX<span className="text-[#7c5cfc] font-light">ACQUIRE</span>
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-[#a7adc0] mt-1 font-semibold drop-shadow">
            Executive Real Estate Acquisition Desk
          </p>
        </div>

        {/* Demo Role Quick Switcher with Glowing Shadow */}
        <div className="p-3.5 rounded-2xl bg-[#0b0d18]/85 backdrop-blur-xl border border-[#7c5cfc]/50 shadow-[0_0_35px_rgba(124,92,252,0.25)] space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#9b8afb] flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Select Demo Login Role
          </label>
          <div className="grid grid-cols-4 gap-1 bg-[#070811]/90 p-1 rounded-xl border border-[#202641]">
            {(['ADMIN', 'MANAGER', 'AGENT', 'READ_ONLY'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setSelectedRole(r);
                  if (r === 'ADMIN') setEmail('alex.vance@apexacquire.com');
                  if (r === 'MANAGER') setEmail('elena.r@apexacquire.com');
                  if (r === 'AGENT') setEmail('marcus.s@apexacquire.com');
                  if (r === 'READ_ONLY') setEmail('david.m@apexacquire.com');
                }}
                className={`py-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-wider ${
                  selectedRole === r
                    ? 'bg-[#7c5cfc] text-white shadow-lg shadow-[#7c5cfc]/40 font-bold'
                    : 'text-[#a7adc0] hover:text-white'
                }`}
              >
                {r.replace('_', '-')}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form with Glowing Box Shadow */}
        <div className="bg-[#0b0d18]/85 backdrop-blur-xl border border-[#7c5cfc]/50 rounded-2xl p-8 space-y-5 shadow-[0_0_50px_rgba(124,92,252,0.3)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#a7adc0] uppercase tracking-wider mb-1.5">
                Executive Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#070811] border border-[#202641] rounded-xl text-[#f5f5f7] placeholder-[#737b91] focus:outline-none focus:border-[#7c5cfc] text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#a7adc0] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#070811] border border-[#202641] rounded-xl text-[#f5f5f7] focus:outline-none focus:border-[#7c5cfc] text-xs"
                />
                <Lock className="w-4 h-4 text-[#737b91] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7c5cfc] to-[#6847e8] hover:from-[#6847e8] hover:to-[#5965d8] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#7c5cfc]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer mt-2"
            >
              Sign In To Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
