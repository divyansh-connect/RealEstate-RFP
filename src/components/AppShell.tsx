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
    <div className="min-h-screen bg-[#F8FBFF] text-[#0F172A] flex flex-col font-sans antialiased">

      {/* TOP HEADER */}
      <header className="h-16 border-b border-[#E2EAF5] bg-white sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 shadow-xs">

        {/* Left Branding & Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 text-[#475569] hover:text-[#0B1F3A] rounded-lg border border-[#E2EAF5] bg-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-[#EAF2FF] border border-[#BFDBFE] flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5 text-[#155EEF]" />
            </div>
            <div className="hidden sm:block">
              <div className="font-extrabold tracking-tight text-[#0B1F3A] text-base leading-none">
                APEX<span className="text-[#155EEF] font-semibold">ACQUIRE</span>
              </div>
              <div className="text-[9px] text-[#64748B] uppercase tracking-widest font-bold mt-0.5">
                Executive Acquisition Desk
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5" />
          <input
            type="text"
            placeholder="Search realtors, properties, or phone numbers..."
            className="w-full pl-10 pr-4 py-2 bg-[#F1F6FC] border border-[#E2EAF5] rounded-xl text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#155EEF] focus:bg-white transition-all shadow-xs"
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#BFDBFE] bg-[#EAF2FF] text-[#155EEF] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:bg-[#DBEAFE] shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-[#155EEF]" />
              <span>ROLE: {currentUser.role.replace('_', ' ')}</span>
            </button>

            {showRoleSelector && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E2EAF5] rounded-xl shadow-xl p-1.5 z-50">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-[#64748B] border-b border-[#E2EAF5] mb-1">
                  Switch Active Persona
                </div>
                {(['ADMIN', 'MANAGER', 'AGENT', 'READ_ONLY'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentUserRole(r);
                      setShowRoleSelector(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${currentUser.role === r ? 'bg-[#EAF2FF] text-[#155EEF] font-bold' : 'text-[#475569] hover:bg-[#F1F6FC]'
                      }`}
                  >
                    <span>{r.replace('_', ' ')}</span>
                    {currentUser.role === r && <Check className="w-3.5 h-3.5 text-[#155EEF]" />}
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
              className="p-2 rounded-xl border border-[#E2EAF5] bg-[#F1F6FC] hover:bg-[#EAF2FF] text-[#475569] transition-all relative cursor-pointer shadow-xs"
            >
              <Bell className="w-4 h-4 text-[#475569]" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#155EEF] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2EAF5] rounded-xl shadow-xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2EAF5] mb-2">
                  <h4 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] text-[#155EEF] font-mono font-bold">{unreadNotifications.length} unread</span>
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
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${n.read ? 'bg-[#F8FBFF] border-[#E2EAF5] text-[#64748B]' : 'bg-[#EAF2FF] border-[#BFDBFE] text-[#0F172A]'
                        }`}
                    >
                      <div className="font-semibold text-[#155EEF] text-[11px] mb-0.5">{n.title}</div>
                      <div className="text-[11px] leading-tight mb-1">{n.message}</div>
                      <div className="text-[9px] text-[#64748B] text-right">{n.timestamp}</div>
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
              className="flex items-center gap-2 p-1.5 rounded-xl border border-[#E2EAF5] bg-[#F1F6FC] hover:bg-[#EAF2FF] transition-all cursor-pointer shadow-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-[#EAF2FF] text-[#155EEF] font-bold text-xs flex items-center justify-center border border-[#BFDBFE]">
                {currentUser.avatar}
              </div>
              <div className="hidden lg:block text-left pr-1">
                <div className="text-xs font-semibold text-[#0F172A] leading-tight">{currentUser.name}</div>
                <div className="text-[9px] text-[#64748B]">{currentUser.title}</div>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E2EAF5] rounded-xl shadow-xl p-2 z-50">
                <div className="p-2 border-b border-[#E2EAF5] mb-1">
                  <div className="text-xs font-bold text-[#0B1F3A]">{currentUser.name}</div>
                  <div className="text-[11px] text-[#64748B]">{currentUser.email}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-[#E11D48] hover:bg-rose-50 flex items-center gap-2 font-medium transition-colors"
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
          className={`hidden lg:flex flex-col border-r border-[#E2EAF5] bg-white transition-all duration-300 relative z-20 ${collapsed ? 'w-20' : 'w-64'
            }`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-[#E2EAF5] text-[#64748B] hover:text-[#0B1F3A] flex items-center justify-center z-30 shadow-md cursor-pointer transition-transform hover:scale-110"
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
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group cursor-pointer relative ${
                    isActive
                      ? 'sidebar-item-active font-bold shadow-md shadow-[#155EEF]/25'
                      : 'text-[#475569] sidebar-item-hover'
                  }`}
                >
                  {/* Subtle Active Left Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#60A5FA] rounded-r-full shadow-sm" />
                  )}

                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#0B1F3A]'}`} />
                  {!collapsed && <span className="flex-1 text-left tracking-wide">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white backdrop-blur-xs' : 'bg-[#F1F6FC] text-[#64748B] border border-[#E2EAF5]'
                    }`}>
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
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden flex">
            <div className="w-72 bg-white border-r border-[#E2EAF5] p-4 flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#E2EAF5]">
                <div className="font-extrabold text-[#0B1F3A]">APEX <span className="text-[#155EEF]">ACQUIRE</span></div>
                <button onClick={() => setMobileDrawerOpen(false)} className="text-[#64748B]">✕</button>
              </div>
              <div className="flex-1 py-4 space-y-2">
                {visibleNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold ${
                      activeTab === item.id ? 'sidebar-item-active font-bold' : 'text-[#475569] sidebar-item-hover'
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
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};
