import React, { useState } from 'react';
import {
  CalendarDays,
  Flame,
  CheckSquare,
  User,
  Settings,
  LogOut,
  Sparkles,
  Timer,
  LayoutGrid
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenSettings,
  onOpenProfile,
  onSignOut
}) {
  const { theme } = useTheme();
  const [showWidgetsMenu, setShowWidgetsMenu] = useState(false);

  const openWidget = (type) => {
    if (window.electronAPI?.openWidget) {
      window.electronAPI.openWidget(type);
    } else {
      window.open(`?widget=${type}`, `widget_${type}`, 'width=660,height=300');
    }
    setShowWidgetsMenu(false);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'dashboard', label: 'Heatmap & Overview', icon: CalendarDays },
    { id: 'challenges', label: 'Goal Challenges', icon: Flame },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
    { id: 'timer', label: 'Focus Timer', icon: Timer }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d1117]/95 backdrop-blur-md border-b border-github-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Left: Brand Logo & Title */}
          <div
            onClick={() => handleTabClick('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none flex-shrink-0"
          >
            <div
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center border shadow-sm`}
              style={{ borderColor: theme.accent + '50' }}
            >
              <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                  DailyTask
                </span>
                <span
                  className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border hidden sm:inline-block"
                  style={{
                    backgroundColor: theme.accentDark,
                    borderColor: theme.accent + '40',
                    color: theme.accentLight
                  }}
                >
                  {theme.name}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Main Navigation Tabs (Heatmap, Challenges, Tasks, Profile) */}
          <nav className="hidden md:flex items-center justify-center flex-1 px-2">
            <div className="flex items-center gap-1 bg-[#161b22] p-1 rounded-xl border border-github-border shadow-sm">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? `${theme.activeTab} text-white shadow-sm`
                        : 'text-github-muted hover:text-white hover:bg-[#21262d]'
                    }`}
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      style={{ color: isActive ? theme.accentLight : undefined }}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right: Widgets, Settings, Sign Out & Profile Avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop Widgets Menu Button */}
            <div className="relative">
              <button
                onClick={() => setShowWidgetsMenu(!showWidgetsMenu)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-github-border bg-[#161b22] hover:bg-[#21262d] text-xs font-semibold text-white transition-colors shadow-sm"
                title="Open macOS Desktop Widgets"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-lime-400" />
                <span className="hidden sm:inline">Widgets</span>
              </button>

              {showWidgetsMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#161b22]/95 border border-white/15 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in space-y-1">
                  <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider px-2 py-1 border-b border-white/10">
                    macOS Desktop Widgets
                  </div>
                  <button
                    onClick={() => openWidget('heatmap')}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-xs text-white text-left transition-colors"
                  >
                    <span className="font-semibold">Heatmap Widget</span>
                    <span className="text-[10px] text-white/40 font-mono">6 Months</span>
                  </button>
                  <button
                    onClick={() => openWidget('challenges')}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-xs text-white text-left transition-colors"
                  >
                    <span className="font-semibold">Goal Challenges</span>
                    <span className="text-[10px] text-white/40 font-mono">Square</span>
                  </button>
                  <button
                    onClick={() => openWidget('daily-tasks')}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-xs text-white text-left transition-colors"
                  >
                    <span className="font-semibold">Daily Tasks</span>
                    <span className="text-[10px] text-white/40 font-mono">Today</span>
                  </button>
                </div>
              )}
            </div>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-github-border bg-[#161b22] hover:bg-[#21262d] text-xs font-semibold text-white transition-colors shadow-sm"
              title="Open Settings (Theme, Sync, Audio, Backup, Data Cleaning)"
            >
              <Settings className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span className="hidden sm:inline">Settings</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-red-900/40 bg-[#161b22] hover:bg-red-950/40 text-xs font-semibold text-red-300 transition-colors shadow-sm"
              title="Sign Out of Dashboard"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            {/* Profile Avatar Thumbnail Button (Opens Profile Credentials Modal) */}
            <button
              onClick={onOpenProfile}
              className="p-0.5 rounded-full border border-github-border hover:border-white transition-all hover:scale-105"
              title={`View Profile: ${userProfile?.name || 'User'}`}
            >
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full object-cover border"
                  style={{ borderColor: theme.accent }}
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border"
                  style={{
                    backgroundColor: theme.accentDark,
                    color: theme.accentLight,
                    borderColor: theme.accent + '50'
                  }}
                >
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
