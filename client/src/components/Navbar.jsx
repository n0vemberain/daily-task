import React, { useState } from 'react';
import {
  CalendarDays,
  Flame,
  CheckSquare,
  User,
  Volume2,
  VolumeX,
  HardDriveDownload,
  Award
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

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playSuccess();
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Heatmap & Overview', icon: CalendarDays },
    { id: 'challenges', label: 'Goal Challenges', icon: Flame },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
    { id: 'profile', label: 'Profile & Skills', icon: User }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d1117]/95 backdrop-blur-md border-b border-github-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-olive-600 to-olive-800 flex items-center justify-center border border-olive-500/30 shadow-sm">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">DailyTask</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-olive-950 text-olive-300 border border-olive-700/40">
                  Olive Heatmap
                </span>
              </div>
              <p className="text-xs text-github-muted hidden sm:block">Activity Dashboard & Goal Matrix</p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#161b22] p-1 rounded-lg border border-github-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

          {/* Right: Sync Status & User Profile Chip & GitHub link */}
          <div className="flex items-center gap-3">
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
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#161b22] hover:bg-[#21262d] text-github-text border border-github-border transition-colors"
              title="View on GitHub: n0vemberain/daily-task"
            >
              <GithubIcon className="w-3.5 h-3.5 text-olive-400" />
              <span>daily-task</span>
            </a>

            {/* Profile Avatar Button */}
            <button
              onClick={() => setActiveTab('profile')}
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
              <span className="text-xs font-medium text-github-text hidden sm:inline max-w-[100px] truncate">
                {userProfile?.name || 'User'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-github-border scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-olive-800/80 text-white border border-olive-600/40'
                    : 'text-github-muted hover:text-white bg-[#161b22]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-olive-300' : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
