import React from 'react';
import { Flame, Trophy, CheckCircle2, Target, Calendar } from 'lucide-react';
import { formatDateStr } from '../data/initialData';
import { useTheme } from '../context/ThemeContext';

export default function StatsOverview({ tasks, challenges }) {
  const { theme } = useTheme();
  const todayStr = formatDateStr(new Date());

  // Calculate tasks completed today
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const todayCompleted = todayTasks.filter(t => t.completed).length;

  // Total completed tasks
  const totalCompleted = tasks.filter(t => t.completed).length;

  // Calculate streaks from completed tasks grouped by date
  const completedDatesSet = new Set(
    tasks.filter(t => t.completed && t.date).map(t => t.date)
  );

  // Active challenges count and average completion
  const activeChallenges = challenges.filter(c => c.status === 'active');
  let totalChallengeDays = 0;
  let completedChallengeDays = 0;
  activeChallenges.forEach(c => {
    if (c.checkIns && c.checkIns.length > 0) {
      totalChallengeDays += c.checkIns.length;
      completedChallengeDays += c.checkIns.filter(ci => ci.status === 'completed').length;
    }
  });
  const challengeProgress = totalChallengeDays > 0
    ? Math.round((completedChallengeDays / totalChallengeDays) * 100)
    : 0;

  // Calculate streaks
  let currentStreak = 0;
  let tempDate = new Date();

  const todayIsDone = completedDatesSet.has(formatDateStr(tempDate));
  if (!todayIsDone) {
    tempDate.setDate(tempDate.getDate() - 1);
  }

  while (completedDatesSet.has(formatDateStr(tempDate))) {
    currentStreak++;
    tempDate.setDate(tempDate.getDate() - 1);
  }

  // Longest streak calculation
  const sortedDates = Array.from(completedDatesSet).sort();
  let longestStreak = 0;
  let running = 0;
  let prevDate = null;

  sortedDates.forEach(dStr => {
    const cur = new Date(dStr);
    if (prevDate) {
      const diffTime = cur.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      if (diffDays === 1) {
        running++;
      } else if (diffDays > 1) {
        running = 1;
      }
    } else {
      running = 1;
    }
    if (running > longestStreak) longestStreak = running;
    prevDate = cur;
  });

  if (currentStreak > longestStreak) longestStreak = currentStreak;

  const stats = [
    {
      title: 'Current Streak',
      value: `${currentStreak} Days`,
      sub: currentStreak > 0 ? 'Consistent momentum' : 'Start your streak today',
      icon: Flame,
      color: 'text-amber-400',
      boxStyle: {
        backgroundColor: '#161b22',
        borderColor: '#30363d'
      }
    },
    {
      title: 'Longest Streak',
      value: `${longestStreak} Days`,
      sub: 'All-time personal record',
      icon: Trophy,
      color: 'text-white',
      boxStyle: {
        backgroundColor: theme.accentDark,
        borderColor: theme.accent + '40'
      },
      iconColor: theme.accent
    },
    {
      title: 'Tasks Completed',
      value: totalCompleted,
      sub: `${todayCompleted} completed today`,
      icon: CheckCircle2,
      color: 'text-white',
      boxStyle: {
        backgroundColor: theme.accentDark,
        borderColor: theme.accent + '40'
      },
      iconColor: theme.accent
    },
    {
      title: 'Challenge Goals',
      value: `${activeChallenges.length} Active`,
      sub: `${challengeProgress}% total completed`,
      icon: Target,
      color: 'text-emerald-400',
      boxStyle: {
        backgroundColor: '#161b22',
        borderColor: '#30363d'
      }
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-3 sm:p-4 rounded-xl border backdrop-blur-sm transition-all hover:border-white/30 flex flex-col justify-between"
            style={stat.boxStyle}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-github-muted">{stat.title}</span>
              <div
                className="p-1.5 rounded-lg bg-[#21262d]"
                style={stat.iconColor ? { color: stat.iconColor } : {}}
              >
                <Icon className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${stat.color || ''}`} />
              </div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-[11px] text-github-muted mt-0.5 truncate">
                {stat.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
