import React, { useState } from 'react';
import {
  X,
  Settings,
  Palette,
  Database,
  RefreshCw,
  Volume2,
  VolumeX,
  HardDriveDownload,
  Upload,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/audioFeedback';

export default function SettingsModal({
  isOpen,
  onClose,
  mongoStatus,
  isSyncing,
  lastSyncTime,
  onManualSync,
  data,
  onRestoreData,
  onResetData,
  onClearAllData,
  onClearCompletedTasks,
  onClearChallenges,
  tasksCount = 0,
  challengesCount = 0
}) {
  const { theme, themeId, setThemeId, availableThemes } = useTheme();
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted());
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'data', 'cleaning'
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

  const showNotification = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playSuccess();
    }
  };

  const handleTestSound = () => {
    if (isMuted) {
      setIsMuted(false);
      soundEffects.setMuted(false);
    }
    soundEffects.playCelebration();
    showNotification('Audio tone played successfully.');
  };

  // Export JSON file
  const handleExport = () => {
    try {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        user: data.user,
        tasks: data.tasks,
        challenges: data.challenges
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-task-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification('Backup downloaded successfully.');
    } catch (e) {
      showNotification('Export failed: ' + e.message, 'error');
    }
  };

  // Import JSON file
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.tasks || !parsed.user) {
          throw new Error('Invalid backup file format');
        }

        onRestoreData({
          user: parsed.user,
          tasks: parsed.tasks,
          challenges: parsed.challenges || []
        });

        showNotification('Data restored successfully from backup file.');
      } catch (err) {
        showNotification('Failed to parse JSON file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  const isMongoOnline = mongoStatus?.isMongoConnected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accent
              }}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Application Settings</h3>
              <p className="text-xs text-github-muted">
                Preferences, color theme, dual sync, and data management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation inside modal */}
        <div className="flex border-b border-github-border bg-[#0d1117]/60 px-5 sm:px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'general'
                ? 'border-white text-white'
                : 'border-transparent text-github-muted hover:text-white'
            }`}
            style={{
              borderColor: activeTab === 'general' ? theme.accent : 'transparent'
            }}
          >
            Theme &amp; Preferences
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'sync'
                ? 'border-white text-white'
                : 'border-transparent text-github-muted hover:text-white'
            }`}
            style={{
              borderColor: activeTab === 'sync' ? theme.accent : 'transparent'
            }}
          >
            Sync &amp; Backup
          </button>
          <button
            onClick={() => setActiveTab('cleaning')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'cleaning'
                ? 'border-red-500 text-red-300'
                : 'border-transparent text-github-muted hover:text-red-400'
            }`}
          >
            Data Clean Center
          </button>
        </div>

        {/* Status notification toast */}
        {statusMessage && (
          <div
            className={`mx-5 sm:mx-6 mt-4 p-3 rounded-lg border text-xs flex items-center gap-2 ${
              statusMessage.type === 'error'
                ? 'bg-red-950/70 border-red-700/60 text-red-300'
                : 'bg-[#0d1117] border-white/20 text-white'
            }`}
            style={
              statusMessage.type !== 'error'
                ? {
                    backgroundColor: theme.accentDark,
                    borderColor: theme.accent + '50',
                    color: theme.accentLight
                  }
                : {}
            }
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* TAB 1: General (Theme & Sound) */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" style={{ color: theme.accent }} />
                    <span className="font-bold text-white text-sm">Application Color Theme</span>
                  </div>
                  <span
                    className="text-[11px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: theme.accentDark,
                      borderColor: theme.accent + '40',
                      color: theme.accentLight
                    }}
                  >
                    Active: {theme.name}
                  </span>
                </div>
                <p className="text-github-muted text-xs">
                  Select a color palette. Changes take effect across the entire application, heatmap, navigation, and badges instantly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {Object.values(availableThemes).map((t) => {
                    const isSelected = t.id === themeId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setThemeId(t.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#21262d] border-white text-white shadow-md'
                            : 'bg-[#0d1117] border-github-border text-github-text hover:bg-[#161b22] hover:border-github-borderLight'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                            style={{ backgroundColor: t.accent }}
                          />
                          <div>
                            <div className="font-semibold text-xs text-white">{t.name}</div>
                            <div className="text-[10px] text-github-muted">
                              {t.id === 'olive' ? 'GitHub Original' : `${t.name.split(' ')[0]} Accent`}
                            </div>
                          </div>
                        </div>

                        {/* Color level swatches */}
                        <div className="flex gap-1">
                          {t.hexLevels.slice(1).map((hex, i) => (
                            <span
                              key={i}
                              className="w-2 h-4 rounded-[2px]"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound Effects Controls */}
              <div className="pt-4 border-t border-github-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-github-muted" />
                    ) : (
                      <Volume2 className="w-4 h-4" style={{ color: theme.accent }} />
                    )}
                    <span className="font-bold text-white text-sm">Audio Feedback</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isMuted
                        ? 'bg-[#21262d] border-github-border text-github-muted hover:text-white'
                        : 'text-white border-white/30'
                    }`}
                    style={
                      !isMuted
                        ? {
                            backgroundColor: theme.accentDark,
                            borderColor: theme.accent + '50',
                            color: theme.accentLight
                          }
                        : {}
                    }
                  >
                    {isMuted ? 'Sound Disabled' : 'Sound Enabled'}
                  </button>
                </div>
                <p className="text-github-muted text-xs">
                  Plays harmonic chimes synthesized using the browser Web Audio API upon completing tasks or challenge milestones.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleTestSound}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0d1117] hover:bg-[#21262d] text-white border border-github-border transition-colors flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    <span>Play Test Tone</span>
                  </button>
                </div>
              </div>

              {/* App Info & GitHub Repository */}
              <div className="pt-4 border-t border-github-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-github-muted">Application Repository</span>
                  <a
                    href="https://github.com/n0vemberain/daily-task"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 font-medium hover:underline"
                    style={{ color: theme.accentLight }}
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>n0vemberain/daily-task</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
                <div className="text-[11px] text-github-muted">
                  Version 1.2.0 • React 18, Vite, Tailwind CSS, Express, MongoDB
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Sync & Data Portability */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              {/* Persistence & Database Sync */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" style={{ color: theme.accent }} />
                    <span className="font-bold text-white text-sm">Dual Persistence &amp; Sync</span>
                  </div>
                  <button
                    type="button"
                    onClick={onManualSync}
                    disabled={isSyncing}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${theme.primaryBtn} transition-all disabled:opacity-50`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0d1117] border border-github-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-github-muted">Database State:</span>
                    <span className="flex items-center gap-1.5 font-mono text-white">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isMongoOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      <span>{isMongoOnline ? 'MongoDB & LocalStorage Synced' : 'LocalStorage Active'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-github-muted pt-1 border-t border-github-border">
                    <span>Last Synchronization:</span>
                    <span className="font-mono">
                      {lastSyncTime
                        ? new Date(lastSyncTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Export (Download JSON) */}
              <div className="pt-4 border-t border-github-border space-y-3">
                <div className="font-bold text-white text-sm">Download Backup (JSON)</div>
                <div className="p-3.5 rounded-xl bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">Export Full Account Archive</div>
                    <div className="text-[11px] text-github-muted mt-0.5">
                      Saves all tasks, challenge records, heatmap activity, and user profile to a JSON file.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleExport}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold ${theme.primaryBtn} shadow-sm transition-all whitespace-nowrap`}
                  >
                    <HardDriveDownload className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>

              {/* Data Import (Restore JSON) */}
              <div className="space-y-3">
                <div className="font-bold text-white text-sm">Restore from Backup</div>
                <div className="p-3.5 rounded-xl bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">Upload Backup JSON</div>
                    <div className="text-[11px] text-github-muted mt-0.5">
                      Restores dashboard data from a previously downloaded backup.
                    </div>
                  </div>
                  <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border cursor-pointer transition-colors whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Data Clean Center */}
          {activeTab === 'cleaning' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span className="font-bold text-white text-sm">Data Cleaning &amp; Reset Management</span>
              </div>
              <p className="text-github-muted text-xs">
                Selectively clear completed tasks, reset challenges, restore sample data, or wipe database.
              </p>

              {/* Option 1: Clean Completed Tasks Only */}
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">Clean Completed Tasks Only</div>
                  <div className="text-[11px] text-github-muted mt-0.5">
                    Remove all finished tasks while preserving pending tasks and challenges.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClearCompletedTasks();
                    showNotification('Completed tasks cleared successfully.');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors whitespace-nowrap"
                >
                  Clear Completed
                </button>
              </div>

              {/* Option 2: Clean All Challenges */}
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">Clean All Habit Challenges</div>
                  <div className="text-[11px] text-github-muted mt-0.5">
                    Remove all active and completed challenges ({challengesCount} total).
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClearChallenges();
                    showNotification('All habit challenges cleared.');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors whitespace-nowrap"
                >
                  Clear Challenges
                </button>
              </div>

              {/* Option 3: Restore Default Demo Data */}
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">Restore Standard Demo Data</div>
                  <div className="text-[11px] text-github-muted mt-0.5">
                    Reloads initial demonstration tasks, habit challenges, and multi-month heatmap records.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetData();
                    showNotification('Default sample demo data restored.');
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors whitespace-nowrap"
                >
                  Restore Demo
                </button>
              </div>

              {/* Option 4: Full Factory Reset */}
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-red-300">Factory Reset: Clear All Data</div>
                    <div className="text-[11px] text-github-muted mt-0.5">
                      Permanently wipes all tasks ({tasksCount}), challenges ({challengesCount}), and heatmap activity.
                    </div>
                  </div>
                  {!confirmDeleteAll && (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteAll(true)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-950 hover:bg-red-900 text-red-200 border border-red-800/50 transition-colors whitespace-nowrap"
                    >
                      Wipe Everything
                    </button>
                  )}
                </div>

                {confirmDeleteAll && (
                  <div className="pt-2 border-t border-red-900/40 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-red-400 font-medium">
                      Are you certain? This cannot be undone.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteAll(false)}
                        className="px-2.5 py-1 text-xs text-github-muted hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onClearAllData();
                          setConfirmDeleteAll(false);
                          showNotification('All application data cleared.');
                        }}
                        className="px-3 py-1 rounded-md text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow transition-colors"
                      >
                        Confirm Wipe
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0d1117] border-t border-github-border flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#21262d] hover:bg-[#30363d] rounded-xl border border-github-border transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}
