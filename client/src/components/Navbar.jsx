import React, { useState } from 'react';
import {
  CalendarDays,
  Flame,
  CheckSquare,
  User,
  Volume2,
  VolumeX,
  HardDriveDownload,
  Menu,
  X,
  ExternalLink,
  RefreshCw,
  Database,
  HardDrive,
  Palette,
  LogIn,
  LogOut,
  Trash2,
  Lock,
  ChevronDown
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import SyncStatusBadge from './SyncStatusBadge';
import { soundEffects } from '../utils/audioFeedback';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({
  activeTab,
  setActiveTab,
  userProfile,
  mongoStatus,
  isSyncing,
  lastSyncTime,
  onManualSync,
  onOpenBackup,
  onOpenClean,
  isAuthenticated = true,
  onOpenLogin,
  onSignOut
}) {
  const { theme, themeId, setThemeId, availableThemes } = useTheme();
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playSuccess();
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setThemeDropdownOpen(false);
  };

  const tabs = [
    { id: 'dashboard', label: 'Heatmap & Overview', icon: CalendarDays },
    { id: 'challenges', label: 'Goal Challenges', icon: Flame },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
    { id: 'profile', label: 'Profile & Skills', icon: User }
  ];

  const isMongoOnline = mongoStatus?.isMongoConnected;

  return (
    <header className="sticky top-0 z-40 bg-[#0d1117]/95 backdrop-blur-md border-b border-github-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          {/* Brand Logo & Title */}
          <div
            onClick={() => handleTabClick('dashboard')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none"
          >
            <div
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center border shadow-sm flex-shrink-0`}
              style={{ borderColor: theme.accent + '50' }}
            >
              <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base tracking-tight">DailyTask</span>
                <span
                  className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border hidden sm:inline-block"
                  style={{
                    backgroundColor: theme.accentDark,
                    borderColor: theme.accent + '40',
                    color: theme.accentLight
                  }}
                >
                  {theme.name}
                </span>
              </div>
              <p className="text-[11px] text-github-muted hidden md:block">Activity Dashboard &amp; Habit Tracker</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#161b22] p-1 rounded-lg border border-github-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? `${theme.activeTab} shadow-sm font-semibold`
                      : 'text-github-muted hover:text-white hover:bg-[#21262d]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: isActive ? theme.accentLight : undefined }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-2">
            <SyncStatusBadge
              mongoStatus={mongoStatus}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onManualSync={onManualSync}
            />

            {/* Global Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-github-border bg-[#161b22] hover:bg-[#21262d] text-xs text-white transition-colors"
                title="Select Application Color Theme"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
                <span className="text-[11px] font-medium hidden lg:inline">{theme.name}</span>
                <ChevronDown className="w-3 h-3 text-github-muted" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#161b22] border border-github-border rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-github-muted border-b border-github-border">
                    App Color Themes
                  </div>
                  {Object.values(availableThemes).map((t) => {
                    const isSelected = t.id === themeId;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setThemeId(t.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#21262d] text-white font-semibold'
                            : 'text-github-muted hover:text-white hover:bg-[#21262d]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-white/20"
                            style={{ backgroundColor: t.accent }}
                          />
                          <span>{t.name}</span>
                        </div>
                        {isSelected && (
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: t.accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sound Effects Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                isMuted
                  ? 'bg-[#161b22] border-github-border text-github-muted hover:text-white'
                  : 'bg-[#161b22] border-github-border text-white hover:bg-[#21262d]'
              }`}
              style={{
                color: !isMuted ? theme.accent : undefined
              }}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Backup & Portability Button */}
            <button
              onClick={onOpenBackup}
              className="p-1.5 rounded-md border border-github-border bg-[#161b22] hover:bg-[#21262d] text-github-text transition-colors"
              title="Backup & Restore Data (JSON)"
            >
              <HardDriveDownload className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            </button>

            {/* Data Clean Modal Trigger */}
            <button
              onClick={onOpenClean}
              className="p-1.5 rounded-md border border-github-border bg-[#161b22] hover:bg-red-950/30 text-github-muted hover:text-red-400 transition-colors"
              title="Clean & Reset Data"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/n0vemberain/daily-task"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#161b22] hover:bg-[#21262d] text-github-text border border-github-border transition-colors"
              title="View on GitHub: n0vemberain/daily-task"
            >
              <GithubIcon className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span className="hidden xl:inline">daily-task</span>
            </a>

            {/* Auth / Login Button */}
            {isAuthenticated ? (
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-md border border-github-border bg-[#161b22] hover:bg-[#21262d] text-github-muted hover:text-white transition-colors"
                title="Sign Out / Lock Session"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${theme.primaryBtn} transition-all`}
                title="Sign In"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            )}

            {/* Profile Avatar Button */}
            <button
              onClick={() => handleTabClick('profile')}
              className={`flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border transition-all ${
                activeTab === 'profile'
                  ? 'border-github-borderLight bg-[#21262d]'
                  : 'border-github-border bg-[#161b22] hover:border-github-borderLight'
              }`}
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
                    borderColor: theme.accent + '60'
                  }}
                >
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-xs font-medium text-github-text max-w-[80px] truncate">
                {userProfile?.name || 'User'}
              </span>
            </button>
          </div>

          {/* Mobile Right Controls (< md) */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Mobile Compact Sync Pill */}
            <button
              onClick={onManualSync}
              disabled={isSyncing}
              className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[11px] font-mono transition-all ${
                isMongoOnline
                  ? 'bg-[#161b22] border-github-border text-white'
                  : 'bg-[#1c1d19] border-amber-600/30 text-amber-300'
              }`}
              title={
                isMongoOnline
                  ? 'Dual Persistence: MongoDB & LocalStorage Synced'
                  : 'LocalStorage Active (MongoDB Offline)'
              }
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: isMongoOnline ? theme.accent : '#f59e0b' }}
              />
              <RefreshCw
                className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`}
                style={{ color: isMongoOnline ? theme.accent : undefined }}
              />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-1.5 rounded-md border border-github-border bg-[#161b22] text-github-muted"
              style={{ color: !isMuted ? theme.accent : undefined }}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Mobile Profile Avatar */}
            <button
              onClick={() => handleTabClick('profile')}
              className={`p-0.5 rounded-full border transition-all ${
                activeTab === 'profile' ? 'border-white' : 'border-github-border'
              }`}
            >
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: theme.accentDark,
                    color: theme.accentLight
                  }}
                >
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md border border-github-border bg-[#161b22] text-white hover:bg-[#21262d] transition-colors"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" style={{ color: theme.accent }} /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer / Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-github-border py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-[#0d1117]">
            {/* User Profile Summary Card */}
            <div
              onClick={() => handleTabClick('profile')}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#161b22] border border-github-border cursor-pointer hover:border-github-borderLight transition-colors"
            >
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full object-cover border"
                  style={{ borderColor: theme.accent }}
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border"
                  style={{
                    backgroundColor: theme.accentDark,
                    color: theme.accentLight,
                    borderColor: theme.accent + '40'
                  }}
                >
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white text-sm truncate">{userProfile?.name || 'User Profile'}</div>
                <div className="text-xs text-github-muted truncate">
                  @{userProfile?.username || 'user'} • {userProfile?.fieldOfStudy}
                </div>
              </div>
              <span className="text-xs font-medium" style={{ color: theme.accent }}>
                Edit
              </span>
            </div>

            {/* Mobile Color Theme Picker */}
            <div className="p-3 rounded-xl bg-[#161b22] border border-github-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <Palette className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                  <span>Color Theme</span>
                </div>
                <span className="text-[11px] text-github-muted">{theme.name}</span>
              </div>
              <div className="grid grid-cols-5 gap-2 pt-1">
                {Object.values(availableThemes).map((t) => {
                  const isSelected = t.id === themeId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[10px] font-medium transition-all ${
                        isSelected
                          ? 'border-white bg-[#21262d] text-white shadow-sm'
                          : 'border-github-border bg-[#0d1117] text-github-muted hover:text-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: t.accent }}
                      />
                      <span className="truncate w-full text-center">{t.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs List */}
            <div className="grid grid-cols-2 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                      isActive
                        ? `${theme.activeTab} text-white shadow-sm font-bold`
                        : 'bg-[#161b22] text-github-text border-github-border hover:bg-[#21262d]'
                    }`}
                  >
                    <Icon className="w-4 h-4" style={{ color: isActive ? theme.accentLight : theme.accent }} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions & Utilities */}
            <div className="p-3 rounded-xl bg-[#161b22] border border-github-border space-y-3">
              {/* Detailed Sync Status Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {isMongoOnline ? (
                    <Database className="w-4 h-4" style={{ color: theme.accent }} />
                  ) : (
                    <HardDrive className="w-4 h-4 text-amber-400" />
                  )}
                  <span className="text-github-text">
                    {isMongoOnline ? 'MongoDB & LocalStorage Synced' : 'LocalStorage Active'}
                  </span>
                </div>
                <button
                  onClick={onManualSync}
                  disabled={isSyncing}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#0d1117] border border-github-border text-white hover:bg-[#21262d]"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`}
                    style={{ color: theme.accent }}
                  />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>

              {/* Data Cleaning & Portability Row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-github-border">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBackup();
                  }}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium bg-[#0d1117] border border-github-border text-white hover:bg-[#21262d]"
                >
                  <HardDriveDownload className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                  <span>Backup / Restore</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenClean();
                  }}
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium bg-[#0d1117] border border-red-900/40 text-red-300 hover:bg-red-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clean Data</span>
                </button>
              </div>

              {/* Auth Row */}
              <div className="pt-2 border-t border-github-border flex items-center justify-between text-xs">
                <span className="text-github-muted">
                  {isAuthenticated ? `Logged in as @${userProfile?.username || 'user'}` : 'Guest Session'}
                </span>
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="flex items-center gap-1 text-xs text-red-400 hover:underline"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="flex items-center gap-1 text-xs text-white font-semibold"
                    style={{ color: theme.accent }}
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

              {/* GitHub Link */}
              <div className="flex items-center justify-between pt-2 border-t border-github-border text-xs">
                <span className="text-github-muted">GitHub Repository</span>
                <a
                  href="https://github.com/n0vemberain/daily-task"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:underline font-medium"
                  style={{ color: theme.accent }}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>n0vemberain/daily-task</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
