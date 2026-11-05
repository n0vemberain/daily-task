import React, { useState, useMemo, useEffect } from 'react';
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
  Flame,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/audioFeedback';
import { useTheme } from '../context/ThemeContext';
import { formatDateStr } from '../data/initialData';
import PasswordPromptModal from './PasswordPromptModal';
import EditTaskModal from './EditTaskModal';

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
  userProfile,
  onEditTask,
  challenges = []
}) {
  const { theme } = useTheme();
  const todayStr = formatDateStr(new Date());

  const isPast = dayItem?.date ? dayItem.date < todayStr : false;
  const isFuture = dayItem?.date ? dayItem.date > todayStr : false;
  const isToday = dayItem?.date ? dayItem.date === todayStr : false;

  const [status, setStatus] = useState(dayItem?.status || 'pending');
  const [note, setNote] = useState(dayItem?.note || '');

  // Single-action password authorization for past history modification (no persistent unlock)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Task editing state
  const [editingTask, setEditingTask] = useState(null);

  // Form state for adding daily tasks to this day
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskMinutes, setTaskMinutes] = useState(30);

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
  const canBeCompleted = dayTasks.length > 0 && dayTasks.every((t) => t.completed);

  // Auto-select completed status when all planned tasks are completed
  useEffect(() => {
    if (isFuture) return;
    if (canBeCompleted) {
      setStatus('completed');
    } else if (status === 'completed' && !canBeCompleted) {
      setStatus('pending');
    }
  }, [canBeCompleted, isFuture]);

  // Sync initial dayItem state on open
  useEffect(() => {
    if (dayItem) {
      if (canBeCompleted) {
        setStatus('completed');
      } else if (dayItem.status === 'completed' && !canBeCompleted) {
        setStatus('pending');
      } else {
        setStatus(dayItem.status || 'pending');
      }
      setNote(dayItem.note || '');
    }
  }, [dayItem?.dayNumber, dayItem?.date, dayItem?.status]);

  if (!isOpen || !dayItem || !challenge) return null;

  const handlePasswordSuccess = () => {
    setIsPasswordModalOpen(false);
    if (pendingAction) {
      const actionToExecute = pendingAction;
      setPendingAction(null);
      actionToExecute();
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

    const newTaskData = {
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
    };

    if (isPast) {
      setPendingAction(() => () => {
        if (onAddTask) onAddTask(newTaskData);
        setTaskTitle('');
        soundEffects.playSuccess();
      });
      setIsPasswordModalOpen(true);
      return;
    }

    if (onAddTask) {
      onAddTask(newTaskData);
    }
    setTaskTitle('');
    soundEffects.playSuccess();
  };

  const handleStatusSelect = (selectedStatus) => {
    if (isFuture) return;
    if (selectedStatus === 'completed' && !canBeCompleted) return;

    if (isPast) {
      setPendingAction(() => () => setStatus(selectedStatus));
      setIsPasswordModalOpen(true);
      return;
    }
    setStatus(selectedStatus);
  };

  const handleDayTaskToggle = (taskId) => {
    if (isPast) {
      setPendingAction(() => () => onToggleTask && onToggleTask(taskId));
      setIsPasswordModalOpen(true);
      return;
    }
    if (onToggleTask) onToggleTask(taskId);
  };

  const handleDayTaskDelete = (taskId) => {
    if (isPast) {
      setPendingAction(() => () => onDeleteTask && onDeleteTask(taskId));
      setIsPasswordModalOpen(true);
      return;
    }
    if (onDeleteTask) onDeleteTask(taskId);
  };

  const handleDayTaskEdit = (task) => {
    setEditingTask(task);
  };

  const handleSaveEditedTask = (updatedTask) => {
    if (isPast) {
      setPendingAction(() => () => {
        if (onEditTask) onEditTask(updatedTask);
        setEditingTask(null);
      });
      setIsPasswordModalOpen(true);
      return;
    }
    if (onEditTask) onEditTask(updatedTask);
    setEditingTask(null);
  };

  const handleSave = (selectedStatus) => {
    if (isFuture) return;
    const finalStatus = selectedStatus || status;

    if (finalStatus === 'completed' && !canBeCompleted) {
      return;
    }

    if (isPast) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
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
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-950/40 text-amber-300 border border-amber-800/40 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                History Protected (Single-Action Password)
              </span>
            ) : isToday ? (
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
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-950/40 text-blue-300 border border-blue-800/40 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                Planning Mode (Future)
              </span>
            )}
          </div>

          {/* Status Selection Buttons */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider">
                Select Status
              </label>
              {isFuture && (
                <span className="text-[10px] text-blue-300 font-mono">
                  Unlocks on {formattedDate}
                </span>
              )}
            </div>

            {isFuture && (
              <div className="p-2.5 rounded-lg bg-[#0d1117] border border-blue-900/40 text-xs text-blue-300 flex items-center gap-2 mb-2.5">
                <Clock className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>
                  Future Day Planning Mode: Completion status can only be recorded on this date. You can add and plan daily tasks below!
                </span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isFuture || !canBeCompleted}
                onClick={() => handleStatusSelect('completed')}
                title={
                  !canBeCompleted
                    ? 'Requires at least 1 planned task, and all tasks must be completed'
                    : undefined
                }
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  isFuture || !canBeCompleted
                    ? 'opacity-50 cursor-not-allowed bg-[#0d1117] border-github-border text-github-muted'
                    : status === 'completed'
                    ? 'shadow-sm font-semibold'
                    : 'bg-[#0d1117] border-github-border text-github-muted hover:text-white'
                }`}
                style={
                  !isFuture && canBeCompleted && status === 'completed'
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
                  style={{ color: !isFuture && canBeCompleted && status === 'completed' ? theme.accentLight : undefined }}
                />
                <span>Completed</span>
              </button>

              <button
                type="button"
                disabled={isFuture}
                onClick={() => handleStatusSelect('skipped')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  isFuture
                    ? 'opacity-50 cursor-not-allowed bg-[#0d1117] border-github-border text-github-muted'
                    : status === 'skipped'
                    ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm font-semibold'
                    : 'bg-[#0d1117] border-github-border text-github-muted hover:text-white hover:border-amber-800'
                }`}
              >
                <XCircle className={`w-5 h-5 ${!isFuture && status === 'skipped' ? 'text-amber-400' : 'text-github-muted'}`} />
                <span>Skipped / Rest</span>
              </button>

              <button
                type="button"
                disabled={isFuture}
                onClick={() => handleStatusSelect('pending')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  isFuture
                    ? 'opacity-50 cursor-not-allowed bg-[#0d1117] border-github-border text-github-muted'
                    : status === 'pending'
                    ? 'bg-[#21262d] border-github-borderLight text-white shadow-sm font-semibold'
                    : 'bg-[#0d1117] border-github-border text-github-muted hover:text-white'
                }`}
              >
                <RotateCcw className={`w-5 h-5 ${!isFuture && status === 'pending' ? 'text-white' : 'text-github-muted'}`} />
                <span>Pending</span>
              </button>
            </div>

            {/* Validation Notice for Completion */}
            {!canBeCompleted && !isFuture && (
              <div className="mt-2 text-[11px] text-amber-400 bg-amber-950/30 border border-amber-800/40 px-2.5 py-1.5 rounded flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {dayTasks.length === 0
                    ? 'Add at least 1 task below and complete it to enable "Completed" check-in.'
                    : `Complete all tasks (${completedTasksCount}/${dayTasks.length} done) to mark this day as completed.`}
                </span>
              </div>
            )}
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
                            isPast
                              ? 'Modifying past task requires password'
                              : task.completed
                              ? 'Mark incomplete'
                              : 'Mark completed'
                          }
                        >
                          {task.completed ? (
                            <CheckCircle2
                              className="w-4 h-4 transition-colors"
                              style={{ color: isPast ? '#f59e0b' : theme.accent }}
                            />
                          ) : (
                            <Circle className="w-4 h-4 text-github-muted hover:text-white" />
                          )}
                        </button>
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <span
                            className={`truncate font-medium ${
                              task.completed ? 'line-through text-github-muted' : 'text-white'
                            }`}
                          >
                            {task.title}
                          </span>
                          {task.rolledOverFrom && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-rose-950/50 text-rose-300 border border-rose-800/50 flex items-center gap-1 select-none"
                              title={`Carried over from Day ${task.rolledOverFrom.dayNumber} (${task.rolledOverFrom.date})`}
                            >
                              <RotateCcw className="w-2.5 h-2.5 text-rose-400" />
                              <span>Pending from Day {task.rolledOverFrom.dayNumber} ({task.rolledOverFrom.date})</span>
                            </span>
                          )}
                        </div>
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

                        {/* Edit task button */}
                        <button
                          type="button"
                          onClick={() => handleDayTaskEdit(task)}
                          className="p-1 rounded text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
                          title="Edit task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete task button */}
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
                  {isPast ? 'Adding to past day prompts password' : 'Syncs automatically with Daily Tasks'}
                </span>
              </div>
            </form>
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
            {isFuture ? (
              <button
                type="button"
                disabled
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#21262d] text-github-muted border border-github-border cursor-not-allowed opacity-60"
                title={`Check-in unlocks on ${formattedDate}`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Check-in Locked (Future Day)</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={status === 'completed' && !canBeCompleted}
                onClick={() => handleSave()}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold ${
                  status === 'completed' && !canBeCompleted
                    ? 'bg-[#21262d] text-github-muted border border-github-border cursor-not-allowed opacity-60'
                    : `${theme.primaryBtn} shadow-md`
                } transition-all`}
                title={
                  status === 'completed' && !canBeCompleted
                    ? 'All tasks must be completed to save as completed'
                    : undefined
                }
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Check-in</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Task Modal for day's task */}
      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSaveTask={handleSaveEditedTask}
        challenges={challenges}
      />

      {/* Single-action Password Prompt Modal for modifying past history */}
      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
        userProfile={userProfile}
        title="Authorize Past History Change"
        description={`Modifying or saving Day ${dayItem.dayNumber} (${dayItem.date}) history requires your account password for this action.`}
      />
    </div>
  );
}
