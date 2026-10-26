import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Calendar, ChevronRight, Info, Filter, Palette, CheckSquare, Sparkles } from 'lucide-react';
import { formatDateStr } from '../data/initialData';
import { useTheme } from '../context/ThemeContext';

// Color themes with high-contrast, accessible scales
export const HEATMAP_THEMES = {
  olive: {
    id: 'olive',
    name: 'Olive Green',
    accent: '#7eb644',
    badge: 'Olive Green Shades',
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#384620]',
      1: 'bg-[#263b19] border-[#384f27] hover:border-[#4d6b2c]',
      2: 'bg-[#3d5c24] border-[#4e7430] hover:border-[#63923c]',
      3: 'bg-[#5a8533] border-[#6ea03f] hover:border-[#83bd4b]',
      4: 'bg-[#7eb644] border-[#92ce52] hover:border-[#abeb64] shadow-sm shadow-olive-600/40'
    },
    hexLevels: ['#161b22', '#263b19', '#3d5c24', '#5a8533', '#7eb644'],
    selectedRing: 'bg-olive-500 border-white ring-2 ring-olive-400 shadow-md shadow-olive-600/50',
    badgeClass: 'bg-olive-950 text-olive-300 border-olive-700/40',
    activeBtn: 'bg-olive-800 text-white border-olive-600/50 shadow-sm'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Mint',
    accent: '#39d353',
    badge: 'Emerald Mint Shades',
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#15462c]',
      1: 'bg-[#0e4429] border-[#165b38] hover:border-[#1d784b]',
      2: 'bg-[#006d32] border-[#108c43] hover:border-[#1ca853]',
      3: 'bg-[#26a641] border-[#34c453] hover:border-[#42dd64]',
      4: 'bg-[#39d353] border-[#55ea6f] hover:border-[#76f08c] shadow-sm shadow-emerald-600/40'
    },
    hexLevels: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
    selectedRing: 'bg-emerald-500 border-white ring-2 ring-emerald-400 shadow-md shadow-emerald-600/50',
    badgeClass: 'bg-emerald-950 text-emerald-300 border-emerald-700/40',
    activeBtn: 'bg-emerald-800 text-white border-emerald-600/50 shadow-sm'
  },
  cyan: {
    id: 'cyan',
    name: 'Ocean Cyan',
    accent: '#38d8f5',
    badge: 'Ocean Cyan Shades',
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#134958]',
      1: 'bg-[#0b3c49] border-[#115769] hover:border-[#16728a]',
      2: 'bg-[#0e6075] border-[#15819e] hover:border-[#1da5c9]',
      3: 'bg-[#189cb5] border-[#25c4e3] hover:border-[#41d2f0]',
      4: 'bg-[#38d8f5] border-[#67e4fa] hover:border-[#96eefa] shadow-sm shadow-cyan-600/40'
    },
    hexLevels: ['#161b22', '#0b3c49', '#0e6075', '#189cb5', '#38d8f5'],
    selectedRing: 'bg-cyan-500 border-white ring-2 ring-cyan-400 shadow-md shadow-cyan-600/50',
    badgeClass: 'bg-cyan-950 text-cyan-300 border-cyan-700/40',
    activeBtn: 'bg-cyan-800 text-white border-cyan-600/50 shadow-sm'
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber',
    accent: '#f59e0b',
    badge: 'Sunset Amber Shades',
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#523310]',
      1: 'bg-[#452607] border-[#61360a] hover:border-[#7e470e]',
      2: 'bg-[#783c07] border-[#9c4f09] hover:border-[#bf610c]',
      3: 'bg-[#b86209] border-[#e0770b] hover:border-[#f58d1b]',
      4: 'bg-[#f59e0b] border-[#fbbf24] hover:border-[#fcd34d] shadow-sm shadow-amber-600/40'
    },
    hexLevels: ['#161b22', '#452607', '#783c07', '#b86209', '#f59e0b'],
    selectedRing: 'bg-amber-500 border-white ring-2 ring-amber-400 shadow-md shadow-amber-600/50',
    badgeClass: 'bg-amber-950 text-amber-300 border-amber-700/40',
    activeBtn: 'bg-amber-800 text-white border-amber-600/50 shadow-sm'
  },
  purple: {
    id: 'purple',
    name: 'Amethyst Purple',
    accent: '#b366f5',
    badge: 'Amethyst Purple Shades',
    levels: {
      0: 'bg-[#161b22] border-[#21262d] hover:border-[#43235b]',
      1: 'bg-[#341948] border-[#4b2469] hover:border-[#632f8a]',
      2: 'bg-[#58207c] border-[#762ca6] hover:border-[#9637d4]',
      3: 'bg-[#8736bf] border-[#a948ee] hover:border-[#c26df5]',
      4: 'bg-[#b366f5] border-[#c884fa] hover:border-[#dcabfc] shadow-sm shadow-purple-600/40'
    },
    hexLevels: ['#161b22', '#341948', '#58207c', '#8736bf', '#b366f5'],
    selectedRing: 'bg-purple-500 border-white ring-2 ring-purple-400 shadow-md shadow-purple-600/50',
    badgeClass: 'bg-purple-950 text-purple-300 border-purple-700/40',
    activeBtn: 'bg-purple-800 text-white border-purple-600/50 shadow-sm'
  }
};

export default function ContributionHeatmap({
  tasks,
  onSelectDate,
  selectedDate,
  onNavigateToTasks
}) {
  // Timeframe: 'year' (52 weeks), 'half' (26 weeks), 'month' (5 weeks / 35 days)
  const [timeRange, setTimeRange] = useState('year');

  // Global theme synchronized with App (with reactive local state)
  const themeContext = useTheme();
  const [themeIdState, setThemeIdState] = useState(() => {
    return localStorage.getItem('daily_task_heatmap_theme') || themeContext?.themeId || 'olive';
  });

  useEffect(() => {
    if (themeContext?.themeId) {
      setThemeIdState(themeContext.themeId);
    }
  }, [themeContext?.themeId]);

  const activeThemeId = themeIdState;

  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mobileSelectedDay, setMobileSelectedDay] = useState(null);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const scrollContainerRef = useRef(null);

  const currentTheme = HEATMAP_THEMES[activeThemeId] || HEATMAP_THEMES.olive;

  const handleSelectTheme = (newId) => {
    setThemeIdState(newId);
    if (themeContext?.setThemeId) {
      themeContext.setThemeId(newId);
    }
    localStorage.setItem('daily_task_heatmap_theme', newId);
    setShowThemePicker(false);
  };

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

  // Compute weeks & days based on selected timeRange (year=52, half=26, month=5)
  const { weeks, monthLabels, totalTasksCount, activeDaysCount, timeRangeLabel } = useMemo(() => {
    let weeksCount = 52;
    let label = 'past 365 days';

    if (timeRange === 'half') {
      weeksCount = 26;
      label = 'past 6 months';
    } else if (timeRange === 'month') {
      weeksCount = 5;
      label = 'past 30 days';
    }

    const totalDays = weeksCount * 7;
    const today = new Date();
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

      if (currentWeek.length === 1) {
        const weekMonth = cur.getMonth();
        if (weekMonth !== lastMonth) {
          const monthName = cur.toLocaleDateString('en-US', { month: 'short' });
          const lastRecorded = months[months.length - 1];
          if (!lastRecorded || (weekCols.length - lastRecorded.colIndex >= 3)) {
            months.push({ colIndex: weekCols.length, name: monthName });
            lastMonth = weekMonth;
          }
        }
      }

      if (currentWeek.length === 7) {
        weekCols.push(currentWeek);
        currentWeek = [];
      }

      cur.setDate(cur.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weekCols.push(currentWeek);
    }

    return {
      weeks: weekCols,
      monthLabels: months,
      totalTasksCount: tasksCount,
      activeDaysCount: activeDays,
      timeRangeLabel: label
    };
  }, [activityMap, timeRange]);

  // Auto-scroll to the right (most recent days) on mobile on load and view change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [timeRange]);

  // Color resolver based on completed task count and current theme
  const getThemeLevelClass = (count, isFuture, isSelected) => {
    if (isFuture) {
      return 'bg-[#12161b]/50 border-[#1f242c] opacity-40 cursor-not-allowed';
    }
    if (isSelected) {
      return currentTheme.selectedRing;
    }
    if (count === 0) {
      return currentTheme.levels[0];
    }
    if (count === 1) {
      return currentTheme.levels[1];
    }
    if (count === 2) {
      return currentTheme.levels[2];
    }
    if (count <= 4) {
      return currentTheme.levels[3];
    }
    return currentTheme.levels[4];
  };

  const handleCellClick = (day) => {
    if (day.isFuture) return;
    setMobileSelectedDay(day);
    if (onSelectDate) {
      onSelectDate(day.date === selectedDate ? null : day.date);
    }
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4 pb-3 border-b border-github-border">
        {/* Title and Active Theme Badge */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: currentTheme.accent }} />
              Activity Contribution Heatmap
            </h2>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full border font-mono transition-colors ${currentTheme.badgeClass}`}
            >
              {currentTheme.badge}
            </span>
          </div>
          <p className="text-xs text-github-muted mt-0.5">
            Visual record of daily task completions and productive streaks
          </p>
        </div>

        {/* Controls: Timeframe Selector & Theme Switcher */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-between lg:justify-end">
          {/* Theme Selector Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0d1117] border border-github-border text-xs font-medium text-github-text hover:text-white transition-colors"
              title="Select Heatmap Color Theme"
            >
              <span
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: currentTheme.accent }}
              />
              <span className="hidden sm:inline">{currentTheme.name}</span>
              <Palette className="w-3.5 h-3.5 text-github-muted ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0d1117] border border-github-border rounded-xl shadow-2xl p-2 z-50 animate-in fade-in">
                <div className="text-[10px] font-semibold text-github-muted uppercase tracking-wider px-2 py-1">
                  Color Themes
                </div>
                <div className="space-y-1">
                  {Object.values(HEATMAP_THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleSelectTheme(theme.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        activeThemeId === theme.id
                          ? 'bg-[#161b22] text-white border border-github-border'
                          : 'text-github-muted hover:text-white hover:bg-[#161b22]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: theme.accent }}
                        />
                        <span>{theme.name}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {theme.hexLevels.slice(1).map((hex, idx) => (
                          <span
                            key={idx}
                            className="w-1.5 h-3 rounded-[1px]"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Time Range Selector (1 Year, Last 6 Months, 1 Month) */}
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-github-border text-xs">
            {/* 1 Year */}
            <button
              onClick={() => setTimeRange('year')}
              className={`px-2.5 sm:px-3 py-1 rounded-md font-medium transition-all ${
                timeRange === 'year'
                  ? currentTheme.activeBtn
                  : 'text-github-muted hover:text-white'
              }`}
            >
              1 Year
            </button>

            {/* Last 6 Months */}
            <button
              onClick={() => setTimeRange('half')}
              className={`px-2.5 sm:px-3 py-1 rounded-md font-medium transition-all ${
                timeRange === 'half'
                  ? currentTheme.activeBtn
                  : 'text-github-muted hover:text-white'
              }`}
            >
              Last 6 Months
            </button>

            {/* 1 Month */}
            <button
              onClick={() => setTimeRange('month')}
              className={`px-2.5 sm:px-3 py-1 rounded-md font-medium transition-all ${
                timeRange === 'month'
                  ? currentTheme.activeBtn
                  : 'text-github-muted hover:text-white'
              }`}
            >
              1 Month
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Hint for mobile (when year or 6 months view is active) */}
      {timeRange !== 'month' && (
        <div className="md:hidden flex items-center justify-between text-[11px] text-github-muted mb-2 px-2.5 py-1.5 rounded-lg bg-[#0d1117] border border-github-border/70 select-none">
          <span className="flex items-center gap-1 font-medium">
            <span>Swipe left to explore earlier weeks</span>
          </span>
          <span className="font-mono font-semibold" style={{ color: currentTheme.accent }}>
            {timeRange === 'year' ? '52 Weeks' : '26 Weeks'}
          </span>
        </div>
      )}

      {/* 1 Month Dedicated Responsive View (Optimized for Mobile Screens) */}
      {timeRange === 'month' ? (
        <div className="py-2">
          <div className="text-xs text-github-muted mb-3 flex items-center justify-between">
            <span>Focused 30-Day Activity Grid</span>
            <span className="font-mono text-[11px] text-white">
              {weeks.length} Weeks • Touch friendly
            </span>
          </div>

          {/* Clean 5-Week Responsive Table */}
          <div className="flex flex-col gap-2 max-w-xl mx-auto">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-[11px] font-mono text-github-muted pb-1 border-b border-github-border">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Week rows with larger tap targets */}
            <div className="space-y-1.5 sm:space-y-2">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {week.map((day, dIdx) => {
                    const isSelected = selectedDate === day.date || mobileSelectedDay?.date === day.date;
                    const levelClass = getThemeLevelClass(day.count, day.isFuture, isSelected);

                    return (
                      <button
                        key={dIdx}
                        onClick={() => handleCellClick(day)}
                        onMouseEnter={(e) => handleCellHover(e, day)}
                        onMouseLeave={handleCellLeave}
                        disabled={day.isFuture}
                        className={`aspect-square min-h-[38px] sm:min-h-[46px] rounded-lg border flex flex-col items-center justify-center p-1 transition-all ${levelClass} focus:outline-none`}
                        aria-label={`${day.formattedDate}: ${day.count} tasks completed`}
                      >
                        <span className="text-[11px] font-mono leading-none font-medium">
                          {day.dayOfMonth}
                        </span>
                        {day.count > 0 && !day.isFuture && (
                          <span className="text-[9px] font-bold font-mono mt-0.5 opacity-90">
                            +{day.count}
                          </span>
                        )}
                        {day.isToday && (
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-0.5 animate-pulse"
                            style={{ backgroundColor: currentTheme.accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Multi-week Horizontal Matrix View (Year / 6 Months - Full Box Width on Desktop, Spacious & Touch-Friendly on Mobile) */
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto pb-3 scrollbar-thin -webkit-overflow-scrolling-touch rounded-lg"
        >
          <div
            className={`flex flex-col ${
              timeRange === 'year'
                ? 'min-w-[760px] md:min-w-full w-full'
                : 'min-w-[420px] md:min-w-full w-full'
            }`}
          >
            {/* Month labels header matching fractional week positions */}
            <div className="flex text-[10px] sm:text-[11px] text-github-muted font-mono mb-2 pl-6 sm:pl-7 h-4 relative w-full select-none">
              {monthLabels.map((m, idx) => (
                <span
                  key={idx}
                  className="absolute transform -translate-x-1 whitespace-nowrap font-medium"
                  style={{ left: `calc(1.5rem + ${(m.colIndex / weeks.length) * 100}%)` }}
                >
                  {m.name}
                </span>
              ))}
            </div>

            <div className="w-full flex items-stretch gap-1 sm:gap-2">
              {/* Day of Week labels (Sun, Mon, Tue, Wed, Thu, Fri, Sat) aligned 1:1 with cell rows */}
              <div
                className="grid grid-rows-7 text-[10px] text-github-muted font-mono w-5 sm:w-6 select-none flex-shrink-0"
                style={{ rowGap: timeRange === 'year' ? '2.5px' : '3.5px' }}
              >
                <div className="flex items-center justify-center invisible select-none">S</div>
                <div className="flex items-center justify-center leading-none">Mon</div>
                <div className="flex items-center justify-center invisible select-none">T</div>
                <div className="flex items-center justify-center leading-none">Wed</div>
                <div className="flex items-center justify-center invisible select-none">T</div>
                <div className="flex items-center justify-center leading-none">Fri</div>
                <div className="flex items-center justify-center invisible select-none">S</div>
              </div>

              {/* Weeks Columns: Stretches to fill 100% of the box on desktop, spacious on mobile */}
              <div
                className="flex-1 w-full grid items-stretch"
                style={{
                  gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
                  columnGap: timeRange === 'year' ? '2.5px' : '3.5px'
                }}
              >
                {weeks.map((week, wIdx) => (
                  <div
                    key={wIdx}
                    className="grid grid-rows-7 w-full"
                    style={{ rowGap: timeRange === 'year' ? '2.5px' : '3.5px' }}
                  >
                    {week.map((day, dIdx) => {
                      const isSelected = selectedDate === day.date || mobileSelectedDay?.date === day.date;
                      const levelClass = getThemeLevelClass(day.count, day.isFuture, isSelected);

                      return (
                        <button
                          key={dIdx}
                          onClick={() => handleCellClick(day)}
                          onMouseEnter={(e) => handleCellHover(e, day)}
                          onMouseLeave={handleCellLeave}
                          disabled={day.isFuture}
                          className={`w-full aspect-square min-w-[10px] min-h-[10px] rounded-[2px] sm:rounded-[3px] border heatmap-cell ${levelClass} focus:outline-none transition-transform hover:scale-110 active:scale-95`}
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
      )}

      {/* Mobile Active Day Detail Drawer */}
      {mobileSelectedDay && (
        <div className="sm:hidden mt-3 p-3.5 rounded-xl bg-[#0d1117] border border-github-border flex flex-col gap-2.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-white">
              {mobileSelectedDay.formattedDate}
            </span>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded border"
              style={{
                backgroundColor: '#161b22',
                color: currentTheme.accent,
                borderColor: currentTheme.accent + '40'
              }}
            >
              {mobileSelectedDay.count} task{mobileSelectedDay.count === 1 ? '' : 's'} completed
            </span>
          </div>

          {mobileSelectedDay.tasks.length > 0 && (
            <ul className="text-[11px] text-github-muted space-y-1 max-h-24 overflow-y-auto">
              {mobileSelectedDay.tasks.map((task, i) => (
                <li key={i} className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: currentTheme.accent }}
                  />
                  <span className="truncate text-github-text">{task}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-github-border text-[11px]">
            <button
              onClick={() => {
                if (onNavigateToTasks) onNavigateToTasks();
              }}
              className="font-medium hover:underline flex items-center gap-1"
              style={{ color: currentTheme.accent }}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Manage tasks for this date</span>
            </button>
            <button
              onClick={() => setMobileSelectedDay(null)}
              className="text-github-muted hover:text-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Footer: Summary Stats & Color Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-github-border text-xs text-github-muted">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-white font-semibold font-mono">{totalTasksCount}</span> completed tasks in {timeRangeLabel}
          </div>
          <span className="text-github-border hidden sm:inline">•</span>
          <div>
            <span className="text-white font-semibold font-mono">{activeDaysCount}</span> active days
          </div>
          {selectedDate && (
            <>
              <span className="text-github-border">•</span>
              <button
                onClick={() => onSelectDate(null)}
                className="hover:underline font-medium"
                style={{ color: currentTheme.accent }}
              >
                Clear date filter ({selectedDate})
              </button>
            </>
          )}
        </div>

        {/* Legend showing active theme color levels */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-[11px]">Less</span>
          {currentTheme.hexLevels.map((hex, idx) => (
            <div
              key={idx}
              className="w-3 h-3 rounded-[2px] border border-white/10"
              style={{ backgroundColor: hex }}
              title={`Level ${idx}: ${idx === 0 ? '0 tasks' : idx === 4 ? '5+ tasks' : `${idx} tasks`}`}
            />
          ))}
          <span className="text-[11px]">More</span>
        </div>
      </div>

      {/* Floating Hover Tooltip (Desktop) */}
      {hoveredDay && (
        <div
          className="hidden sm:block fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-[#0d1117]/95 border border-github-borderLight text-white px-3 py-2 rounded-lg text-xs shadow-xl backdrop-blur-md max-w-xs transition-opacity duration-150"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="font-semibold text-white flex items-center justify-between gap-2 border-b border-github-border pb-1 mb-1">
            <span>{hoveredDay.formattedDate}</span>
            {hoveredDay.isToday && (
              <span
                className="text-[10px] uppercase px-1.5 py-0.2 rounded font-bold border"
                style={{
                  backgroundColor: currentTheme.hexLevels[1],
                  color: currentTheme.accent,
                  borderColor: currentTheme.accent + '40'
                }}
              >
                Today
              </span>
            )}
          </div>
          <div className="font-medium" style={{ color: currentTheme.accent }}>
            {hoveredDay.count === 0
              ? 'No tasks completed'
              : `${hoveredDay.count} task${hoveredDay.count > 1 ? 's' : ''} completed`}
          </div>
          {hoveredDay.tasks && hoveredDay.tasks.length > 0 && (
            <ul className="mt-1 space-y-0.5 text-github-muted text-[11px] max-h-24 overflow-y-auto">
              {hoveredDay.tasks.slice(0, 4).map((taskTitle, idx) => (
                <li key={idx} className="truncate flex items-center gap-1.5">
                  <span
                    className="w-1 h-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: currentTheme.accent }}
                  />
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
