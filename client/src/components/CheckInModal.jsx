import React, { useState, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Clock,
  CheckSquare,
  Circle,
  Tag,
  Lock,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/audioFeedback';
import { useTheme } from '../context/ThemeContext';
import { formatDateStr } from '../data/initialData';
import PasswordPromptModal from './PasswordPromptModal';

export default function CheckInModal({
  isOpen,
  onClose,
  challenge,
  dayItem,
  tasks = [],
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSaveCheckIn,
  userProfile
}) {
  const { theme } = useTheme();
  const todayStr = formatDateStr(new Date());

  const [status, setStatus] = useState(dayItem?.status || 'completed');
  const [note, setNote] = useState(dayItem?.note || '');

  // Password authorization for past history modification
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Form state for adding daily tasks to this day
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskMinutes, setTaskMinutes] = useState(30);

  const isPast = dayItem?.date ? dayItem.date < todayStr : false;
  const isLocked = isPast && !isUnlocked;

  // Filter tasks specific to this challenge and day
  const dayTasks = useMemo(() => {
    if (!dayItem || !challenge || !Array.isArray(tasks)) return [];
    const challengeId = challenge.id || challenge._id;
    return tasks.filter((t) => {
      if (t.challengeId === challengeId && t.dayNumber === dayItem.dayNumber) {
        return true;
      }
      if (t.challengeId === challengeId && t.date === dayItem.date) {
        return true;
      }
      return false;
    });
  }, [tasks, challenge, dayItem]);

  const completedTasksCount = dayTasks.filter((t) => t.completed).length;

  if (!isOpen || !dayItem || !challenge) return null;

  const handlePasswordSuccess = () => {
    setIsUnlocked(true);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const executeSave = (finalStatus) => {
    if (finalStatus === 'completed') {
      soundEffects.playCelebration();
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: [theme.accent, theme.accentLight, '#ffffff']
        });
      } catch (err) {
        // ignore if canvas not supported
      }
    }

    onSaveCheckIn(challenge.id || challenge._id, {
      dayNumber: dayItem.dayNumber,
      status: finalStatus,
      note: note.trim()
    });
    onClose();
  };

  const handleCreateDayTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (isLocked) {
      setPendingAction(() => () => {
        if (onAddTask) {
          onAddTask({
            id: `task-${Date.now()}`,
            title: taskTitle.trim(),
            category: challenge.category || 'General',
            priority: taskPriority,
            estimatedMinutes: parseInt(taskMinutes, 10) || 30,
            date: dayItem.date,
            completed: false,
            completedAt: null,
            challengeId: challenge.id || challenge._id,
            challengeTitle: challenge.title,
            dayNumber: dayItem.dayNumber
          });
        }
        setTaskTitle('');
        soundEffects.playSuccess();
      });
      setIsPasswordModalOpen(true);
      return;
    }

    if (onAddTask) {
      onAddTask({
        id: `task-${Date.now()}`,
        title: taskTitle.trim(),
        category: challenge.category || 'General',
        priority: taskPriority,
        estimatedMinutes: parseInt(taskMinutes, 10) || 30,
        date: dayItem.date,
        completed: false,
        completedAt: null,
        challengeId: challenge.id || challenge._id,
        challengeTitle: challenge.title,
        dayNumber: dayItem.dayNumber
      });
    }

    setTaskTitle('');
    soundEffects.playSuccess();
  };

  const handleStatusSelect = (selectedStatus) => {
    if (isLocked) {
      setPendingAction(() => () => setStatus(selectedStatus));
      setIsPasswordModalOpen(true);
      return;
    }
    setStatus(selectedStatus);
  };

  const handleDayTaskToggle = (taskId) => {
    if (isLocked) {
      setPendingAction(() => () => onToggleTask && onToggleTask(taskId));
      setIsPasswordModalOpen(true);
      return;
    }
    if (onToggleTask) onToggleTask(taskId);
  };

  const handleDayTaskDelete = (taskId) => {
    if (isLocked) {
      setPendingAction(() => () => onDeleteTask && onDeleteTask(taskId));
      setIsPasswordModalOpen(true);
      return;
    }
    if (onDeleteTask) onDeleteTask(taskId);
  };

  const handleSave = (selectedStatus) => {
    const finalStatus = selectedStatus || status;

    if (isLocked) {
      setPendingAction(() => () => executeSave(finalStatus));
      setIsPasswordModalOpen(true);
      return;
    }

    executeSave(finalStatus);
  };

  const formattedDate = new Date(dayItem.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-github-border bg-[#0d1117] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs font-mono"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accentLight
              }}
            >
              D{dayItem.dayNumber}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Day {dayItem.dayNumber} Check-in &amp; Daily Tasks</span>
              </h3>
              <p className="text-xs text-github-muted truncate max-w-[260px]">{challenge.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body with smooth scrolling */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Target Date & Status Info */}
          <div className="flex items-center justify-between text-xs text-github-muted bg-[#0d1117] p-2.5 rounded-lg border border-github-border flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: theme.accent }} />
              <span>
                Target Date: <strong className="text-white">{formattedDate}</strong>
              </span>
            </div>
            {isPast ? (
              isUnlocked ? (
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  Unlocked with Password
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-950/40 text-amber-300 border border-amber-800/40 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    History Protected
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingAction(null);
                      setIsPasswordModalOpen(true);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#21262d] text-amber-300 hover:text-white border border-amber-800/40 hover:border-amber-600 transition-colors"
                  >
                    Unlock with Password
                  </button>
                </div>
              )
            ) : dayItem.date === todayStr ? (
              <span
                className="text-[10px] px-2 py-0.5 rounded font-bold border"
                style={{
                  backgroundColor: theme.accentDark,
                  borderColor: theme.accent + '40',
                  color: theme.accentLight
                }}
              >
                Today
              </span>
            ) : null}
          </div>

          {/* Status Selection Buttons */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-2">
              Select Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleStatusSelect('completed')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  status === 'completed'
                    ? 'shadow-sm font-semibold'
                    : 'bg-[#0d1117] border-github-border text-github-muted hover:text-white'
                }`}
                style={
                  status === 'completed'
                    ? {
                        backgroundColor: theme.accentDark,
                        borderColor: theme.accent,
                        color: '#ffffff'
                      }
                    : {}
                }
              >
                <CheckCircle2
                  className="w-5 h-5"
                  style={{ color: status === 'completed' ? theme.accentLight : undefined }}
                />
                <span>Completed</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusSelect('skipped')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  status === 'skipped'
                    ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm font-semibold'
                    : 'bg-[#0d1117] border-github-border text-github-muted hover:text-white hover:border-amber-800'
                }`}
              >
                <XCircle className={`w-5 h-5 ${status === 'skipped' ? 'text-amber-400' : 'text-github-muted'}`} />
                <span>Skipped / Rest</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusSelect('pending')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  status === 'pending'
                    ? 'bg-[#21262d] border-github-borderLight text-white shadow-sm font-semibold'
                    : 'bg-[#0d1117] border-github-border text-github-muted hover:text-white'
                }`}
              >
                <RotateCcw className={`w-5 h-5 ${status === 'pending' ? 'text-white' : 'text-github-muted'}`} />
                <span>Pending</span>
              </button>
            </div>
          </div>

          {/* Planned Daily Tasks Section for this specific Day */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between border-b border-github-border pb-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" style={{ color: theme.accent }} />
                <span className="text-xs font-semibold text-github-text uppercase tracking-wider">
                  Daily Tasks for Day {dayItem.dayNumber}
                </span>
              </div>
              <span
                className="text-[11px] font-mono px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: theme.accentDark,
                  borderColor: theme.accent + '40',
                  color: theme.accentLight
                }}
              >
                {completedTasksCount}/{dayTasks.length} Done
              </span>
            </div>

            {/* List of Tasks for this day */}
            {dayTasks.length === 0 ? (
              <div className="p-3.5 rounded-lg bg-[#0d1117] border border-github-border text-center text-xs text-github-muted">
                No daily tasks planned for Day {dayItem.dayNumber} yet. Add what you plan to study or accomplish below!
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {dayTasks.map((task) => {
                  const taskId = task.id || task._id;
                  return (
                    <div
                      key={taskId}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                        task.completed
                          ? 'bg-[#161b22]/70 border-github-border/40 text-github-muted'
                          : 'bg-[#0d1117] border-github-border hover:border-white/30 text-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
                        <button
                          type="button"
                          onClick={() => handleDayTaskToggle(taskId)}
                          className="flex-shrink-0 focus:outline-none"
                          title={
                            isLocked
                              ? 'Modifying past task requires password'
                              : task.completed
                              ? 'Mark incomplete'
                              : 'Mark completed'
                          }
                        >
                          {task.completed ? (
                            <CheckCircle2
                              className="w-4 h-4 transition-colors"
                              style={{ color: isLocked ? '#f59e0b' : theme.accent }}
                            />
                          ) : (
                            <Circle className="w-4 h-4 text-github-muted hover:text-white" />
                          )}
                        </button>
                        <span
                          className={`truncate font-medium ${
                            task.completed ? 'line-through text-github-muted' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                            task.priority === 'High'
                              ? 'bg-red-950/40 text-red-300 border-red-800/40'
                              : task.priority === 'Medium'
                              ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                              : 'bg-[#161b22] text-github-muted border-github-border'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-github-muted font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedMinutes}m
                        </span>
                        {onDeleteTask && (
                          <button
                            type="button"
                            onClick={() => handleDayTaskDelete(taskId)}
                            className="p-1 rounded text-github-muted hover:text-red-400 hover:bg-[#21262d] transition-colors"
                            title="Delete task"
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

            {/* Quick Add Form for this day's task */}
            {!isLocked ? (
              <form onSubmit={handleCreateDayTask} className="space-y-2 p-3 rounded-lg bg-[#0d1117] border border-github-border">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder={`What will you study/do on Day ${dayItem.dayNumber}? (e.g. Read chapter 1, Solve 2 LeetCode problems)`}
                    className="flex-1 px-3 py-1.5 bg-[#161b22] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none focus:border-white/40"
                  />
                  <button
                    type="submit"
                    disabled={!taskTitle.trim()}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: theme.accent, color: '#0d1117' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-github-muted flex-wrap gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-github-text">Priority:</span>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                      className="bg-[#161b22] border border-github-border rounded px-2 py-0.5 text-[11px] text-white outline-none cursor-pointer"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>

                    <span className="font-medium text-github-text ml-1">Est. Duration:</span>
                    <select
                      value={taskMinutes}
                      onChange={(e) => setTaskMinutes(Number(e.target.value))}
                      className="bg-[#161b22] border border-github-border rounded px-2 py-0.5 text-[11px] text-white outline-none cursor-pointer"
                    >
                      <option value={15}>15 mins</option>
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                      <option value={60}>60 mins</option>
                      <option value={90}>90 mins</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-github-muted italic">
                    Syncs automatically with Daily Tasks
                  </span>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 flex-shrink-0 text-amber-400" />
                  <span>Past history is protected. Password required to add, edit or delete tasks.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPendingAction(null);
                    setIsPasswordModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded bg-[#21262d] text-amber-300 hover:text-white border border-amber-800/40 text-[11px] font-medium whitespace-nowrap ml-2"
                >
                  Unlock with Password
                </button>
              </div>
            )}
          </div>

          {/* Reflection / Daily Note */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Individual Day Note &amp; Accomplishment</span>
              <span className="text-[10px] text-github-muted font-normal">Optional</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you accomplish today? Any lessons or reflections?"
              className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none resize-none focus:border-white/40"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-github-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-github-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave()}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold ${theme.primaryBtn} shadow-md transition-all`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save Check-in</span>
            </button>
          </div>
        </div>
      </div>

      {/* Password Prompt Modal for modifying past history */}
      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
        userProfile={userProfile}
        title="Authorize Past History Change"
        description={`Modifying or deleting Day ${dayItem.dayNumber} (${dayItem.date}) history requires your account password.`}
      />
    </div>
  );
}
