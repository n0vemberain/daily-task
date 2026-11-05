import React, { useState, useMemo } from 'react';
import {
  Trash2,
  X,
  RotateCcw,
  CheckSquare,
  Flame,
  Clock,
  AlertTriangle,
  Calendar,
  Lock,
  Search
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import PasswordPromptModal from './PasswordPromptModal';
import { soundEffects } from '../utils/audioFeedback';

export default function RecycleBinModal({
  isOpen,
  onClose,
  recycleBin = [],
  onRestore,
  onPermanentDelete,
  onEmptyBin,
  userProfile
}) {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'task', 'challenge', 'session'
  const [searchQuery, setSearchQuery] = useState('');

  // Password Prompt State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [passwordPromptInfo, setPasswordPromptInfo] = useState({
    title: 'Authorize Deletion',
    description: 'This action permanently destroys data and cannot be undone.'
  });

  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const safeBin = Array.isArray(recycleBin) ? recycleBin : [];

  const filteredItems = useMemo(() => {
    return safeBin.filter((entry) => {
      if (!entry) return false;
      if (activeFilter !== 'all' && entry.type !== activeFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = entry.item?.title || entry.item?.label || '';
        return title.toLowerCase().includes(query);
      }
      return true;
    });
  }, [safeBin, activeFilter, searchQuery]);

  if (!isOpen) return null;

  const handleRestoreClick = (entry) => {
    if (onRestore) {
      onRestore(entry);
      soundEffects.playSuccess();
    }
  };

  const handlePermanentDeleteClick = (entry) => {
    const title = entry.item?.title || entry.item?.label || 'Item';
    const binId = entry.recycleBinId || entry.id;
    setPasswordPromptInfo({
      title: 'Authorize Permanent Deletion',
      description: `Permanently deleting "${title}" cannot be undone. Enter password to confirm.`
    });
    setPendingAction(() => () => {
      if (onPermanentDelete) {
        onPermanentDelete(binId);
        soundEffects.playSuccess();
      }
    });
    setIsPasswordModalOpen(true);
  };

  const handleEmptyBinClick = () => {
    setPasswordPromptInfo({
      title: 'Authorize Permanent Deletion',
      description: `Permanently delete all ${safeBin.length} items from the Recycle Bin? This action cannot be reversed.`
    });
    setPendingAction(() => () => {
      if (onEmptyBin) {
        onEmptyBin();
        soundEffects.playSuccess();
      }
    });
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSuccess = () => {
    setIsPasswordModalOpen(false);
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      action();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      >
        <div
          className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-github-border bg-[#0d1117] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accentLight
              }}
            >
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Recycle Bin (Trash)</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-mono font-normal border"
                  style={{
                    backgroundColor: theme.accentDark,
                    color: theme.accentLight,
                    borderColor: theme.accent + '40'
                  }}
                >
                  {safeBin.length} {safeBin.length === 1 ? 'item' : 'items'}
                </span>
              </h3>
              <p className="text-xs text-github-muted mt-0.5">
                Deleted items are retained here for 30 days before automatic permanent purge. You can restore them anytime.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-github-border bg-[#161b22] space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-github-border text-xs">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-[#21262d] text-white shadow-sm font-semibold'
                    : 'text-github-muted hover:text-white'
                }`}
              >
                All ({safeBin.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('task')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeFilter === 'task'
                    ? 'bg-[#21262d] text-white shadow-sm font-semibold'
                    : 'text-github-muted hover:text-white'
                }`}
              >
                Tasks ({safeBin.filter((i) => i.type === 'task').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('challenge')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeFilter === 'challenge'
                    ? 'bg-[#21262d] text-white shadow-sm font-semibold'
                    : 'text-github-muted hover:text-white'
                }`}
              >
                Challenges ({safeBin.filter((i) => i.type === 'challenge').length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('session')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  activeFilter === 'session'
                    ? 'bg-[#21262d] text-white shadow-sm font-semibold'
                    : 'text-github-muted hover:text-white'
                }`}
              >
                Sessions ({safeBin.filter((i) => i.type === 'session').length})
              </button>
            </div>

            {/* Empty Recycle Bin Button */}
            {safeBin.length > 0 && (
              <button
                type="button"
                onClick={handleEmptyBinClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 text-red-300 hover:text-white hover:bg-red-900/60 border border-red-800/50 transition-colors whitespace-nowrap ml-auto"
                title="Permanently empty all items (Requires password)"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Empty Recycle Bin</span>
              </button>
            )}
          </div>

          {/* Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-github-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deleted items..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-github-muted space-y-2">
              <Trash2 className="w-10 h-10 mx-auto opacity-30 text-github-muted" />
              <p className="text-sm font-medium text-white">Recycle Bin is empty</p>
              <p className="text-xs">
                {searchQuery ? 'No deleted items matching your search.' : 'Any items you delete will appear here for 30 days.'}
              </p>
            </div>
          ) : (
            filteredItems.map((entry) => {
              const item = entry.item || {};
              const title = item.title || item.label || 'Untitled';
              const deletedDate = entry.deletedAt ? new Date(entry.deletedAt) : new Date();
              const formattedDeletedDate = deletedDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              const elapsedMs = now - deletedDate.getTime();
              const daysRemaining = Math.max(1, Math.ceil((thirtyDaysMs - elapsedMs) / (24 * 60 * 60 * 1000)));

              return (
                <div
                  key={entry.recycleBinId || entry.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#0d1117] border border-github-border hover:border-github-borderLight transition-all text-xs gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-[#161b22] border border-github-border text-github-muted flex-shrink-0 mt-0.5">
                      {entry.type === 'challenge' ? (
                        <Flame className="w-4 h-4 text-amber-400" />
                      ) : entry.type === 'session' ? (
                        <Clock className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white truncate max-w-sm">
                          {title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                            entry.type === 'challenge'
                              ? 'bg-amber-950/50 text-amber-300 border border-amber-800/40'
                              : entry.type === 'session'
                              ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-800/40'
                              : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40'
                          }`}
                        >
                          {entry.type === 'challenge' ? 'Goal Challenge' : entry.type === 'session' ? 'Study Session' : 'Task'}
                        </span>
                        {item.category && (
                          <span className="text-[10px] text-github-muted bg-[#161b22] px-2 py-0.5 rounded border border-github-border">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {entry.type === 'challenge' && Array.isArray(entry.cascadeTasks) && entry.cascadeTasks.length > 0 && (
                        <p className="text-[11px] text-amber-300 font-mono">
                          Includes {entry.cascadeTasks.length} linked {entry.cascadeTasks.length === 1 ? 'task' : 'tasks'} (will restore together)
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-github-muted font-mono flex-wrap">
                        <span>Deleted on {formattedDeletedDate}</span>
                        <span>•</span>
                        <span className={daysRemaining <= 5 ? 'text-rose-400 font-semibold' : 'text-github-muted'}>
                          {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left before auto-purge
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleRestoreClick(entry)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors shadow-sm"
                      title="Restore back to original place"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Restore</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePermanentDeleteClick(entry)}
                      className="p-1.5 rounded-lg text-github-muted hover:text-red-400 hover:bg-[#21262d] transition-colors"
                      title="Delete Permanently (Requires password)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-github-border bg-[#0d1117] flex-shrink-0 text-xs text-github-muted">
          <span>Items older than 30 days are automatically removed permanently.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    {/* Password Prompt Modal for Permanent Deletions */}
      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
        userProfile={userProfile}
        title={passwordPromptInfo.title}
        description={passwordPromptInfo.description}
      />
    </>
  );
}