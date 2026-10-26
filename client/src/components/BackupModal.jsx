import React, { useState } from 'react';
import { X, Download, Upload, RotateCcw, AlertTriangle, CheckCircle2, HardDrive } from 'lucide-react';
import { initialUserProfile, initialTasks, initialChallenges } from '../data/initialData';
import { useTheme } from '../context/ThemeContext';

export default function BackupModal({
  isOpen,
  onClose,
  data,
  onRestoreData,
  onResetData
}) {
  const { theme } = useTheme();
  const [statusMessage, setStatusMessage] = useState(null);

  if (!isOpen) return null;

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

      setStatusMessage({ type: 'success', text: 'Backup downloaded successfully!' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Export failed: ' + e.message });
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

        setStatusMessage({ type: 'success', text: 'Data restored successfully from backup!' });
        setTimeout(() => {
          setStatusMessage(null);
          onClose();
        }, 1500);
      } catch (err) {
        setStatusMessage({ type: 'error', text: 'Failed to parse JSON file: ' + err.message });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data back to the default demo state?')) {
      onResetData();
      setStatusMessage({ type: 'success', text: 'Reset to default data complete.' });
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accent
              }}
            >
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Data Backup &amp; Portability</h3>
              <p className="text-xs text-github-muted">Export, import, or reset your dashboard data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {statusMessage && (
            <div
              className={`p-3 rounded-lg border flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-600/50 text-emerald-300'
                  : 'bg-red-950/70 border-red-700/50 text-red-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Export */}
          <div className="p-3.5 rounded-lg bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-white">Download JSON Backup</div>
              <div className="text-[11px] text-github-muted mt-0.5">
                Export all tasks, streaks, challenges, and user profile.
              </div>
            </div>
            <button
              onClick={handleExport}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${theme.primaryBtn} shadow-sm transition-all whitespace-nowrap`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-3.5 rounded-lg bg-[#0d1117] border border-github-border flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-white">Restore from Backup</div>
              <div className="text-[11px] text-github-muted mt-0.5">
                Upload a previously exported JSON backup file.
              </div>
            </div>
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border cursor-pointer transition-colors whitespace-nowrap">
              <Upload className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span>Import</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset */}
          <div className="p-3.5 rounded-lg bg-[#0d1117] border border-red-900/30 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-red-300">Reset to Demo State</div>
              <div className="text-[11px] text-github-muted mt-0.5">
                Restores initial sample data &amp; streak history.
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/40 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0d1117] border-t border-github-border flex justify-end">
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
