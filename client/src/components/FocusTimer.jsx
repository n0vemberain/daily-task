import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3,
  Flame,
  Award,
  Plus,
  Trash2,
  Tag,
  BookOpen,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatDateStr } from '../data/initialData';
import { soundEffects } from '../utils/audioFeedback';
import { useTheme } from '../context/ThemeContext';

export default function FocusTimer({
  sessions = [],
  onAddSession,
  onDeleteSession
}) {
  const { theme } = useTheme();

  // Presets in minutes
  const presets = [10, 15, 20, 25, 30, 45, 60];

  // Timer configuration
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [customMinutes, setCustomMinutes] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [sessionCategory, setSessionCategory] = useState('Study');
  const [sessionLabel, setSessionLabel] = useState('');

  // Running Timer State
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completionAlert, setCompletionAlert] = useState(null);

  // Manual Offline Log Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualDuration, setManualDuration] = useState(30);
  const [manualDate, setManualDate] = useState(() => formatDateStr(new Date()));
  const [manualCategory, setManualCategory] = useState('Study');
  const [manualNote, setManualNote] = useState('');

  const timerRef = useRef(null);

  // Update timer remaining when preset or custom duration changes in idle mode
  useEffect(() => {
    if (!isActive && !isPaused) {
      const minutes = isCustomMode && parseInt(customMinutes, 10) > 0
        ? parseInt(customMinutes, 10)
        : selectedMinutes;
      setTimeLeftSeconds(minutes * 60);
      setTotalSessionSeconds(minutes * 60);
    }
  }, [selectedMinutes, customMinutes, isCustomMode, isActive, isPaused]);

  // Timer Tick Interval
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, totalSessionSeconds, sessionCategory, sessionLabel]);

  // Sound & Celebration on Complete
  const handleTimerComplete = () => {
    setIsActive(false);
    setIsPaused(false);
    soundEffects.playCelebration();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [theme.accent, theme.accentLight, '#ffffff']
      });
    } catch (e) {}

    const durationMinutes = Math.round(totalSessionSeconds / 60) || 1;
    const newSession = {
      id: `ts-${Date.now()}`,
      durationMinutes,
      date: formatDateStr(new Date()),
      timestamp: new Date().toISOString(),
      category: sessionCategory || 'Study',
      label: sessionLabel.trim() || 'Focus Session'
    };

    if (onAddSession) {
      onAddSession(newSession);
    }

    setCompletionAlert({
      duration: durationMinutes,
      category: sessionCategory
    });
    setTimeout(() => setCompletionAlert(null), 5000);

    // Reset timer to current duration
    setTimeLeftSeconds(totalSessionSeconds);
  };

  // Start Timer
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    soundEffects.playSuccess();
  };

  // Pause Timer
  const handlePause = () => {
    setIsPaused(true);
  };

  // Resume Timer
  const handleResume = () => {
    setIsPaused(false);
    soundEffects.playSuccess();
  };

  // Reset Timer
  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const minutes = isCustomMode && parseInt(customMinutes, 10) > 0
      ? parseInt(customMinutes, 10)
      : selectedMinutes;
    setTimeLeftSeconds(minutes * 60);
  };

  // Early Finish & Log
  const handleFinishEarly = () => {
    const elapsedSeconds = totalSessionSeconds - timeLeftSeconds;
    const elapsedMinutes = Math.round(elapsedSeconds / 60);

    if (elapsedMinutes >= 1) {
      const newSession = {
        id: `ts-${Date.now()}`,
        durationMinutes: elapsedMinutes,
        date: formatDateStr(new Date()),
        timestamp: new Date().toISOString(),
        category: sessionCategory || 'Study',
        label: sessionLabel.trim() || 'Completed Focus'
      };
      if (onAddSession) {
        onAddSession(newSession);
      }
      soundEffects.playSuccess();
      setCompletionAlert({
        duration: elapsedMinutes,
        category: sessionCategory
      });
      setTimeout(() => setCompletionAlert(null), 4000);
    }

    handleReset();
  };

  // Manual Session Submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    const duration = parseInt(manualDuration, 10);
    if (!duration || duration <= 0) return;

    const newSession = {
      id: `ts-${Date.now()}`,
      durationMinutes: duration,
      date: manualDate || formatDateStr(new Date()),
      timestamp: new Date().toISOString(),
      category: manualCategory || 'Study',
      label: manualNote.trim() || 'Offline Study'
    };

    if (onAddSession) {
      onAddSession(newSession);
    }
    soundEffects.playSuccess();
    setIsManualModalOpen(false);
    setManualNote('');
  };

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Format minutes into clean human string (e.g. "2h 15m" or "45m")
  const formatDurationDisplay = (totalMins) => {
    if (!totalMins || totalMins === 0) return '0m';
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  // Current date constants for calculations
  const todayStr = formatDateStr(new Date());
  const now = new Date();
  const currentYearStr = String(now.getFullYear());
  const currentYearMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // 7 days ago timestamp
  const sevenDaysAgoDate = new Date();
  sevenDaysAgoDate.setDate(now.getDate() - 7);
  const sevenDaysAgoStr = formatDateStr(sevenDaysAgoDate);

  // Aggregated Analytics: Per Day, Per Week, Per Month, Per Year
  const stats = useMemo(() => {
    let dayMinutes = 0;
    let dayCount = 0;

    let weekMinutes = 0;
    let weekCount = 0;

    let monthMinutes = 0;
    let monthCount = 0;

    let yearMinutes = 0;
    let yearCount = 0;

    sessions.forEach((s) => {
      const sDate = s.date || '';
      const mins = Number(s.durationMinutes) || 0;

      // Per Day (Today)
      if (sDate === todayStr) {
        dayMinutes += mins;
        dayCount += 1;
      }

      // Per Week (Past 7 Days)
      if (sDate >= sevenDaysAgoStr && sDate <= todayStr) {
        weekMinutes += mins;
        weekCount += 1;
      }

      // Per Month (This Month)
      if (sDate.startsWith(currentYearMonthStr)) {
        monthMinutes += mins;
        monthCount += 1;
      }

      // Per Year (This Year)
      if (sDate.startsWith(currentYearStr)) {
        yearMinutes += mins;
        yearCount += 1;
      }
    });

    return {
      day: { minutes: dayMinutes, count: dayCount },
      week: { minutes: weekMinutes, count: weekCount },
      month: { minutes: monthMinutes, count: monthCount },
      year: { minutes: yearMinutes, count: yearCount }
    };
  }, [sessions, todayStr, sevenDaysAgoStr, currentYearMonthStr, currentYearStr]);

  // Calculate Progress Percentage for Circle / Bar
  const progressPercent = totalSessionSeconds > 0
    ? Math.max(0, Math.min(100, Math.round(((totalSessionSeconds - timeLeftSeconds) / totalSessionSeconds) * 100)))
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Timer className="w-5 h-5" style={{ color: theme.accent }} />
              Study &amp; Focus Timer
            </h2>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-mono border"
              style={{
                backgroundColor: theme.accentDark,
                color: theme.accentLight,
                borderColor: theme.accent + '40'
              }}
            >
              Time Tracking &amp; Analytics
            </span>
          </div>
          <p className="text-xs text-github-muted mt-1">
            Track customizable study sessions with daily, weekly, monthly, and yearly aggregated records
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="w-4 h-4" style={{ color: theme.accent }} />
          <span>Log Offline Study</span>
        </button>
      </div>

      {/* Completion Toast Notification */}
      {completionAlert && (
        <div
          className="p-4 rounded-xl border flex items-center justify-between gap-3 shadow-lg animate-in fade-in"
          style={{
            backgroundColor: theme.accentDark,
            borderColor: theme.accent + '60',
            color: '#ffffff'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10">
              <Award className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                Great job! Focus session completed.
              </p>
              <p className="text-[11px] text-github-muted font-mono mt-0.5" style={{ color: theme.accentLight }}>
                Logged {completionAlert.duration} minutes of {completionAlert.category} to your dashboard.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCompletionAlert(null)}
            className="text-white/70 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Aggregated Metric Cards: Per Day, Per Week, Per Month, Per Year */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Per Day (Today) */}
        <div className="bg-[#161b22] border border-github-border rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-github-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Today (Day)
            </span>
            <Clock className="w-4 h-4" style={{ color: theme.accent }} />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {formatDurationDisplay(stats.day.minutes)}
          </div>
          <div className="text-[11px] text-github-muted mt-1 flex items-center gap-1">
            <span>{stats.day.count} {stats.day.count === 1 ? 'session' : 'sessions'} today</span>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ backgroundColor: theme.accent }}
          />
        </div>

        {/* Metric 2: Per Week (This Week) */}
        <div className="bg-[#161b22] border border-github-border rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-github-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              This Week
            </span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {formatDurationDisplay(stats.week.minutes)}
          </div>
          <div className="text-[11px] text-github-muted mt-1 flex items-center gap-1">
            <span>Past 7 days total</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Metric 3: Per Month (This Month) */}
        <div className="bg-[#161b22] border border-github-border rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-github-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              This Month
            </span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {formatDurationDisplay(stats.month.minutes)}
          </div>
          <div className="text-[11px] text-github-muted mt-1 flex items-center gap-1">
            <span>{stats.month.count} sessions this month</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500" />
        </div>

        {/* Metric 4: Per Year (This Year) */}
        <div className="bg-[#161b22] border border-github-border rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-github-muted mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              This Year ({currentYearStr})
            </span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {formatDurationDisplay(stats.year.minutes)}
          </div>
          <div className="text-[11px] text-github-muted mt-1 flex items-center gap-1">
            <span>Annual study cumulative</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>
      </div>

      {/* Main Focus Timer Card */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-6 shadow-sm">
        <div className="max-w-xl mx-auto flex flex-col items-center text-center space-y-6">
          {/* Preset Buttons */}
          <div className="w-full">
            <div className="text-xs font-semibold text-github-muted uppercase tracking-wider mb-2.5">
              Select Preset Duration (Minutes)
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {presets.map((min) => {
                const isSelected = !isCustomMode && selectedMinutes === min;
                return (
                  <button
                    key={min}
                    type="button"
                    disabled={isActive}
                    onClick={() => {
                      setIsCustomMode(false);
                      setSelectedMinutes(min);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'text-white border-white shadow-sm'
                        : 'bg-[#0d1117] text-github-muted hover:text-white border-github-border'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: theme.accent,
                            color: '#0d1117',
                            borderColor: theme.accent
                          }
                        : {}
                    }
                  >
                    {min}m
                  </button>
                );
              })}

              {/* Custom Input Toggle */}
              <button
                type="button"
                disabled={isActive}
                onClick={() => setIsCustomMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isCustomMode
                    ? 'text-white border-white shadow-sm'
                    : 'bg-[#0d1117] text-github-muted hover:text-white border-github-border'
                } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={
                  isCustomMode
                    ? {
                        backgroundColor: theme.accent,
                        color: '#0d1117',
                        borderColor: theme.accent
                      }
                    : {}
                }
              >
                Custom
              </button>
            </div>

            {/* Custom Input Field */}
            {isCustomMode && !isActive && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-28 px-3 py-1.5 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white text-center font-mono outline-none focus:border-olive-500"
                />
                <span className="text-xs text-github-muted">minutes</span>
              </div>
            )}
          </div>

          {/* Big Circular Countdown Display */}
          <div className="relative flex flex-col items-center justify-center my-2">
            <div
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 flex flex-col items-center justify-center p-6 shadow-2xl transition-all"
              style={{
                borderColor: isActive ? theme.accent : '#21262d',
                backgroundColor: '#0d1117',
                boxShadow: isActive ? `0 0 35px ${theme.accent}30` : 'none'
              }}
            >
              <span className="text-4xl sm:text-5xl font-mono font-extrabold text-white tracking-wider">
                {formatTime(timeLeftSeconds)}
              </span>
              <span
                className="text-xs uppercase font-semibold tracking-widest mt-2 px-2.5 py-0.5 rounded-full border"
                style={{
                  backgroundColor: theme.accentDark,
                  borderColor: theme.accent + '35',
                  color: theme.accentLight
                }}
              >
                {isActive ? (isPaused ? 'Paused' : 'Focus Running') : 'Ready'}
              </span>
              <span className="text-[11px] text-github-muted mt-2 font-mono">
                {progressPercent}% Complete
              </span>
            </div>
          </div>

          {/* Session Category & Description Fields */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div>
              <label className="block text-[11px] font-semibold text-github-muted uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                disabled={isActive}
                value={sessionCategory}
                onChange={(e) => setSessionCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white outline-none cursor-pointer"
              >
                <option value="Study">Study</option>
                <option value="Coding">Coding</option>
                <option value="Reading">Reading</option>
                <option value="Deep Work">Deep Work</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-github-muted uppercase tracking-wider mb-1">
                Session Topic (Optional)
              </label>
              <input
                type="text"
                disabled={isActive}
                value={sessionLabel}
                onChange={(e) => setSessionLabel(e.target.value)}
                placeholder="e.g. Algorithms Quiz, React Hooks..."
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none"
              />
            </div>
          </div>

          {/* Main Action Controls */}
          <div className="flex items-center gap-3 justify-center w-full flex-wrap pt-2">
            {!isActive ? (
              <button
                type="button"
                onClick={handleStart}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-transform hover:scale-105"
                style={{ backgroundColor: theme.accent, color: '#0d1117' }}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus Session</span>
              </button>
            ) : (
              <>
                {isPaused ? (
                  <button
                    type="button"
                    onClick={handleResume}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white shadow transition-all"
                    style={{ backgroundColor: theme.accent, color: '#0d1117' }}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePause}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleFinishEarly}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/60 transition-all"
                  title="Finish session and save completed study minutes"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Finish &amp; Save</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs bg-[#0d1117] text-github-muted hover:text-white border border-github-border transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-github-border">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: theme.accent }} />
              Recent Study Sessions ({sessions.length})
            </h3>
            <p className="text-xs text-github-muted mt-0.5">
              Logged focus time contributing to daily, weekly, and annual analytics
            </p>
          </div>
          <span className="text-xs font-mono text-github-muted hidden sm:inline">
            Total Time: {formatDurationDisplay(stats.year.minutes)}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 text-center text-github-muted text-xs">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>No study sessions recorded yet.</p>
            <p className="text-[11px] mt-0.5">Start a timer above or log an offline study session!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 15).map((session) => {
              const sId = session.id;
              return (
                <div
                  key={sId}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0d1117] border border-github-border/70 hover:border-github-border transition-all text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">
                        {session.label || 'Focus Session'}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-github-muted font-mono mt-0.5">
                        <span>{session.date}</span>
                        <span>•</span>
                        <span className="text-github-text">{session.category || 'Study'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-mono font-bold border"
                      style={{
                        backgroundColor: theme.accentDark,
                        color: theme.accentLight,
                        borderColor: theme.accent + '35'
                      }}
                    >
                      {session.durationMinutes}m
                    </span>
                    {onDeleteSession && (
                      <button
                        type="button"
                        onClick={() => onDeleteSession(sId)}
                        className="p-1 text-github-muted hover:text-red-400 rounded transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Offline Session Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-sm shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-github-border">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4" style={{ color: theme.accent }} />
                Log Offline Study Session
              </h3>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-github-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-github-muted mb-1">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="720"
                  required
                  value={manualDuration}
                  onChange={(e) => setManualDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-github-muted mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-github-muted mb-1">
                  Category
                </label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-white outline-none"
                >
                  <option value="Study">Study</option>
                  <option value="Coding">Coding</option>
                  <option value="Reading">Reading</option>
                  <option value="Deep Work">Deep Work</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-github-muted mb-1">
                  Topic / Note
                </label>
                <input
                  type="text"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  placeholder="e.g. Read textbook chapter 5"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-white placeholder-github-muted outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-github-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow"
                  style={{ backgroundColor: theme.accent, color: '#0d1117' }}
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
