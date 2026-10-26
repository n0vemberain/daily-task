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
  HardDrive
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import SyncStatusBadge from './SyncStatusBadge';
import { soundEffects } from '../utils/audioFeedback';

export default function Navbar({
  activeTab,
  setActiveTab,
  userProfile,
  mongoStatus,
  isSyncing,
  lastSyncTime,
  onManualSync,
  onOpenBackup
}) {
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-olive-600 to-olive-800 flex items-center justify-center border border-olive-500/30 shadow-sm flex-shrink-0">
              <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base tracking-tight">DailyTask</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-olive-950 text-olive-300 border border-olive-700/40 hidden sm:inline-block">
                  Olive Heatmap
                </span>
              </div>
              <p className="text-[11px] text-github-muted hidden md:block">Activity Dashboard &amp; Goal Matrix</p>
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
                      ? 'bg-olive-800/80 text-white shadow-sm border border-olive-600/40'
                      : 'text-github-muted hover:text-white hover:bg-[#21262d]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-olive-300' : ''}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            <SyncStatusBadge
              mongoStatus={mongoStatus}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onManualSync={onManualSync}
            />

            {/* Sound Effects Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                isMuted
                  ? 'bg-[#161b22] border-github-border text-github-muted hover:text-white'
                  : 'bg-olive-950 border-olive-700/50 text-olive-300 hover:bg-olive-900'
              }`}
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
              <HardDriveDownload className="w-3.5 h-3.5 text-olive-400" />
            </button>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/n0vemberain/daily-task"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#161b22] hover:bg-[#21262d] text-github-text border border-github-border transition-colors"
              title="View on GitHub: n0vemberain/daily-task"
            >
              <GithubIcon className="w-3.5 h-3.5 text-olive-400" />
              <span>daily-task</span>
            </a>

            {/* Profile Avatar Button */}
            <button
              onClick={() => handleTabClick('profile')}
              className={`flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border transition-all ${
                activeTab === 'profile'
                  ? 'border-olive-500 bg-olive-950/60'
                  : 'border-github-border bg-[#161b22] hover:border-github-borderLight'
              }`}
            >
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full object-cover border border-olive-500/50"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-olive-800 text-olive-200 flex items-center justify-center text-xs font-bold border border-olive-600/40">
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
              <span className="text-xs font-medium text-github-text max-w-[100px] truncate">
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
                  ? 'bg-olive-950/80 border-olive-600/40 text-olive-300'
                  : 'bg-[#1c1d19] border-amber-600/30 text-amber-300'
              }`}
              title={
                isMongoOnline
                  ? 'Dual Persistence: MongoDB & LocalStorage Synced'
                  : 'LocalStorage Active (MongoDB Offline)'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isMongoOnline ? 'bg-olive-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-olive-400' : ''}`} />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-md border transition-colors ${
                isMuted
                  ? 'bg-[#161b22] border-github-border text-github-muted'
                  : 'bg-olive-950 border-olive-700/50 text-olive-300'
              }`}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Mobile Profile Avatar */}
            <button
              onClick={() => handleTabClick('profile')}
              className={`p-0.5 rounded-full border transition-all ${
                activeTab === 'profile' ? 'border-olive-400' : 'border-github-border'
              }`}
            >
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-olive-800 text-olive-200 flex items-center justify-center text-xs font-bold">
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
              {mobileMenuOpen ? <X className="w-5 h-5 text-olive-400" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer / Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-github-border py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-[#0d1117]">
            {/* User Profile Summary Card */}
            <div
              onClick={() => handleTabClick('profile')}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#161b22] border border-github-border cursor-pointer hover:border-olive-600/40 transition-colors"
            >
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full object-cover border border-olive-500/50"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-olive-800 text-olive-200 flex items-center justify-center text-sm font-bold border border-olive-600/40">
                  {userProfile?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-white text-sm truncate">{userProfile?.name || 'User Profile'}</div>
                <div className="text-xs text-github-muted truncate">@{userProfile?.username || 'user'} • {userProfile?.fieldOfStudy}</div>
              </div>
              <span className="text-xs text-olive-400 font-medium">Edit</span>
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
                        ? 'bg-olive-800/90 text-white border-olive-500 shadow-sm'
                        : 'bg-[#161b22] text-github-text border-github-border hover:bg-[#21262d]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-olive-200' : 'text-olive-400'}`} />
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
                    <Database className="w-4 h-4 text-olive-400" />
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
                  <RefreshCw className={`w-3 h-3 text-olive-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>

              {/* Data Backup Modal Trigger */}
              <div className="flex items-center justify-between pt-2 border-t border-github-border text-xs">
                <span className="text-github-muted">Data Portability</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBackup();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#0d1117] border border-github-border text-white hover:bg-[#21262d]"
                >
                  <HardDriveDownload className="w-3.5 h-3.5 text-olive-400" />
                  <span>Backup &amp; Restore</span>
                </button>
              </div>

              {/* GitHub Link */}
              <div className="flex items-center justify-between pt-2 border-t border-github-border text-xs">
                <span className="text-github-muted">GitHub Repository</span>
                <a
                  href="https://github.com/n0vemberain/daily-task"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-olive-400 hover:underline font-medium"
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
