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
  ChevronRight
} from 'lucide-react';
import ChallengeModal from './ChallengeModal';
import CheckInModal from './CheckInModal';
import { formatDateStr } from '../data/initialData';

export default function ChallengeTracker({
  challenges,
  onCreateChallenge,
  onCheckIn,
  onDeleteChallenge
}) {
  const [filter, setFilter] = useState('active'); // 'active', 'completed', 'all'
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDayCheckIn, setSelectedDayCheckIn] = useState(null); // { challenge, dayItem }

  const todayStr = formatDateStr(new Date());

  const filteredChallenges = challenges.filter((c) => {
    if (filter === 'active') return c.status === 'active';
    if (filter === 'completed') return c.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              Challenge-Based Goal Tracker
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-olive-950 text-olive-300 border border-olive-700/40 font-medium">
              Interactive Grids
            </span>
          </div>
          <p className="text-xs text-github-muted mt-1">
            Build unshakeable habits with custom duration challenges and daily visual check-ins
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-github-border text-xs">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === 'active'
                  ? 'bg-olive-800 text-white shadow-sm border border-olive-600/40'
                  : 'text-github-muted hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-olive-800 text-white shadow-sm border border-olive-600/40'
                  : 'text-github-muted hover:text-white'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filter === 'all'
                  ? 'bg-olive-800 text-white shadow-sm border border-olive-600/40'
                  : 'text-github-muted hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          {/* New Challenge Button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-olive-700 hover:bg-olive-600 text-white shadow-md border border-olive-500/40 transition-all whitespace-nowrap ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Challenge</span>
          </button>
        </div>
      </div>

      {/* Challenges List */}
      {filteredChallenges.length === 0 ? (
        <div className="bg-[#161b22] border border-github-border rounded-xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-olive-950 border border-olive-700/40 text-olive-400 flex items-center justify-center mx-auto mb-3">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No challenges found</h3>
          <p className="text-xs text-github-muted mt-1 max-w-sm mx-auto">
            You don't have any challenges in this tab. Start a new 7, 21, 30, or custom duration challenge now!
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-olive-700 hover:bg-olive-600 text-white border border-olive-500/40 transition-all"
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
                className="bg-[#161b22] border border-github-border rounded-xl p-5 shadow-sm transition-all hover:border-olive-600/30"
              >
                {/* Challenge Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-github-border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {challenge.title}
                      </h3>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-olive-950 text-olive-300 border border-olive-700/40">
                        {challenge.category || 'General'}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#0d1117] text-github-muted border border-github-border">
                        {totalDays} Days
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/40">
                          <Trophy className="w-3 h-3 text-emerald-400" />
                          Achieved!
                        </span>
                      )}
                    </div>
                    {challenge.description && (
                      <p className="text-xs text-github-muted">{challenge.description}</p>
                    )}
                  </div>

                  {/* Actions & Dates */}
                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-github-muted">
                    <span className="font-mono text-[11px]">
                      {challenge.startDate} → {challenge.endDate}
                    </span>
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
                    <span className="font-mono font-bold text-olive-400">{progressPercent}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-[#0d1117] rounded-full overflow-hidden border border-github-border">
                    <div
                      className="h-full bg-gradient-to-r from-olive-700 via-olive-500 to-olive-400 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-github-muted pt-1">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-olive-500" />
                        {completedCount} Completed
                      </span>
                      {skippedCount > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          {skippedCount} Skipped
                        </span>
                      )}
                      <span>
                        {Math.max(0, totalDays - completedCount - skippedCount)} Days Remaining
                      </span>
                    </div>
                    <span className="italic text-[10px]">Click any day square to check-in</span>
                  </div>
                </div>

                {/* The Interactive Day-by-Day Challenge Grid */}
                <div className="pt-4">
                  <div className="text-xs font-semibold text-github-text uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>Day-by-Day Check-in Grid</span>
                    <span className="text-[11px] text-github-muted normal-case font-normal">
                      Olive = Done • Orange = Skipped • Ring = Today
                    </span>
                  </div>

                  <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-15 gap-2">
                    {checkIns.map((dayItem) => {
                      const isToday = dayItem.date === todayStr;
                      const isDone = dayItem.status === 'completed';
                      const isSkipped = dayItem.status === 'skipped';
                      const isFuture = dayItem.date > todayStr;

                      let cellStyle = 'bg-[#0d1117] border-github-border text-github-muted hover:border-github-borderLight';
                      if (isDone) {
                        cellStyle = 'bg-olive-800/80 border-olive-500 text-white shadow-sm hover:bg-olive-700';
                      } else if (isSkipped) {
                        cellStyle = 'bg-amber-950/40 border-amber-600/50 text-amber-300 hover:border-amber-500';
                      } else if (isToday) {
                        cellStyle = 'bg-olive-950/50 border-olive-400 ring-2 ring-olive-400 text-white font-bold animate-pulse';
                      }

                      return (
                        <button
                          key={dayItem.dayNumber}
                          onClick={() => setSelectedDayCheckIn({ challenge, dayItem })}
                          className={`aspect-square rounded-lg border p-1 flex flex-col items-center justify-center relative transition-all group ${cellStyle}`}
                          title={`Day ${dayItem.dayNumber} (${dayItem.date}): ${dayItem.status}${
                            dayItem.note ? ` - "${dayItem.note}"` : ''
                          }`}
                        >
                          <span className="text-[11px] font-mono leading-none">
                            {dayItem.dayNumber}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-olive-300 mt-1" />
                          ) : isSkipped ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" />
                          ) : isToday ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-olive-400 mt-1" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#30363d] mt-1 group-hover:bg-github-muted" />
                          )}

                          {/* Note indicator dot */}
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
    </div>
  );
}
