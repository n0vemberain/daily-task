import React, { useMemo } from 'react';
import { storageService } from '../../services/storageService';

export default function ChallengesWidget() {
  const challenges = useMemo(() => {
    const list = storageService.getChallenges();
    return list && list.length > 0
      ? list
      : [
          {
            id: 'c1',
            title: '30-Day LeetCode',
            targetDays: 30,
            completedDays: 18,
            currentStreak: 18,
            status: 'active'
          },
          {
            id: 'c2',
            title: 'Morning Habit Sprint',
            targetDays: 21,
            completedDays: 15,
            currentStreak: 15,
            status: 'active'
          },
          {
            id: 'c3',
            title: 'System Design Practice',
            targetDays: 14,
            completedDays: 4,
            currentStreak: 4,
            status: 'active'
          }
        ];
  }, []);

  const activeCount = challenges.filter((c) => c.status === 'active' || !c.status).length;

  const closeWidget = () => {
    if (window.electronAPI?.closeWidget) {
      window.electronAPI.closeWidget('challenges');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-3 select-none bg-transparent">
      <div className="w-full h-full rounded-3xl p-4 glass-card flex flex-col justify-between shadow-2xl relative border border-white/20 box-border">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 app-drag-region">
          <div className="flex items-center gap-2 app-no-drag">
            <button
              onClick={closeWidget}
              className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 border border-rose-600/60 transition-transform active:scale-90"
              title="Close Widget"
            />
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white drop-shadow-sm ml-1">
              Goal Challenges
            </h4>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30 app-no-drag">
            {activeCount} Active
          </span>
        </div>

        {/* Challenges List */}
        <div className="space-y-2.5 my-auto overflow-y-auto max-h-[265px] pr-0.5 app-no-drag">
          {challenges.map((c) => {
            const percent = Math.min(100, Math.round(((c.completedDays || 0) / (c.targetDays || 1)) * 100));
            return (
              <div
                key={c.id}
                className="p-3 rounded-2xl glass-item space-y-2 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate max-w-[150px]">{c.title}</span>
                  <span className="text-lime-300 font-extrabold text-[11px]">
                    Day {c.completedDays || 0} / {c.targetDays}
                  </span>
                </div>
                <div className="w-full bg-white/15 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-lime-400 to-emerald-400 h-full rounded-full shadow-[0_0_8px_#a3e635]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/50">
                  <span>Streak: {c.currentStreak || 0} Days 🔥</span>
                  <span className="text-lime-300 font-semibold">{percent}% Done</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 app-no-drag">
          <span>Overall: Tracked</span>
          <span className="text-emerald-300 font-semibold">On Schedule</span>
        </div>

      </div>
    </div>
  );
}
