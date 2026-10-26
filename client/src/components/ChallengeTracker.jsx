import React, { useState } from 'react';
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
  Edit3
} from 'lucide-react';
import ChallengeModal from './ChallengeModal';
import CheckInModal from './CheckInModal';
import EditChallengeModal from './EditChallengeModal';
import { formatDateStr } from '../data/initialData';
import { useTheme } from '../context/ThemeContext';

export default function ChallengeTracker({
  challenges,
  onCreateChallenge,
  onCheckIn,
  onDeleteChallenge,
  onEditChallenge
}) {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('active'); // 'active', 'completed', 'all'
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDayCheckIn, setSelectedDayCheckIn] = useState(null); // { challenge, dayItem }
  const [editingChallenge, setEditingChallenge] = useState(null);

  const todayStr = formatDateStr(new Date());

  const filteredChallenges = challenges.filter((c) => {
    if (filter === 'active') return c.status === 'active';
    if (filter === 'completed') return c.status === 'completed';
    return true;
  });

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
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === 'active'
                  ? 'border shadow-sm'
                  : 'text-github-muted hover:text-white'
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
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === 'completed'
                  ? 'border shadow-sm'
                  : 'text-github-muted hover:text-white'
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
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === 'all'
                  ? 'border shadow-sm'
                  : 'text-github-muted hover:text-white'
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
          {filteredChallenges.map((challenge) => {
            const checkIns = challenge.checkIns || [];
            const completedCount = checkIns.filter((c) => c.status === 'completed').length;
            const skippedCount = checkIns.filter((c) => c.status === 'skipped').length;
            const totalDays = challenge.durationDays || checkIns.length;
            const progressPercent = totalDays > 0 ? Math.round((completedCount / totalDays) * 100) : 0;
            const isCompleted = challenge.status === 'completed' || completedCount === totalDays;

            return (
              <div
                key={challenge.id || challenge._id}
                className="bg-[#161b22] border border-github-border rounded-xl p-4 sm:p-5 shadow-sm transition-all hover:border-white/20"
              >
                {/* Challenge Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-github-border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-tight">
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
                    </div>
                    {challenge.description && (
                      <p className="text-xs text-github-muted">{challenge.description}</p>
                    )}
                  </div>

                  {/* Actions & Dates */}
                  <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-github-muted">
                    <span className="font-mono text-[11px]">
                      {challenge.startDate} → {challenge.endDate}
                    </span>

                    {/* Edit Challenge */}
                    <button
                      onClick={() => setEditingChallenge(challenge)}
                      className="p-1.5 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
                      title="Edit Challenge"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete Challenge */}
                    <button
                      onClick={() => onDeleteChallenge(challenge.id || challenge._id)}
                      className="p-1.5 rounded-md text-github-muted hover:text-red-400 hover:bg-[#21262d] transition-colors"
                      title="Delete Challenge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Summary Stats */}
                <div className="py-4 border-b border-github-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-github-muted">
                      Progress:{' '}
                      <strong className="text-white font-mono">
                        {completedCount} / {totalDays}
                      </strong>{' '}
                      days checked in
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
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.accent }}
                        />
                        {completedCount} Completed
                      </span>
                      {skippedCount > 0 && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          {skippedCount} Skipped
                        </span>
                      )}
                      <span>
                        {Math.max(0, totalDays - completedCount - skippedCount)} Days Remaining
                      </span>
                    </div>
                    <span className="italic text-[10px]">Click any day square to check-in or edit</span>
                  </div>
                </div>

                {/* The Interactive Day-by-Day Challenge Grid */}
                <div className="pt-4">
                  <div className="text-xs font-semibold text-github-text uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>Day-by-Day Check-in Grid</span>
                    <span className="text-[11px] text-github-muted normal-case font-normal">
                      Completed • Orange = Skipped • Ring = Today
                    </span>
                  </div>

                  <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-15 gap-1.5 sm:gap-2">
                    {checkIns.map((dayItem) => {
                      const isToday = dayItem.date === todayStr;
                      const isDone = dayItem.status === 'completed';
                      const isSkipped = dayItem.status === 'skipped';

                      let cellStyle = 'bg-[#0d1117] border-github-border text-github-muted hover:border-white/30';
                      if (isDone) {
                        cellStyle = 'border-white/30 text-white shadow-sm';
                      } else if (isSkipped) {
                        cellStyle = 'bg-amber-950/40 border-amber-600/50 text-amber-300 hover:border-amber-500';
                      } else if (isToday) {
                        cellStyle = 'ring-2 font-bold animate-pulse text-white';
                      }

                      return (
                        <button
                          key={dayItem.dayNumber}
                          onClick={() => setSelectedDayCheckIn({ challenge, dayItem })}
                          className={`aspect-square min-h-[36px] rounded-lg border p-1 flex flex-col items-center justify-center relative transition-all group ${cellStyle}`}
                          style={
                            isDone
                              ? {
                                  backgroundColor: theme.hexLevels[3],
                                  borderColor: theme.accent + '80'
                                }
                              : isToday
                              ? {
                                  borderColor: theme.accent,
                                  boxShadow: `0 0 0 2px ${theme.accent}60`,
                                  backgroundColor: theme.accentDark
                                }
                              : {}
                          }
                          title={`Day ${dayItem.dayNumber} (${dayItem.date}): ${dayItem.status}${
                            dayItem.note ? ` - "${dayItem.note}"` : ''
                          }`}
                        >
                          <span className="text-[11px] font-mono leading-none">
                            {dayItem.dayNumber}
                          </span>
                          {isDone ? (
                            <CheckCircle2
                              className="w-3.5 h-3.5 mt-1"
                              style={{ color: '#ffffff' }}
                            />
                          ) : isSkipped ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" />
                          ) : isToday ? (
                            <span
                              className="w-1.5 h-1.5 rounded-full mt-1"
                              style={{ backgroundColor: theme.accent }}
                            />
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
        onSaveCheckIn={onCheckIn}
      />

      {/* Modal to Edit Challenge */}
      <EditChallengeModal
        isOpen={Boolean(editingChallenge)}
        onClose={() => setEditingChallenge(null)}
        challenge={editingChallenge}
        onSaveChallenge={onEditChallenge}
      />
    </div>
  );
}
