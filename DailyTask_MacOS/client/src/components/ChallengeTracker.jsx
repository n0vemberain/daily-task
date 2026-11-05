import React, { useState, useEffect } from 'react';
import {
  Flame,
  Plus,
  CheckCircle2,
  Calendar,
  Trash2,
  Trophy,
  Tag,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Edit3,
  GripVertical
} from 'lucide-react';
import ChallengeModal from './ChallengeModal';
import CheckInModal from './CheckInModal';
import EditChallengeModal from './EditChallengeModal';
import PasswordPromptModal from './PasswordPromptModal';
import { formatDateStr } from '../data/initialData';
import { useTheme } from '../context/ThemeContext';

export default function ChallengeTracker({
  challenges = [],
  tasks = [],
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onCreateChallenge,
  onCheckIn,
  onDeleteChallenge,
  onEditChallenge,
  onReorderChallenges,
  userProfile,
  activeTab
}) {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('active'); // 'active', 'completed', 'all'
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDayCheckIn, setSelectedDayCheckIn] = useState(null); // { challenge, dayItem }
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [expandedChallengeIds, setExpandedChallengeIds] = useState(new Set());
  const [draggedChallengeId, setDraggedChallengeId] = useState(null);
  const [dragOverChallengeId, setDragOverChallengeId] = useState(null);

  // Automatically reset all challenges to minimized whenever switching tabs
  useEffect(() => {
    setExpandedChallengeIds(new Set());
  }, [activeTab]);

  const todayStr = formatDateStr(new Date());

  const toggleExpand = (id) => {
    setExpandedChallengeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteClick = (challenge) => {
    setChallengeToDelete(challenge);
  };

  const handleConfirmDeleteChallenge = () => {
    if (challengeToDelete && onDeleteChallenge) {
      onDeleteChallenge(challengeToDelete.id || challengeToDelete._id);
      setChallengeToDelete(null);
    }
  };

  const isChallengeCompleted = (challenge) => {
    if (!challenge) return false;
    if (challenge.status === 'completed') return true;
    const checkIns = challenge.checkIns || [];
    const totalDays = challenge.durationDays || checkIns.length;
    if (totalDays === 0) return false;

    const challengeId = challenge.id || challenge._id;
    let completedTotal = 0;
    let skippedCount = 0;

    for (const dayItem of checkIns) {
      if (dayItem.status === 'skipped') {
        skippedCount += 1;
        continue;
      }

      const dayTasks = tasks.filter(
        (t) =>
          (t.challengeId === challengeId && t.dayNumber === dayItem.dayNumber) ||
          (t.challengeId === challengeId && t.date === dayItem.date)
      );

      if (dayTasks.length > 0) {
        if (dayTasks.every((t) => t.completed)) {
          completedTotal += 1;
        }
      } else if (dayItem.status === 'completed') {
        completedTotal += 1;
      }
    }

    return completedTotal >= totalDays || (completedTotal + skippedCount >= totalDays && completedTotal > 0);
  };

  const filteredChallenges = challenges.filter((c) => {
    const completed = isChallengeCompleted(c);
    if (filter === 'active') return !completed;
    if (filter === 'completed') return completed;
    return true;
  });

  const handleMoveChallenge = (challengeId, direction) => {
    if (!onReorderChallenges) return;
    const currentMasterIdx = challenges.findIndex((c) => (c.id || c._id) === challengeId);
    if (currentMasterIdx === -1) return;

    const visibleIdx = filteredChallenges.findIndex((c) => (c.id || c._id) === challengeId);
    if (visibleIdx === -1) return;

    const targetVisibleIdx = direction === 'up' ? visibleIdx - 1 : visibleIdx + 1;
    if (targetVisibleIdx < 0 || targetVisibleIdx >= filteredChallenges.length) return;

    const targetChallenge = filteredChallenges[targetVisibleIdx];
    const targetMasterIdx = challenges.findIndex((c) => (c.id || c._id) === (targetChallenge.id || targetChallenge._id));
    if (targetMasterIdx === -1) return;

    const newChallenges = [...challenges];
    const [moved] = newChallenges.splice(currentMasterIdx, 1);
    newChallenges.splice(targetMasterIdx, 0, moved);
    onReorderChallenges(newChallenges);
  };

  const handleDragStart = (e, challengeId) => {
    setDraggedChallengeId(challengeId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', challengeId);
  };

  const handleDragOver = (e, challengeId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverChallengeId !== challengeId) {
      setDragOverChallengeId(challengeId);
    }
  };

  const handleDrop = (e, targetChallengeId) => {
    e.preventDefault();
    if (!draggedChallengeId || draggedChallengeId === targetChallengeId || !onReorderChallenges) {
      setDraggedChallengeId(null);
      setDragOverChallengeId(null);
      return;
    }

    const fromIndex = challenges.findIndex((c) => (c.id || c._id) === draggedChallengeId);
    const toIndex = challenges.findIndex((c) => (c.id || c._id) === targetChallengeId);

    if (fromIndex !== -1 && toIndex !== -1) {
      const newChallenges = [...challenges];
      const [moved] = newChallenges.splice(fromIndex, 1);
      newChallenges.splice(toIndex, 0, moved);
      onReorderChallenges(newChallenges);
    }

    setDraggedChallengeId(null);
    setDragOverChallengeId(null);
  };

  const handleDragEnd = () => {
    setDraggedChallengeId(null);
    setDragOverChallengeId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Challenge-Based Goal Tracker
            </h2>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
              style={{
                backgroundColor: theme.accentDark,
                color: theme.accent,
                borderColor: theme.accent + '40'
              }}
            >
              Interactive Grids
            </span>
          </div>
          <p className="text-xs text-github-muted mt-1">
            Build unshakeable habits with custom duration challenges and daily visual check-ins
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-github-border text-xs">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-md font-medium border ${
                filter === 'active'
                  ? 'shadow-sm'
                  : 'border-transparent text-github-muted hover:text-white'
              }`}
              style={
                filter === 'active'
                  ? {
                      backgroundColor: theme.accentDark,
                      color: theme.accent,
                      borderColor: theme.accent + '40'
                    }
                  : {}
              }
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-md font-medium border ${
                filter === 'completed'
                  ? 'shadow-sm'
                  : 'border-transparent text-github-muted hover:text-white'
              }`}
              style={
                filter === 'completed'
                  ? {
                      backgroundColor: theme.accentDark,
                      color: theme.accent,
                      borderColor: theme.accent + '40'
                    }
                  : {}
              }
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-medium border ${
                filter === 'all'
                  ? 'shadow-sm'
                  : 'border-transparent text-github-muted hover:text-white'
              }`}
              style={
                filter === 'all'
                  ? {
                      backgroundColor: theme.accentDark,
                      color: theme.accent,
                      borderColor: theme.accent + '40'
                    }
                  : {}
              }
            >
              All
            </button>
          </div>

          {/* New Challenge Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white shadow-md transition-all whitespace-nowrap"
            style={{ backgroundColor: theme.accent, color: '#0d1117' }}
          >
            <Plus className="w-4 h-4" />
            <span>New Challenge</span>
          </button>
        </div>
      </div>

      {/* Challenges List */}
      {filteredChallenges.length === 0 ? (
        <div className="bg-[#161b22] border border-github-border rounded-xl p-10 sm:p-12 text-center">
          <div
            className="w-12 h-12 rounded-full border flex items-center justify-center mx-auto mb-3"
            style={{
              backgroundColor: theme.accentDark,
              borderColor: theme.accent + '40',
              color: theme.accent
            }}
          >
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No challenges found</h3>
          <p className="text-xs text-github-muted mt-1 max-w-sm mx-auto">
            You don't have any challenges in this tab. Start a new 7, 21, 30, or custom duration challenge now!
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all shadow"
            style={{ backgroundColor: theme.accent, color: '#0d1117' }}
          >
            <Plus className="w-4 h-4" />
            Create Your First Challenge
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredChallenges.map((challenge, visibleIdx) => {
            const checkIns = challenge.checkIns || [];
            const challengeId = challenge.id || challenge._id;
            const totalDays = challenge.durationDays || checkIns.length;
            const isCollapsed = !expandedChallengeIds.has(challengeId);

            // Compute dynamic day statuses for this challenge
            let onTimeDaysCount = 0;
            let lateDaysCount = 0;
            let incompleteDaysCount = 0;
            let skippedCount = 0;

            const computedCheckIns = checkIns.map((dayItem) => {
              const isToday = dayItem.date === todayStr;
              const isPast = dayItem.date < todayStr;
              const isFuture = dayItem.date > todayStr;

              const dayTasks = tasks.filter(
                (t) =>
                  (t.challengeId === challengeId && t.dayNumber === dayItem.dayNumber) ||
                  (t.challengeId === challengeId && t.date === dayItem.date)
              );

              const allTasksCompleted = dayTasks.length > 0 && dayTasks.every((t) => t.completed);
              const hasLateCompletion = dayTasks.some(
                (t) => t.hasRolledOver || t.completedLate || (t.completedAt && t.completedAt.slice(0, 10) > dayItem.date)
              );

              let status = dayItem.status || 'pending';
              if (dayItem.status === 'skipped') {
                status = 'skipped';
                skippedCount += 1;
              } else if (dayTasks.length > 0) {
                if (allTasksCompleted) {
                  if (hasLateCompletion) {
                    status = 'completed-late';
                    lateDaysCount += 1;
                  } else {
                    status = 'completed';
                    onTimeDaysCount += 1;
                  }
                } else if (isPast) {
                  status = 'incomplete';
                  incompleteDaysCount += 1;
                }
              } else {
                if (dayItem.status === 'completed') {
                  const isLate = dayItem.completedAt && dayItem.completedAt.slice(0, 10) > dayItem.date;
                  if (isLate) {
                    status = 'completed-late';
                    lateDaysCount += 1;
                  } else {
                    status = 'completed';
                    onTimeDaysCount += 1;
                  }
                } else if (isPast) {
                  status = 'incomplete';
                  incompleteDaysCount += 1;
                }
              }

              return {
                ...dayItem,
                status,
                dayTasks,
                isToday,
                isPast,
                isFuture
              };
            });

            const completedTotal = onTimeDaysCount + lateDaysCount;
            const progressPercent = totalDays > 0 ? Math.round((completedTotal / totalDays) * 100) : 0;
            const isCompleted = isChallengeCompleted(challenge);

            return (
              <div
                key={challengeId}
                draggable
                onDragStart={(e) => handleDragStart(e, challengeId)}
                onDragOver={(e) => handleDragOver(e, challengeId)}
                onDrop={(e) => handleDrop(e, challengeId)}
                onDragEnd={handleDragEnd}
                className={`bg-[#161b22] border rounded-xl p-4 sm:p-5 shadow-sm transition-all hover:border-white/20 ${
                  dragOverChallengeId === challengeId
                    ? 'border-dashed border-2'
                    : 'border-github-border'
                } ${draggedChallengeId === challengeId ? 'opacity-40' : 'opacity-100'}`}
                style={
                  dragOverChallengeId === challengeId
                    ? { borderColor: theme.accent }
                    : {}
                }
              >
                {/* Challenge Header - Clickable anywhere on header to expand/collapse */}
                <div
                  onClick={() => toggleExpand(challengeId)}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none group/header hover:bg-[#21262d]/30 rounded-lg p-1.5 -m-1.5 transition-colors ${
                    isCollapsed ? '' : 'pb-4 border-b border-github-border'
                  }`}
                  title={isCollapsed ? 'Click header to expand challenge details and grid' : 'Click top area to minimize challenge'}
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div
                      className="flex items-center gap-0.5 flex-shrink-0 mt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="p-1 text-github-muted hover:text-white cursor-grab active:cursor-grabbing"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col -space-y-0.5">
                        <button
                          type="button"
                          disabled={visibleIdx === 0}
                          onClick={() => handleMoveChallenge(challengeId, 'up')}
                          className={`p-0.5 rounded transition-colors ${
                            visibleIdx === 0
                              ? 'text-gray-600 cursor-not-allowed opacity-30'
                              : 'text-github-muted hover:text-white hover:bg-[#21262d]'
                          }`}
                          title="Move Up"
                          aria-label="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={visibleIdx === filteredChallenges.length - 1}
                          onClick={() => handleMoveChallenge(challengeId, 'down')}
                          className={`p-0.5 rounded transition-colors ${
                            visibleIdx === filteredChallenges.length - 1
                              ? 'text-gray-600 cursor-not-allowed opacity-30'
                              : 'text-github-muted hover:text-white hover:bg-[#21262d]'
                          }`}
                          title="Move Down"
                          aria-label="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#0d1117] text-github-muted border border-github-border">
                          #{visibleIdx + 1}
                        </span>
                        <h3 className="text-base font-bold text-white tracking-tight truncate">
                          {challenge.title}
                        </h3>
                        <span
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: theme.accentDark,
                            color: theme.accent,
                            borderColor: theme.accent + '40'
                          }}
                        >
                          {challenge.category || 'General'}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#0d1117] text-github-muted border border-github-border">
                          {totalDays} Days
                        </span>
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/40">
                            <Trophy className="w-3 h-3 text-emerald-400" />
                            Achieved
                          </span>
                        )}
                        {isCollapsed && (
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#0d1117] text-white border border-github-border">
                            {completedTotal}/{totalDays} ({progressPercent}%)
                          </span>
                        )}
                      </div>
                      {challenge.description && !isCollapsed && (
                        <p className="text-xs text-github-muted">{challenge.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Dates */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 self-end sm:self-auto text-xs text-github-muted flex-shrink-0"
                  >
                    <span className="font-mono text-[11px]">
                      {challenge.startDate} → {challenge.endDate}
                    </span>

                    {/* Minimize / Maximize toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(challengeId);
                      }}
                      className="px-2 py-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors flex items-center gap-1 text-xs border border-github-border"
                      title={isCollapsed ? 'Maximize Challenge Grid' : 'Minimize Challenge Grid'}
                    >
                      {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                      <span>{isCollapsed ? 'Expand' : 'Minimize'}</span>
                    </button>

                    {/* Edit Challenge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChallenge(challenge);
                      }}
                      className="p-1.5 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
                      title="Edit Challenge"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Challenge */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(challenge);
                      }}
                      className="p-1.5 rounded-md text-github-muted hover:text-red-400 hover:bg-[#21262d] transition-colors"
                      title="Delete Challenge (Requires password)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {!isCollapsed && (
                  <>
                    {/* Progress Bar & Summary Stats */}
                    <div className="py-4 border-b border-github-border space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-github-muted">
                          Progress:{' '}
                          <strong className="text-white font-mono">
                            {completedTotal} / {totalDays}
                          </strong>{' '}
                          days achieved
                        </span>
                        <span className="font-mono font-bold" style={{ color: theme.accent }}>
                          {progressPercent}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2.5 bg-[#0d1117] rounded-full overflow-hidden border border-github-border">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${progressPercent}%`,
                            backgroundColor: theme.accent
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-github-muted pt-1 flex-wrap gap-2">
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="flex items-center gap-1.5 text-emerald-300">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: theme.accent }}
                            />
                            {onTimeDaysCount} On Time
                          </span>
                          {lateDaysCount > 0 && (
                            <span className="flex items-center gap-1.5 text-yellow-300 font-medium">
                              <span className="w-2 h-2 rounded-full bg-yellow-400" />
                              {lateDaysCount} Late / Rollover Done
                            </span>
                          )}
                          {incompleteDaysCount > 0 && (
                            <span className="flex items-center gap-1.5 text-rose-300">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              {incompleteDaysCount} Incomplete
                            </span>
                          )}
                          {skippedCount > 0 && (
                            <span className="flex items-center gap-1.5 text-amber-300">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              {skippedCount} Skipped
                            </span>
                          )}
                          <span>
                            {Math.max(0, totalDays - completedTotal - skippedCount)} Days Remaining
                          </span>
                        </div>
                        <span className="italic text-[10px]">Click any day square to check-in or edit</span>
                      </div>
                    </div>

                    {/* The Interactive Day-by-Day Challenge Grid */}
                    <div className="pt-4">
                      <div className="text-xs font-semibold text-github-text uppercase tracking-wider mb-2.5 flex items-center justify-between flex-wrap gap-1">
                        <span>Day-by-Day Check-in Grid</span>
                        <span className="text-[11px] text-github-muted normal-case font-normal">
                          Green = On Time • Yellow = Late Done • Red = Incomplete • Orange = Skipped • Ring = Today
                        </span>
                      </div>

                      <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-15 gap-1.5 sm:gap-2">
                        {computedCheckIns.map((dayItem) => {
                          const isDoneOnTime = dayItem.status === 'completed';
                          const isDoneLate = dayItem.status === 'completed-late';
                          const isSkipped = dayItem.status === 'skipped';
                          const isIncomplete = dayItem.status === 'incomplete';
                          const isToday = dayItem.isToday;
                          const dayTasks = dayItem.dayTasks || [];

                          let cellStyle = 'bg-[#0d1117] border-github-border text-github-muted hover:border-white/30';
                          let inlineStyle = {};

                          if (isDoneOnTime) {
                            cellStyle = 'border-emerald-500/80 text-white shadow-sm';
                            inlineStyle = {
                              backgroundColor: theme.hexLevels[3] || '#238636',
                              borderColor: theme.accent
                            };
                          } else if (isDoneLate) {
                            cellStyle = 'border-yellow-500/80 text-yellow-200 shadow-sm';
                            inlineStyle = {
                              backgroundColor: 'rgba(234, 179, 8, 0.25)',
                              borderColor: '#eab308'
                            };
                          } else if (isSkipped) {
                            cellStyle = 'border-amber-600/70 text-amber-300';
                            inlineStyle = {
                              backgroundColor: 'rgba(217, 119, 6, 0.25)',
                              borderColor: '#d97706'
                            };
                          } else if (isIncomplete) {
                            cellStyle = 'border-rose-600/80 text-rose-300';
                            inlineStyle = {
                              backgroundColor: 'rgba(225, 29, 72, 0.22)',
                              borderColor: '#e11d48'
                            };
                          } else if (isToday) {
                            cellStyle = 'ring-2 font-bold animate-pulse text-white';
                            inlineStyle = {
                              borderColor: theme.accent,
                              boxShadow: `0 0 0 2px ${theme.accent}60`,
                              backgroundColor: theme.accentDark
                            };
                          }

                          return (
                            <button
                              key={dayItem.dayNumber}
                              onClick={() => setSelectedDayCheckIn({ challenge, dayItem })}
                              className={`aspect-square min-h-[36px] rounded-lg border p-1 flex flex-col items-center justify-center relative transition-all group ${cellStyle}`}
                              style={inlineStyle}
                              title={`Day ${dayItem.dayNumber} (${dayItem.date}): ${dayItem.status}${
                                dayItem.note ? ` - "${dayItem.note}"` : ''
                              }${dayTasks.length > 0 ? ` • ${dayTasks.length} task(s)` : ''}`}
                            >
                              <span className="text-[11px] font-mono leading-none">
                                {dayItem.dayNumber}
                              </span>
                              {isDoneOnTime ? (
                                <CheckCircle2
                                  className="w-3.5 h-3.5 mt-1"
                                  style={{ color: '#ffffff' }}
                                />
                              ) : isDoneLate ? (
                                <CheckCircle2
                                  className="w-3.5 h-3.5 mt-1 text-yellow-400"
                                />
                              ) : isSkipped ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" />
                              ) : isIncomplete ? (
                                <span className="text-[9px] font-mono leading-none px-1 rounded bg-rose-950 text-rose-300 border border-rose-800/60 mt-1">
                                  {dayTasks.filter((t) => t.completed).length}/{dayTasks.length}
                                </span>
                              ) : isToday ? (
                                <span
                                  className="w-1.5 h-1.5 rounded-full mt-1"
                                  style={{ backgroundColor: theme.accent }}
                                />
                              ) : dayTasks.length > 0 ? (
                                <span className="text-[9px] font-mono leading-none px-1 rounded bg-[#161b22] text-amber-300 border border-amber-800/40 mt-1">
                                  {dayTasks.filter((t) => t.completed).length}/{dayTasks.length}
                                </span>
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#30363d] mt-1 group-hover:bg-github-muted" />
                              )}

                              {dayItem.note && (
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal to Create Challenge */}
      <ChallengeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateChallenge={onCreateChallenge}
      />

      {/* Modal to Check In */}
      <CheckInModal
        isOpen={Boolean(selectedDayCheckIn)}
        onClose={() => setSelectedDayCheckIn(null)}
        challenge={selectedDayCheckIn?.challenge}
        dayItem={selectedDayCheckIn?.dayItem}
        tasks={tasks}
        onAddTask={onAddTask}
        onToggleTask={onToggleTask}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        onSaveCheckIn={onCheckIn}
        userProfile={userProfile}
        challenges={challenges}
      />

      {/* Modal to Edit Challenge */}
      <EditChallengeModal
        isOpen={Boolean(editingChallenge)}
        onClose={() => setEditingChallenge(null)}
        challenge={editingChallenge}
        onSaveChallenge={onEditChallenge}
        userProfile={userProfile}
      />

      {/* Password Authorization Modal for Deleting Challenge */}
      <PasswordPromptModal
        isOpen={Boolean(challengeToDelete)}
        onClose={() => setChallengeToDelete(null)}
        onSuccess={handleConfirmDeleteChallenge}
        userProfile={userProfile}
        title="Authorize Challenge Deletion"
        description={
          challengeToDelete
            ? `Deleting goal challenge "${challengeToDelete.title}" and its progress requires your account password.`
            : 'Deleting a goal challenge requires your account password.'
        }
      />
    </div>
  );
}
