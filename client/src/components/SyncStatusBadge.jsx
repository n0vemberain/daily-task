import React from 'react';
import { Database, RefreshCw, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SyncStatusBadge({
  mongoStatus,
  isSyncing,
  lastSyncTime,
  onManualSync
}) {
  const { theme } = useTheme();
  const isMongoOnline = mongoStatus?.isMongoConnected;

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Persistence indicator */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all"
        style={
          isMongoOnline
            ? {
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accentLight
              }
            : {
                backgroundColor: '#1c1d19',
                borderColor: '#d9770640',
                color: '#fcd34d'
              }
        }
        title={
          isMongoOnline
            ? 'Dual Persistence Active: LocalStorage + MongoDB connected'
            : 'LocalStorage Persistence Active (MongoDB server offline - click Sync or start mongod)'
        }
      >
        {isMongoOnline ? (
          <>
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: theme.accent }}
              ></span>
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: theme.accent }}
              ></span>
            </span>
            <Database className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            <span className="font-medium hidden sm:inline">MongoDB &amp; LocalStorage Synced</span>
            <span className="font-medium sm:hidden">Synced</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium hidden sm:inline">LocalStorage Active</span>
            <span className="font-medium sm:hidden">LocalStorage</span>
          </>
        )}
      </div>

      {/* Manual Sync Button */}
      <button
        onClick={onManualSync}
        disabled={isSyncing}
        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] text-github-text border border-github-border transition-colors disabled:opacity-60"
        title="Trigger instant data persistence and sync"
      >
        <RefreshCw
          className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`}
          style={{ color: theme.accent }}
        />
        <span className="hidden md:inline">{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
      </button>

      {lastSyncTime && (
        <span className="hidden lg:inline text-github-muted text-[11px]">
          Last sync: {new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}
