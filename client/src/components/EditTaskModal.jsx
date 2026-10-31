import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Edit3, Clock, Calendar, Tag, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatDateStr } from '../data/initialData';

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
  onSaveTask
}) {
  const { theme } = useTheme();
  const todayStr = formatDateStr(new Date());
  const isPast = task ? task.date < todayStr : false;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Coding');
  const [priority, setPriority] = useState('Medium');
  const [date, setDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setCategory(task.category || 'Coding');
      setPriority(task.priority || 'Medium');
      setDate(task.date || '');
      setEstimatedMinutes(task.estimatedMinutes || 30);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const defaultCategories = ['Coding', 'Study', 'Fitness', 'Work', 'General'];
  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('daily_task_custom_categories');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const categories = Array.from(new Set([...defaultCategories, ...customCategories]));
  const priorities = ['Low', 'Medium', 'High'];

  const [isManualCategory, setIsManualCategory] = useState(false);
  const [manualCategoryInput, setManualCategoryInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || isPast || (date && date < todayStr)) return;

    let finalCategory = category;
    if (isManualCategory && manualCategoryInput.trim()) {
      finalCategory = manualCategoryInput.trim();
      if (!customCategories.includes(finalCategory)) {
        const next = [...customCategories, finalCategory];
        setCustomCategories(next);
        localStorage.setItem('daily_task_custom_categories', JSON.stringify(next));
      }
    }

    onSaveTask(task.id || task._id, {
      ...task,
      title: title.trim(),
      category: finalCategory || 'General',
      priority,
      date,
      estimatedMinutes: parseInt(estimatedMinutes, 10) || 30
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" style={{ color: theme.accent }} />
            <h3 className="text-sm font-bold text-white">Edit Task Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1.5">
              Task Description *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none focus:border-white/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Category with Manual Custom Category Option */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsManualCategory(!isManualCategory);
                    if (!isManualCategory) setManualCategoryInput('');
                  }}
                  className="text-[10px] font-medium hover:underline text-github-muted hover:text-white"
                  style={{ color: isManualCategory ? theme.accentLight : undefined }}
                >
                  {isManualCategory ? 'Choose Preset' : '+ Enter Manually'}
                </button>
              </div>

              {isManualCategory ? (
                <input
                  type="text"
                  required
                  value={manualCategoryInput}
                  onChange={(e) => setManualCategoryInput(e.target.value)}
                  placeholder="Type new category..."
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none"
                  style={{ borderColor: theme.accent + '70' }}
                />
              ) : (
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsManualCategory(true);
                      setManualCategoryInput('');
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__NEW__">+ Enter New Category Manually...</option>
                </select>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Past Date Locked Warning */}
          {isPast && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs animate-in fade-in">
              <Lock className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>
                This task is from a past date ({task.date}). Previous dates cannot be edited. History is locked. You can only delete this task.
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div>
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Scheduled Date
              </label>
              <input
                type="date"
                required
                min={todayStr}
                disabled={isPast}
                value={date}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val || val >= todayStr) {
                    setDate(val);
                  }
                }}
                className={`w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none ${
                  isPast ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Estimated Minutes
              </label>
              <input
                type="number"
                min="5"
                step="5"
                disabled={isPast}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className={`w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none ${
                  isPast ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-github-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-github-muted hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPast}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md transition-all ${
                isPast ? 'opacity-50 cursor-not-allowed bg-gray-700' : ''
              }`}
              style={!isPast ? { backgroundColor: theme.accent, color: '#0d1117' } : {}}
            >
              {isPast ? 'History Locked' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
