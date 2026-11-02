import React, { useState, useMemo } from 'react';
import { storageService } from '../../services/storageService';
import { formatDateStr } from '../../data/initialData';

export default function DailyTasksWidget() {
  const [allTasks, setAllTasks] = useState(() => storageService.getTasks());
  const [inputText, setInputText] = useState('');
  const [dateSelection, setDateSelection] = useState('Today');
  const [customDate, setCustomDate] = useState('');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [category, setCategory] = useState('Coding');
  const [priority, setPriority] = useState('Med');
  const [challengeId, setChallengeId] = useState('None');
  const [notification, setNotification] = useState('');

  const todayStr = formatDateStr(new Date());

  // Challenges for linking
  const challenges = useMemo(() => storageService.getChallenges(), []);

  // Filter ONLY today's tasks
  const todayTasks = useMemo(() => {
    return allTasks.filter((t) => {
      // If task has date, must match today; if no date, defaults to today
      return !t.date || t.date === todayStr;
    });
  }, [allTasks, todayStr]);

  // Sort so active tasks are at the top, and completed tasks sink to the bottom
  const sortedTasks = useMemo(() => {
    const active = todayTasks.filter((t) => !t.completed);
    const completed = todayTasks.filter((t) => t.completed);
    return [...active, ...completed];
  }, [todayTasks]);

  const leftCount = useMemo(() => {
    return todayTasks.filter((t) => !t.completed).length;
  }, [todayTasks]);

  // Toggle complete
  const toggleTask = (taskId) => {
    const updated = allTasks.map((t) => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });
    setAllTasks(updated);
    storageService.saveTasks(updated);
  };

  // Add Task
  const handleAddTask = (e) => {
    if (e) e.preventDefault();
    const title = inputText.trim();
    if (!title) return;

    let targetDate = todayStr;
    if (dateSelection === 'Tomorrow') {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      targetDate = formatDateStr(d);
    } else if (dateSelection === 'DayAfter') {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      targetDate = formatDateStr(d);
    } else if (dateSelection === 'Custom' && customDate) {
      targetDate = customDate;
    }

    const newTask = {
      id: 'task_' + Date.now(),
      title,
      category,
      priority: priority.toLowerCase(),
      date: targetDate,
      challengeId: challengeId === 'None' ? null : challengeId,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newTask, ...allTasks];
    setAllTasks(updated);
    storageService.saveTasks(updated);

    setInputText('');
    if (targetDate !== todayStr) {
      setNotification(`Scheduled for ${dateSelection === 'Custom' ? targetDate : dateSelection}`);
      setTimeout(() => setNotification(''), 2500);
    }
  };

  const prioStyles = {
    high: 'bg-rose-500/20 text-rose-300 border border-rose-400/30 font-semibold',
    med: 'bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold',
    low: 'bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold'
  };

  const catColors = {
    Coding: 'bg-blue-500/25 text-blue-300 border border-blue-400/20',
    Study: 'bg-purple-500/25 text-purple-300 border border-purple-400/20',
    Health: 'bg-amber-500/25 text-amber-300 border border-amber-400/20',
    Work: 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/20'
  };

  const closeWidget = () => {
    if (window.electronAPI?.closeWidget) {
      window.electronAPI.closeWidget('daily-tasks');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-3 select-none bg-transparent">
      <div className="w-full h-full rounded-3xl p-4 glass-card flex flex-col transition-all shadow-2xl relative border border-white/20 overflow-hidden box-border">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 flex-shrink-0 app-drag-region">
          <div className="flex items-center gap-2 app-no-drag">
            <button
              onClick={closeWidget}
              className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 border border-rose-600/60 transition-transform active:scale-90"
              title="Close Widget"
            />
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white drop-shadow-sm ml-1">
              Daily Tasks
            </h4>
          </div>

          <div className="app-no-drag">
            {notification ? (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40 animate-pulse">
                {notification}
              </span>
            ) : (
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border transition-colors ${
                  leftCount === 0
                    ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40'
                    : 'bg-lime-500/20 text-lime-300 border-lime-400/30'
                }`}
              >
                {leftCount === 0 ? 'All Done' : `${leftCount} Left`}
              </span>
            )}
          </div>
        </div>

        {/* Task List (ONLY Today's Tasks, completed sink to bottom) */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pb-1 pr-1 app-no-drag">
          {sortedTasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-white/40 text-xs py-8">
              <p>No tasks for today.</p>
              <p className="text-[10px] text-white/30 mt-1">Add one using the form below!</p>
            </div>
          ) : (
            sortedTasks.map((t) => {
              const pClass = prioStyles[t.priority] || prioStyles.med;
              const cClass = catColors[t.category] || 'bg-cyan-500/25 text-cyan-300';
              return (
                <div
                  key={t.id}
                  className={`flex items-start gap-2.5 p-2 rounded-2xl glass-item hover:bg-white/10 transition-all ${
                    t.completed ? 'opacity-85' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(t.completed)}
                    onChange={() => toggleTask(t.id)}
                    className="mt-1 w-4 h-4 rounded accent-lime-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs truncate font-medium ${
                        t.completed ? 'line-through text-white/40' : 'text-white/95'
                      }`}
                    >
                      {t.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] flex-wrap">
                      <span className={`px-1.5 py-0.2 rounded capitalize ${pClass}`}>
                        {t.priority || 'Med'}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded font-medium ${cClass}`}>
                        {t.category || 'General'}
                      </span>
                      {t.challengeId ? (
                        <span className="px-1.5 py-0.2 rounded bg-lime-500/20 text-lime-300 border border-lime-500/30 font-semibold truncate max-w-[120px]">
                          Challenge
                        </span>
                      ) : (
                        <span className="text-white/45 italic font-medium">Extra (None)</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Snug Quick-Add Section */}
        <div className="pt-2 border-t border-white/10 space-y-1.5 w-full box-border flex-shrink-0 app-no-drag">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="+ Add a task for today..."
            className="w-full box-border bg-white/10 hover:bg-white/15 focus:bg-white/20 text-xs text-white placeholder-white/50 px-3 py-1.5 rounded-xl border border-white/20 focus:border-lime-400 focus:outline-none transition-all shadow-inner"
          />

          <div className="grid grid-cols-5 gap-1.5 w-full">
            {/* Date Select: Today (default), Tomorrow, Day After, Custom */}
            <select
              value={dateSelection}
              onChange={(e) => {
                setDateSelection(e.target.value);
                setShowCustomDate(e.target.value === 'Custom');
              }}
              className="bg-black/50 text-[10px] text-white/90 px-1 py-1.5 rounded-xl border border-white/15 focus:outline-none cursor-pointer truncate font-medium"
            >
              <option value="Today" className="bg-slate-900 text-lime-300 font-bold">Today</option>
              <option value="Tomorrow" className="bg-slate-900 text-white">Tomorrow</option>
              <option value="DayAfter" className="bg-slate-900 text-white">Day After</option>
              <option value="Custom" className="bg-slate-900 text-amber-300 font-semibold">Custom...</option>
            </select>

            {/* Category Select */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black/50 text-[10px] text-white/90 px-1 py-1.5 rounded-xl border border-white/15 focus:outline-none cursor-pointer truncate"
            >
              <option value="Coding" className="bg-slate-900 text-white">Coding</option>
              <option value="Study" className="bg-slate-900 text-white">Study</option>
              <option value="Health" className="bg-slate-900 text-white">Health</option>
              <option value="Work" className="bg-slate-900 text-white">Work</option>
            </select>

            {/* Priority Select */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-black/50 text-[10px] text-white/90 px-1 py-1.5 rounded-xl border border-white/15 focus:outline-none cursor-pointer truncate font-medium"
            >
              <option value="High" className="bg-slate-900 text-rose-300">High</option>
              <option value="Med" className="bg-slate-900 text-amber-300">Med</option>
              <option value="Low" className="bg-slate-900 text-sky-300">Low</option>
            </select>

            {/* Challenge Select */}
            <select
              value={challengeId}
              onChange={(e) => setChallengeId(e.target.value)}
              className="bg-black/50 text-[10px] text-white/90 px-1 py-1.5 rounded-xl border border-white/15 focus:outline-none cursor-pointer truncate"
            >
              <option value="None" className="bg-slate-900 text-white/60">No Challenge</option>
              {challenges.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.title}
                </option>
              ))}
            </select>

            {/* Submit Button */}
            <button
              onClick={handleAddTask}
              className="py-1.5 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-black font-extrabold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
            >
              Add +
            </button>
          </div>

          {/* Custom Date Input */}
          {showCustomDate && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[10px] text-white/60 font-medium">Pick Date:</span>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="flex-1 bg-black/60 text-white text-[10px] px-2 py-1 rounded-xl border border-amber-400/40 focus:outline-none cursor-pointer"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
