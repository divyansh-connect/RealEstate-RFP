import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/crm';
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
  X,
  Shield,
  User,
  Check,
  AlertCircle
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

  const unreadNotifications = notifications.filter(n => !n.read);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts CRM', icon: Users, badge: undefined },
    { id: 'conversations', label: 'Conversations', icon: MessageSquare, badge: '4' },
    { id: 'leadqueue', label: 'Lead Queue', icon: Flame, badge: '2', badgeColor: 'bg-amber-500 text-slate-950' },
    { id: 'deals', label: 'Deals Pipeline', icon: Kanban, badge: '3' },
    { id: 'reports', label: 'Reports & Audit', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileDrawerOpen(false);
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'MANAGER': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'AGENT': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'READ_ONLY': return 'bg-slate-700/40 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans antialiased">
      
      {/* TOP BAR */}
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
        
        {/* Left branding & Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg border border-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/30 flex items-center justify-center shadow-inner">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold tracking-tight text-white text-base leading-none">
                APEX<span className="text-amber-500 font-light">ACQUIRE</span>
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                Acquisitions CRM
              </div>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Search realtors, properties (e.g. Bordeaux Ave), or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>

        {/* Right Action Icons & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher Pill (Dev / Prototype Friendly) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${getRoleBadgeStyle(currentUser.role)}`}
              title="Click to toggle demo user role"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{currentUser.role.replace('_', ' ')}</span>
            </button>

            {showRoleSelector && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800 mb-1">
                  Switch Active Role
                </div>
                {(['ADMIN', 'MANAGER', 'AGENT', 'READ_ONLY'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentUserRole(r);
                      setShowRoleSelector(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      currentUser.role === r ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r.replace('_', ' ')}</span>
                    {currentUser.role === r && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] text-amber-400 font-mono">{unreadNotifications.length} unread</span>
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
                        n.read ? 'bg-slate-950/40 border-slate-800/60 text-slate-400' : 'bg-slate-800/60 border-amber-500/30 text-slate-200'
                      }`}
                    >
                      <div className="font-semibold text-amber-300 text-[11px] mb-0.5">{n.title}</div>
                      <div className="text-[11px] leading-tight mb-1">{n.message}</div>
                      <div className="text-[9px] text-slate-400 text-right">{n.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/30">
                {currentUser.avatar}
              </div>
              <div className="hidden lg:block text-left pr-1">
                <div className="text-xs font-semibold text-slate-100 leading-tight">{currentUser.name}</div>
                <div className="text-[9px] text-slate-400">{currentUser.title}</div>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                <div className="p-2 border-b border-slate-800 mb-1">
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                </div>
                <button
                  onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" /> Profile & Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-medium mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* BODY AREA */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside
          className={`hidden lg:flex flex-col border-r border-slate-800/80 bg-slate-950/60 backdrop-blur-md transition-all duration-300 relative z-20 ${
            collapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center z-30 shadow-md cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Navigation Links */}
          <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/15 to-transparent text-amber-400 border-l-2 border-amber-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  
                  {!collapsed && (
                    <span className="flex-1 text-left tracking-wide">{item.label}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Sidebar Status */}
          {!collapsed && (
            <div className="p-4 border-t border-slate-800/80 m-3 rounded-xl bg-slate-900/40">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400 font-medium">Outreach Engine</span>
                <span className="text-emerald-400 font-mono flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online
                </span>
              </div>
              <p className="text-[10px] text-slate-400">DFW Cadence Active (8 AM - 6 PM)</p>
            </div>
          )}
        </aside>

        {/* MOBILE DRAWER */}
        {mobileDrawerOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden flex">
            <div className="w-72 bg-slate-950 border-r border-slate-800 p-4 flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="font-bold text-amber-400">APEX ACQUIRE</div>
                <button onClick={() => setMobileDrawerOpen(false)} className="text-slate-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 py-4 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold ${
                      activeTab === item.id ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300'
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

        {/* MAIN CONTENT WORKSPACE */}
        <main className="flex-1 overflow-y-auto bg-[#0b0f17] p-4 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};
