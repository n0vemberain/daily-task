import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, RotateCcw, CheckSquare, Flame, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DataCleanModal({
  isOpen,
  onClose,
  onClearAllData,
  onClearCompletedTasks,
  onClearChallenges,
  onResetDemoData,
  tasksCount,
  challengesCount
}) {
  const { theme } = useTheme();
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [notification, setNotification] = useState('');

  if (!isOpen) return null;

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification('');
      onClose();
    }, 1500);
  };

  const handleClearAll = () => {
    onClearAllData();
    showNotification('All application data cleared successfully.');
    setConfirmDeleteAll(false);
  };

  const handleClearCompleted = () => {
    onClearCompletedTasks();
    showNotification('Completed tasks cleared.');
  };

  const handleClearChallenges = () => {
    onClearChallenges();
    showNotification('All challenges cleared.');
  };

  const handleResetDemo = () => {
    onResetDemoData();
    showNotification('Demo data re-seeded.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-800/50 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Data Cleaning &amp; Reset Management</h3>
              <p className="text-[11px] text-github-muted">Selective cleaning and factory data reset</p>
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
        <div className="p-5 space-y-4 text-xs">
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
