import React, { useState, useMemo } from 'react';
import { Calendar, ChevronRight, Info, Sparkles, Filter } from 'lucide-react';
import { formatDateStr } from '../data/initialData';

export default function ContributionHeatmap({ tasks, onSelectDate, selectedDate }) {
  const [timeRange, setTimeRange] = useState('year'); // 'year' (52 weeks) or 'half' (26 weeks)
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map task completions by date
  const activityMap = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      if (t.completed && t.date) {
        if (!map[t.date]) {
          map[t.date] = { count: 0, tasks: [] };
        }
        map[t.date].count += 1;
        map[t.date].tasks.push(t.title);
      }
    });
    return map;
  }, [tasks]);

  // Generate 52 weeks or 26 weeks ending on current Saturday
  const { weeks, monthLabels, totalTasksCount, activeDaysCount } = useMemo(() => {
    const weeksCount = timeRange === 'year' ? 52 : 26;
    const totalDays = weeksCount * 7;

    const today = new Date();
    // End the calendar on the upcoming Saturday to keep a clean 7-row grid
    const endDayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday
    const daysUntilSaturday = 6 - endDayOfWeek;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysUntilSaturday);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);

    const weekCols = [];
    let currentWeek = [];
    const months = [];
    let lastMonth = -1;

    let tasksCount = 0;
    let activeDays = 0;

    const cur = new Date(startDate);
    let dayIndex = 0;

    while (cur <= endDate) {
      const dateStr = formatDateStr(cur);
      const isFuture = cur > today;
      const activity = activityMap[dateStr] || { count: 0, tasks: [] };

      if (!isFuture && activity.count > 0) {
        tasksCount += activity.count;
        activeDays += 1;
      }

      const dayObj = {
        date: dateStr,
        dayOfWeek: cur.getDay(),
        month: cur.getMonth(),
        year: cur.getFullYear(),
        dayOfMonth: cur.getDate(),
        count: isFuture ? 0 : activity.count,
        tasks: isFuture ? [] : activity.tasks,
        isFuture,
        isToday: dateStr === formatDateStr(today),
        formattedDate: cur.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };

      currentWeek.push(dayObj);

      // Track month labels at the start of each month or first week
      if (currentWeek.length === 1) {
        const weekMonth = cur.getMonth();
        if (weekMonth !== lastMonth) {
          const monthName = cur.toLocaleDateString('en-US', { month: 'short' });
          months.push({ colIndex: weekCols.length, name: monthName });
          lastMonth = weekMonth;
        }
      }

      if (currentWeek.length === 7) {
        weekCols.push(currentWeek);
        currentWeek = [];
      }

      cur.setDate(cur.getDate() + 1);
      dayIndex++;
    }

    if (currentWeek.length > 0) {
      weekCols.push(currentWeek);
    }

    return {
      weeks: weekCols,
      monthLabels: months,
      totalTasksCount: tasksCount,
      activeDaysCount: activeDays
    };
  }, [activityMap, timeRange]);

  // Olive green color resolver based on completed task count
  const getOliveLevelClass = (count, isFuture, isSelected) => {
    if (isFuture) {
      return 'bg-[#12161b]/50 border-[#1f242c] opacity-40 cursor-not-allowed';
    }
    if (isSelected) {
      return 'bg-olive-500 border-white ring-2 ring-olive-400 shadow-md shadow-olive-600/50';
    }
    if (count === 0) {
      return 'bg-[#161b22] border-[#21262d] hover:border-[#384620]';
    }
    if (count === 1) {
      return 'bg-[#263b19] border-[#384f27] hover:border-[#4d6b2c]'; // Level 1: Dark olive
    }
    if (count === 2) {
      return 'bg-[#3d5c24] border-[#4e7430] hover:border-[#63923c]'; // Level 2: Medium olive
    }
    if (count <= 4) {
      return 'bg-[#5a8533] border-[#6ea03f] hover:border-[#83bd4b]'; // Level 3: Rich olive
    }
    return 'bg-[#7eb644] border-[#92ce52] hover:border-[#abeb64] shadow-sm shadow-olive-600/40'; // Level 4: Vibrant olive
  };

  const handleCellHover = (e, day) => {
    if (day.isFuture) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8
    });
    setHoveredDay(day);
  };

  const handleCellLeave = () => {
    setHoveredDay(null);
  };

  return (
    <div className="bg-[#161b22] border border-github-border rounded-xl p-4 sm:p-6 mb-6 shadow-sm relative">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-github-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-olive-400" />
              Activity Contribution Heatmap
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-olive-950 text-olive-300 border border-olive-700/40 font-mono">
              Olive Shades
            </span>
          </div>
          <p className="text-xs text-github-muted mt-0.5">
            Visual record of daily task completions and productive streaks
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-2 bg-[#0d1117] p-1 rounded-lg border border-github-border text-xs">
          <button
            onClick={() => setTimeRange('year')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              timeRange === 'year'
                ? 'bg-olive-800 text-white shadow-sm border border-olive-600/40'
                : 'text-github-muted hover:text-white'
            }`}
          >
            Last 365 Days
          </button>
          <button
            onClick={() => setTimeRange('half')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              timeRange === 'half'
                ? 'bg-olive-800 text-white shadow-sm border border-olive-600/40'
                : 'text-github-muted hover:text-white'
            }`}
          >
            Last 6 Months
          </button>
        </div>
      </div>

      {/* Heatmap Grid Container with horizontal scroll */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="inline-block min-w-full">
          {/* Month labels header */}
          <div className="flex text-[11px] text-github-muted font-mono mb-1.5 ml-7 h-4 relative">
            {monthLabels.map((m, idx) => (
              <span
                key={idx}
                className="absolute transform -translate-x-1"
                style={{ left: `${m.colIndex * 15}px` }}
              >
                {m.name}
              </span>
            ))}
          </div>

          <div className="flex gap-1.5">
            {/* Day of Week labels (Sun, Mon, Tue, Wed, Thu, Fri, Sat) */}
            <div className="flex flex-col justify-between text-[10px] text-github-muted font-mono py-0.5 w-6 select-none">
              <span className="h-3 leading-3"></span>
              <span className="h-3 leading-3">Mon</span>
              <span className="h-3 leading-3"></span>
              <span className="h-3 leading-3">Wed</span>
              <span className="h-3 leading-3"></span>
              <span className="h-3 leading-3">Fri</span>
              <span className="h-3 leading-3"></span>
            </div>

            {/* Weeks Columns */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => {
                    const isSelected = selectedDate === day.date;
                    const levelClass = getOliveLevelClass(day.count, day.isFuture, isSelected);

                    return (
                      <button
                        key={dIdx}
                        onClick={() => !day.isFuture && onSelectDate && onSelectDate(day.date)}
                        onMouseEnter={(e) => handleCellHover(e, day)}
                        onMouseLeave={handleCellLeave}
                        disabled={day.isFuture}
                        className={`w-3 h-3 rounded-[2.5px] border heatmap-cell ${levelClass} focus:outline-none focus:ring-1 focus:ring-olive-400`}
                        aria-label={`${day.formattedDate}: ${day.count} tasks completed`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Summary Stats & Olive Color Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-github-border text-xs text-github-muted">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-white font-semibold font-mono">{totalTasksCount}</span> completed tasks in{' '}
            {timeRange === 'year' ? 'past 365 days' : 'past 6 months'}
          </div>
          <span className="text-github-border">•</span>
          <div>
            <span className="text-white font-semibold font-mono">{activeDaysCount}</span> active days
          </div>
          {selectedDate && (
            <>
              <span className="text-github-border">•</span>
              <button
                onClick={() => onSelectDate(null)}
                className="text-olive-400 hover:text-olive-300 underline font-medium"
              >
                Clear date filter ({selectedDate})
              </button>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-[11px]">Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-[#161b22] border border-[#21262d]" title="Level 0: 0 tasks" />
          <div className="w-3 h-3 rounded-[2px] bg-[#263b19] border border-[#384f27]" title="Level 1: 1 task" />
          <div className="w-3 h-3 rounded-[2px] bg-[#3d5c24] border border-[#4e7430]" title="Level 2: 2 tasks" />
          <div className="w-3 h-3 rounded-[2px] bg-[#5a8533] border border-[#6ea03f]" title="Level 3: 3-4 tasks" />
          <div className="w-3 h-3 rounded-[2px] bg-[#7eb644] border border-[#92ce52]" title="Level 4: 5+ tasks" />
          <span className="text-[11px]">More</span>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-[#0d1117]/95 border border-github-borderLight text-white px-3 py-2 rounded-lg text-xs shadow-xl backdrop-blur-md max-w-xs transition-opacity duration-150"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="font-semibold text-white flex items-center justify-between gap-2 border-b border-github-border pb-1 mb-1">
            <span>{hoveredDay.formattedDate}</span>
            {hoveredDay.isToday && (
              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-olive-900 text-olive-300 font-bold border border-olive-600/40">
                Today
              </span>
            )}
          </div>
          <div className="text-olive-300 font-medium">
            {hoveredDay.count === 0
              ? 'No tasks completed'
              : `${hoveredDay.count} task${hoveredDay.count > 1 ? 's' : ''} completed`}
          </div>
          {hoveredDay.tasks && hoveredDay.tasks.length > 0 && (
            <ul className="mt-1 space-y-0.5 text-github-muted text-[11px] max-h-24 overflow-y-auto">
              {hoveredDay.tasks.slice(0, 4).map((taskTitle, idx) => (
                <li key={idx} className="truncate flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-olive-400"></span>
                  <span className="text-github-text truncate">{taskTitle}</span>
                </li>
              ))}
              {hoveredDay.tasks.length > 4 && (
                <li className="text-github-muted italic text-[10px]">
                  +{hoveredDay.tasks.length - 4} more completed
                </li>
              )}
            </ul>
          )}
          <div className="text-[10px] text-github-muted mt-1 italic">Click to view/filter tasks</div>
        </div>
      )}
    </div>
  );
}
