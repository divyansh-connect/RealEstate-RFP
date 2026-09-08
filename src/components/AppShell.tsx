import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types/crm';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Flame,
  Kanban,
  BarChart3,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  Menu,
  Shield,
  Check
} from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AppShell: React.FC<ShellProps> = ({ children, activeTab, setActiveTab }) => {
  const { currentUser, setCurrentUserRole, logout, notifications, markNotificationRead } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const headerActionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerActionsRef.current && !headerActionsRef.current.contains(event.target as Node)) {
        setShowRoleSelector(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read);

  // STRICT ROLE-BASED NAVIGATION FILTERING
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MANAGER', 'AGENT', 'READ_ONLY'] },
    { id: 'contacts', label: 'Contacts', icon: Users, roles: ['ADMIN', 'MANAGER', 'AGENT', 'READ_ONLY'] },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare, roles: ['ADMIN', 'MANAGER', 'AGENT', 'READ_ONLY'], badge: '4' },
    { id: 'leadqueue', label: 'Lead Queue', icon: Flame, roles: ['ADMIN', 'MANAGER', 'AGENT'], badge: '2' },
    { id: 'deals', label: 'Deals', icon: Kanban, roles: ['ADMIN', 'MANAGER', 'AGENT', 'READ_ONLY'], badge: '3' },
    { id: 'reports', label: 'Reports & Audit', icon: BarChart3, roles: ['ADMIN', 'MANAGER', 'READ_ONLY'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'MANAGER'] },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(currentUser.role));

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#070811] text-[#f5f5f7] flex flex-col font-sans antialiased">
      
      {/* TOP HEADER */}
      <header className="h-16 border-b border-[#202641] bg-[#0b0d18]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
        
        {/* Left Branding & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 text-[#a7adc0] hover:text-white rounded-lg border border-[#202641]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-[#12162a] border border-[#7c5cfc]/40 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-[#7c5cfc]" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold tracking-tight text-white text-base leading-none">
                APEX<span className="text-[#7c5cfc] font-light">ACQUIRE</span>
              </div>
              <div className="text-[9px] text-[#a7adc0] uppercase tracking-widest font-semibold mt-0.5">
                Executive Acquisition Desk
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
          <Search className="w-4 h-4 text-[#737b91] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search realtors, properties, or phone numbers..."
            className="w-full pl-10 pr-4 py-2 bg-[#101323] border border-[#202641] rounded-xl text-xs text-[#f5f5f7] placeholder-[#737b91] focus:outline-none focus:border-[#7c5cfc]"
          />
        </div>

        {/* Right Header Actions */}
        <div ref={headerActionsRef} className="flex items-center gap-3 relative">

          {/* Quick Role Switcher Pill */}
          <div className="relative z-50">
            <button
              onClick={() => {
                setShowRoleSelector(!showRoleSelector);
                setShowNotifications(false);
                setShowProfileMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#7c5cfc]/40 bg-[#7c5cfc]/10 text-[#9b8afb] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:bg-[#7c5cfc]/20"
            >
              <Shield className="w-3.5 h-3.5 text-[#7c5cfc]" />
              <span>ROLE: {currentUser.role.replace('_', ' ')}</span>
            </button>

            {showRoleSelector && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0b0d18] border border-[#202641] rounded-xl shadow-2xl p-1.5 z-50">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#737b91] border-b border-[#202641] mb-1">
                  Switch Active Persona
                </div>
                {(['ADMIN', 'MANAGER', 'AGENT', 'READ_ONLY'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentUserRole(r);
                      setShowRoleSelector(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentUser.role === r ? 'bg-[#7c5cfc]/15 text-[#9b8afb] font-bold' : 'text-[#a7adc0] hover:bg-[#171c33]'
                    }`}
                  >
                    <span>{r.replace('_', ' ')}</span>
                    {currentUser.role === r && <Check className="w-3.5 h-3.5 text-[#7c5cfc]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative z-50">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleSelector(false);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl border border-[#202641] bg-[#101323] hover:bg-[#171c33] text-[#a7adc0] transition-all relative cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#a7adc0]" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#7c5cfc] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0b0d18] border border-[#202641] rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#202641] mb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] text-[#9b8afb] font-mono">{unreadNotifications.length} unread</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.targetPath) setActiveTab(n.targetPath);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        n.read ? 'bg-[#070811] border-[#202641] text-[#737b91]' : 'bg-[#12162a] border-[#7c5cfc]/40 text-[#f5f5f7]'
                      }`}
                    >
                      <div className="font-semibold text-[#9b8afb] text-[11px] mb-0.5">{n.title}</div>
                      <div className="text-[11px] leading-tight mb-1">{n.message}</div>
                      <div className="text-[9px] text-[#737b91] text-right">{n.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative z-50">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowRoleSelector(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-[#202641] bg-[#101323] hover:bg-[#171c33] transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#7c5cfc]/20 text-[#9b8afb] font-bold text-xs flex items-center justify-center border border-[#7c5cfc]/30">
                {currentUser.avatar}
              </div>
              <div className="hidden lg:block text-left pr-1">
                <div className="text-xs font-semibold text-[#f5f5f7] leading-tight">{currentUser.name}</div>
                <div className="text-[9px] text-[#a7adc0]">{currentUser.title}</div>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0b0d18] border border-[#202641] rounded-xl shadow-2xl p-2 z-50">
                <div className="p-2 border-b border-[#202641] mb-1">
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-[#a7adc0]">{currentUser.email}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#d05a72] hover:bg-[#d05a72]/10 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside
          className={`hidden lg:flex flex-col border-r border-[#202641] bg-[#0b0d18]/80 backdrop-blur-md transition-all duration-300 relative z-20 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#0b0d18] border border-[#202641] text-[#a7adc0] hover:text-white flex items-center justify-center z-30 shadow-md cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#7c5cfc]/15 text-[#9b8afb] border-l-2 border-[#7c5cfc] shadow-[0_0_15px_rgba(124,92,252,0.15)]'
                      : 'text-[#a7adc0] hover:text-slate-200 hover:bg-[#171c33]/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#7c5cfc]' : 'text-[#737b91] group-hover:text-slate-200'}`} />
                  {!collapsed && <span className="flex-1 text-left tracking-wide">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#101323] text-[#a7adc0]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden flex">
            <div className="w-72 bg-[#0b0d18] border-r border-[#202641] p-4 flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b border-[#202641]">
                <div className="font-bold text-[#7c5cfc]">APEX ACQUIRE</div>
                <button onClick={() => setMobileDrawerOpen(false)} className="text-[#a7adc0]">✕</button>
              </div>
              <div className="flex-1 py-4 space-y-2">
                {visibleNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold ${
                      activeTab === item.id ? 'bg-[#7c5cfc]/20 text-[#9b8afb]' : 'text-[#a7adc0]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />
          </div>
        )}

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#070811] p-4 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};
