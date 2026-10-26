import React from 'react';
import {
  CalendarDays,
  Flame,
  CheckSquare,
  User,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenSettings,
  onSignOut
}) {
  const { theme } = useTheme();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'dashboard', label: 'Heatmap & Overview', icon: CalendarDays },
    { id: 'challenges', label: 'Goal Challenges', icon: Flame },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
    { id: 'profile', label: 'Profile & Skills', icon: User }
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

          {/* Right: Settings, Sign Out & Profile Avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">
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

            {/* Profile Avatar Thumbnail */}
            <button
              onClick={() => handleTabClick('profile')}
              className={`p-0.5 rounded-full border transition-all ${
                activeTab === 'profile' ? 'border-white' : 'border-github-border hover:border-github-borderLight'
              }`}
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
