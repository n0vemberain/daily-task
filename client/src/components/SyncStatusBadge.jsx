import React from 'react';
import { Database, RefreshCw, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SyncStatusBadge({
  mongoStatus,
  isSyncing,
  lastSyncTime,
  onManualSync
}) {
  const isMongoOnline = mongoStatus?.isMongoConnected;

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Persistence indicator */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
          isMongoOnline
            ? 'bg-olive-950/70 border-olive-600/40 text-olive-300'
            : 'bg-[#1c1d19] border-amber-600/30 text-amber-300'
        }`}
        title={
          isMongoOnline
            ? 'Dual Persistence Active: LocalStorage + MongoDB connected'
            : 'LocalStorage Persistence Active (MongoDB server offline - click Sync or start mongod)'
        }
      >
        {isMongoOnline ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-olive-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-olive-500"></span>
            </span>
            <Database className="w-3.5 h-3.5 text-olive-400" />
            <span className="font-medium hidden sm:inline">MongoDB & LocalStorage Synced</span>
            <span className="font-medium sm:hidden">MongoDB Active</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-amber-500"></span>
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium hidden sm:inline">LocalStorage Active (MongoDB Offline)</span>
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
        <RefreshCw className={`w-3 h-3 text-olive-400 ${isSyncing ? 'animate-spin' : ''}`} />
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
