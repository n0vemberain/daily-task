import React, { useState } from 'react';
import {
  X,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DataCleanModal({
  isOpen,
  onClose,
  onClearAllData,
  onClearCompletedTasks,
  onClearChallenges,
  onResetDemoData,
  tasksCount = 0,
  challengesCount = 0,
  userProfile
}) {
  const { theme } = useTheme();
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [notification, setNotification] = useState('');

  if (!isOpen) return null;

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification('');
      onClose();
    }, 1800);
  };

  const verifyPassword = () => {
    const expected = userProfile?.password || 'Password123!';
    if (!authPassword.trim()) {
      setAuthError('Account password is required to authorize data cleaning.');
      return false;
    }
    if (authPassword !== expected) {
      setAuthError('Incorrect password! Data cleaning was blocked.');
      return false;
    }
    setAuthError('');
    return true;
  };

  const handleClearAll = () => {
    if (!verifyPassword()) return;
    onClearAllData();
    showNotification('All application data cleared successfully.');
    setConfirmDeleteAll(false);
    setAuthPassword('');
  };

  const handleClearCompleted = () => {
    if (!verifyPassword()) return;
    onClearCompletedTasks();
    showNotification('Completed tasks cleared.');
    setAuthPassword('');
  };

  const handleClearChallenges = () => {
    if (!verifyPassword()) return;
    onClearChallenges();
    showNotification('All challenges cleared.');
    setAuthPassword('');
  };

  const handleResetDemo = () => {
    if (!verifyPassword()) return;
    onResetDemoData();
    showNotification('Demo data re-seeded.');
    setAuthPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-800/50 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Data Cleaning Center</h3>
              <p className="text-[11px] text-github-muted">Password-protected data cleaning and reset operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto">
          {notification && (
            <div
              className="p-2.5 rounded-lg border flex items-center gap-2"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '50',
                color: theme.accentLight
              }}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Mandatory Password Authorization Gate */}
          <div className="p-3.5 rounded-xl bg-[#0d1117] border border-amber-900/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Password Required to Authorize Clean *</span>
              </label>
              <span className="text-[10px] text-amber-400/80 font-mono">Protected</span>
            </div>
            <p className="text-[11px] text-github-muted">
              Enter your account password below before clicking any clean or reset option:
            </p>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={authPassword}
                onChange={(e) => {
                  setAuthPassword(e.target.value);
                  if (authError) setAuthError('');
                }}
                placeholder="Enter account password..."
                className="w-full pl-3 pr-10 py-2 bg-[#161b22] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none font-mono focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-github-muted hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {authError && (
              <div className="p-2 rounded-lg bg-red-950/70 border border-red-800/70 text-red-300 text-[11px] flex items-center gap-1.5 animate-in fade-in">
                <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}
          </div>

          {/* Option 1: Clear Completed Tasks */}
          <div className="p-3.5 rounded-lg bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-white">Clean Completed Tasks Only</div>
              <div className="text-[11px] text-github-muted mt-0.5">
                Remove all finished tasks while preserving pending tasks and challenges.
              </div>
            </div>
            <button
              onClick={handleClearCompleted}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors whitespace-nowrap"
            >
              Clear Completed
            </button>
          </div>

          {/* Option 2: Clear All Challenges */}
          <div className="p-3.5 rounded-lg bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-white">Clean All Habit Challenges</div>
              <div className="text-[11px] text-github-muted mt-0.5">
                Remove all active and completed challenges ({challengesCount} total).
              </div>
            </div>
            <button
              onClick={handleClearChallenges}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors whitespace-nowrap"
            >
              Clear Challenges
            </button>
          </div>

          {/* Option 3: Reset to Default Demo Data */}
          <div className="p-3.5 rounded-lg bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-white">Restore Standard Sample Data</div>
              <div className="text-[11px] text-github-muted mt-0.5">
                Reloads initial sample tasks, challenges, and realistic 120-day heatmap.
              </div>
            </div>
            <button
              onClick={handleResetDemo}
              className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors whitespace-nowrap"
            >
              Reset Demo
            </button>
          </div>

          {/* Option 4: Full Factory Reset (Clear All Data) */}
          <div className="p-3.5 rounded-lg bg-red-950/20 border border-red-900/40 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-red-300">Factory Reset: Clear All Data</div>
                <div className="text-[11px] text-github-muted mt-0.5">
                  Wipes all tasks ({tasksCount}), challenges ({challengesCount}), and activity records.
                </div>
              </div>
              {!confirmDeleteAll ? (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteAll(true)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-red-950 hover:bg-red-900 text-red-200 border border-red-800/50 transition-colors whitespace-nowrap"
                >
                  Wipe Everything
                </button>
              ) : null}
            </div>

            {confirmDeleteAll && (
              <div className="pt-2 border-t border-red-900/30 flex items-center justify-between gap-2">
                <span className="text-[11px] text-red-400 font-medium">Are you certain? This cannot be undone.</span>
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
                    onClick={handleClearAll}
                    className="px-3 py-1 rounded-md text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow transition-colors"
                  >
                    Confirm Wipe
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0d1117] border-t border-github-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-github-muted hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
