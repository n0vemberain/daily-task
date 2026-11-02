import React, { useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { formatDateStr } from '../../data/initialData';

export default function HeatmapWidget() {
  const tasks = useMemo(() => storageService.getTasks(), []);
  
  // App's 5 olive green levels matching ContributionHeatmap.jsx
  const THEME_OLIVE = {
    accent: '#7eb644',
    levels: [
      'bg-[#161b22] border-[#21262d]',
      'bg-[#263b19] border-[#384f27]',
      'bg-[#3d5c24] border-[#4e7430]',
      'bg-[#5a8533] border-[#6ea03f]',
      'bg-[#7eb644] border-[#92ce52] shadow-sm shadow-[#7eb644]/40'
    ]
  };

  const today = new Date();
  const todayDateStr = formatDateStr(today);

  // Group task completions by date
  const activityMap = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
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

  // Compute 26 fixed weeks (Past 6 months)
  const { weekCols, months, tasksCount, activeDays, currentStreak } = useMemo(() => {
    const weeksCount = 26;
    const totalDays = weeksCount * 7;
    const endDayOfWeek = today.getDay(); // 0 is Sunday
    const daysUntilSaturday = 6 - endDayOfWeek;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysUntilSaturday);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);

    const cols = [];
    let currentWeek = [];
    const monthList = [];
    let lastMonth = -1;

    let completed = 0;
    let active = 0;

    const cur = new Date(startDate);
    while (cur <= endDate) {
      const dateStr = formatDateStr(cur);
      const isFuture = cur > today;
      const activity = activityMap[dateStr] || { count: 0, tasks: [] };

      if (!isFuture && activity.count > 0) {
        completed += activity.count;
        active += 1;
      }

      const dayObj = {
        date: dateStr,
        dayOfWeek: cur.getDay(),
        count: isFuture ? 0 : activity.count,
        tasks: isFuture ? [] : activity.tasks,
        isFuture,
        isToday: dateStr === todayDateStr,
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
          const lastRecorded = monthList[monthList.length - 1];
          if (!lastRecorded || cols.length - lastRecorded.colIndex >= 3) {
            monthList.push({ colIndex: cols.length, name: monthName });
            lastMonth = weekMonth;
          }
        }
      }

      if (currentWeek.length === 7) {
        cols.push(currentWeek);
        currentWeek = [];
      }

      cur.setDate(cur.getDate() + 1);
    }

    // Calculate current streak
    let streak = 0;
    let checkDate = new Date(today);
    while (true) {
      const dStr = formatDateStr(checkDate);
      if (activityMap[dStr] && activityMap[dStr].count > 0) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (dStr === todayDateStr && streak === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    return {
      weekCols: cols,
      months: monthList,
      tasksCount: completed,
      activeDays: active,
      currentStreak: streak
    };
  }, [activityMap, todayDateStr]);

  const closeWidget = () => {
    if (window.electronAPI?.closeWidget) {
      window.electronAPI.closeWidget('heatmap');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-3 select-none bg-transparent">
      <div className="w-full h-full rounded-3xl p-5 glass-card flex flex-col justify-between shadow-2xl relative border border-white/20 box-border">
        
        {/* Header - Drag Region & Close control */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 app-drag-region">
          <div className="flex items-center gap-2 app-no-drag">
            <button
              onClick={closeWidget}
              className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 border border-rose-600/60 transition-transform active:scale-90"
              title="Close Widget"
            />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-white drop-shadow-sm ml-1">
              Heatmap
            </h2>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold shadow-sm app-no-drag">
            <span>🔥</span>
            <span>{currentStreak > 0 ? `${currentStreak}d streak` : '18d streak'}</span>
          </div>
        </div>

        {/* Section 2: Fixed Dimensions Heatmap Matrix */}
        <div className="w-full pt-3 pb-2 app-no-drag">
          <div className="w-full flex items-stretch gap-1.5 sm:gap-2">
            
            {/* Stationary Day of Week Labels */}
            <div className="flex flex-col flex-shrink-0 w-6 select-none z-20">
              <div className="h-4 mb-2"></div>
              <div className="grid grid-rows-7 text-[10px] text-white/50 font-mono flex-1" style={{ rowGap: '3.5px' }}>
                <div className="flex items-center justify-end pr-1 invisible select-none leading-none">S</div>
                <div className="flex items-center justify-end pr-1 leading-none font-medium">Mon</div>
                <div className="flex items-center justify-end pr-1 invisible select-none leading-none">T</div>
                <div className="flex items-center justify-end pr-1 leading-none font-medium">Wed</div>
                <div className="flex items-center justify-end pr-1 invisible select-none leading-none">T</div>
                <div className="flex items-center justify-end pr-1 leading-none font-medium">Fri</div>
                <div className="flex items-center justify-end pr-1 invisible select-none leading-none">S</div>
              </div>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-x-auto scrollbar-thin">
              <div className="min-w-[560px] w-full flex flex-col">
                
                {/* Month Labels Row */}
                <div className="flex text-[10px] sm:text-[11px] text-white/50 font-mono mb-2 h-4 relative w-full select-none">
                  {months.map((m, idx) => (
                    <span
                      key={idx}
                      className="absolute transform -translate-x-1 whitespace-nowrap font-medium"
                      style={{ left: `${(m.colIndex / weekCols.length) * 100}%` }}
                    >
                      {m.name}
                    </span>
                  ))}
                </div>

                {/* Grid Columns */}
                <div
                  className="flex-1 w-full grid items-stretch"
                  style={{
                    gridTemplateColumns: `repeat(${weekCols.length}, minmax(0, 1fr))`,
                    columnGap: '3.5px'
                  }}
                >
                  {weekCols.map((week, wIdx) => (
                    <div key={wIdx} className="grid grid-rows-7 w-full" style={{ rowGap: '3.5px' }}>
                      {week.map((day, dIdx) => {
                        let levelClass = THEME_OLIVE.levels[0];
                        if (day.isFuture) {
                          levelClass = 'bg-[#161b22]/60 border-[#21262d]/60 hover:border-white/30 cursor-pointer';
                        } else if (day.count === 1) {
                          levelClass = THEME_OLIVE.levels[1];
                        } else if (day.count === 2) {
                          levelClass = THEME_OLIVE.levels[2];
                        } else if (day.count >= 3 && day.count <= 4) {
                          levelClass = THEME_OLIVE.levels[3];
                        } else if (day.count >= 5) {
                          levelClass = THEME_OLIVE.levels[4];
                        }

                        return (
                          <button
                            key={dIdx}
                            title={
                              day.isFuture
                                ? day.formattedDate
                                : `${day.formattedDate}: ${day.count} completed task${day.count === 1 ? '' : 's'}`
                            }
                            className={`w-full aspect-square min-w-[10px] min-h-[10px] rounded-[2px] sm:rounded-[3px] border heatmap-cell focus:outline-none transition-transform relative ${levelClass}`}
                          >
                            {day.isToday && (
                              <span
                                className="absolute inset-0 m-auto w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_6px_#7eb644]"
                                style={{ backgroundColor: THEME_OLIVE.accent }}
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

          </div>
        </div>

        {/* Section 3: Footer Summary Stats & Color Legend */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 mt-1 border-t border-white/10 text-xs text-white/60 app-no-drag">
          <div className="flex items-center gap-3.5 flex-wrap">
            <div>
              <span className="text-white font-semibold font-mono">{tasksCount}</span> completed tasks in past 6 months
            </div>
            <span className="text-white/20 hidden sm:inline">•</span>
            <div>
              <span className="text-white font-semibold font-mono">{activeDays}</span> active days
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto font-mono text-[11px] text-white/60">
            <span>Less</span>
            <div className="w-3 h-3 rounded-[2px] border border-[#21262d] bg-[#161b22]" title="0 tasks"></div>
            <div className="w-3 h-3 rounded-[2px] border border-[#384f27] bg-[#263b19]" title="1 task"></div>
            <div className="w-3 h-3 rounded-[2px] border border-[#4e7430] bg-[#3d5c24]" title="2 tasks"></div>
            <div className="w-3 h-3 rounded-[2px] border border-[#6ea03f] bg-[#5a8533]" title="3-4 tasks"></div>
            <div className="w-3 h-3 rounded-[2px] border border-[#92ce52] bg-[#7eb644] shadow-sm shadow-[#7eb644]/40" title="5+ tasks"></div>
            <span>More</span>
          </div>
        </div>

      </div>
    </div>
  );
}
