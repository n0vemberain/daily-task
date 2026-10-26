import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  Filter,
  Search,
  Edit3,
  ShieldAlert,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatDateStr } from '../data/initialData';
import { soundEffects } from '../utils/audioFeedback';
import { useTheme } from '../context/ThemeContext';
import EditTaskModal from './EditTaskModal';

export default function TaskManager({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  selectedDate,
  onClearDateFilter,
  onOpenDataClean
}) {
  const { theme } = useTheme();
  const defaultCategories = ['Coding', 'Study', 'Fitness', 'Work', 'General'];
  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('daily_task_custom_categories');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Combine default, custom, and task categories dynamically
  const allCategories = useMemo(() => {
    const fromTasks = tasks.map((t) => t.category).filter(Boolean);
    const set = new Set([...defaultCategories, ...customCategories, ...fromTasks]);
    return Array.from(set);
  }, [tasks, customCategories]);

  const categories = ['All', ...allCategories];

  // Manual Category State
  const [isManualCategory, setIsManualCategory] = useState(false);
  const [manualCategoryInput, setManualCategoryInput] = useState('');

  const [filter, setFilter] = useState(selectedDate ? 'selectedDate' : 'today');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Coding');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newEstimatedMinutes, setNewEstimatedMinutes] = useState(30);
  const [newDate, setNewDate] = useState(selectedDate || formatDateStr(new Date()));

  const todayStr = formatDateStr(new Date());

  const handleToggle = (taskId) => {
    const task = tasks.find((t) => t.id === taskId || t._id === taskId);
    const willComplete = !task?.completed;

    if (willComplete) {
      soundEffects.playSuccess();
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
          colors: [theme.accent, theme.accentLight, '#ffffff']
        });
      } catch (e) {}
    }

    onToggleTask(taskId);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let finalCategory = newCategory;
    if (isManualCategory && manualCategoryInput.trim()) {
      finalCategory = manualCategoryInput.trim();
      if (!customCategories.includes(finalCategory)) {
        const next = [...customCategories, finalCategory];
        setCustomCategories(next);
        localStorage.setItem('daily_task_custom_categories', JSON.stringify(next));
      }
    }

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: finalCategory || 'General',
      priority: newPriority,
      estimatedMinutes: parseInt(newEstimatedMinutes, 10) || 30,
      date: newDate || todayStr,
      completed: false,
      completedAt: null
    });

    setNewTitle('');
    setManualCategoryInput('');
    setIsManualCategory(false);
    setIsAddFormOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchCategory = t.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory) return false;
    }

    if (categoryFilter !== 'All' && t.category !== categoryFilter) {
      return false;
    }

    if (selectedDate) {
      return t.date === selectedDate;
    }

    if (filter === 'today') {
      return t.date === todayStr;
    }
    if (filter === 'pending') {
      return !t.completed;
    }
    if (filter === 'completed') {
      return t.completed;
    }
    return true;
  });

  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const todayDone = todayTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5" style={{ color: theme.accent }} />
              Daily Task Activity Manager
            </h2>
            {selectedDate ? (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-mono border"
                style={{
                  backgroundColor: theme.accentDark,
                  color: theme.accent,
                  borderColor: theme.accent + '40'
                }}
              >
                Filtered: {selectedDate}
              </span>
            ) : (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-medium border"
                style={{
                  backgroundColor: theme.accentDark,
                  color: theme.accent,
                  borderColor: theme.accent + '40'
                }}
              >
                Today: {todayDone}/{todayTasks.length} Completed
              </span>
            )}
          </div>
          <p className="text-xs text-github-muted mt-1">
            Complete daily tasks to illuminate the activity matrix and build consistency
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap justify-end">
          {selectedDate && (
            <button
              onClick={onClearDateFilter}
              className="text-xs underline font-medium mr-1"
              style={{ color: theme.accent }}
            >
              Clear Date Filter
            </button>
          )}

          {onOpenDataClean && (
            <button
              onClick={onOpenDataClean}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-github-text border border-github-border transition-colors whitespace-nowrap"
              title="Clean or reset data"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>Clean Data</span>
            </button>
          )}

          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white shadow-md transition-all whitespace-nowrap"
            style={{ backgroundColor: theme.accent, color: '#0d1117' }}
          >
            <Plus className="w-4 h-4" />
            <span>{isAddFormOpen ? 'Close Form' : 'Add New Task'}</span>
          </button>
        </div>
      </div>

      {/* Add Task Collapsible Card */}
      {isAddFormOpen && (
        <form
          onSubmit={handleCreateTask}
          className="bg-[#161b22] border rounded-xl p-4 sm:p-5 shadow-lg space-y-4 animate-in fade-in"
          style={{ borderColor: theme.accent + '60' }}
        >
          <div className="flex items-center justify-between border-b border-github-border pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4" style={{ color: theme.accent }} />
              Create New Daily Task
            </h3>
            <span className="text-xs text-github-muted">Linked to Activity Heatmap</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Task Title */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1">
                Task Description *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Implement dynamic heat map tooltip..."
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted focus:outline-none"
              />
            </div>

            {/* Category with Manual Custom Category Entry */}
            <div>
              <div className="flex items-center justify-between mb-1">
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
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted focus:outline-none font-medium"
                  style={{ borderColor: theme.accent + '70' }}
                />
              ) : (
                <select
                  value={newCategory}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsManualCategory(true);
                      setManualCategoryInput('');
                    } else {
                      setNewCategory(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none"
                >
                  {allCategories.map((c) => (
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
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Target Date */}
            <div>
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1">
                Task Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none"
              />
            </div>

            {/* Estimated Minutes */}
            <div>
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1">
                Est. Duration (Mins)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={newEstimatedMinutes}
                onChange={(e) => setNewEstimatedMinutes(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="px-3 py-1.5 text-xs text-github-muted hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow"
              style={{ backgroundColor: theme.accent, color: '#0d1117' }}
            >
              Save &amp; Add Task
            </button>
          </div>
        </form>
      )}

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#161b22] p-3 rounded-xl border border-github-border">
        {/* Main Status Filters */}
        {!selectedDate && (
          <div className="flex items-center gap-1 bg-[#0d1117] p-1 rounded-lg border border-github-border text-xs overflow-x-auto scrollbar-none">
            <button
              onClick={() => setFilter('today')}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                filter === 'today'
                  ? 'text-white border shadow-sm'
                  : 'text-github-muted hover:text-white'
              }`}
              style={
                filter === 'today'
                  ? {
                      backgroundColor: theme.accentDark,
                      color: theme.accent,
                      borderColor: theme.accent + '40'
                    }
                  : {}
              }
            >
              Today ({todayTasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                filter === 'pending'
                  ? 'text-white border shadow-sm'
                  : 'text-github-muted hover:text-white'
              }`}
              style={
                filter === 'pending'
                  ? {
                      backgroundColor: theme.accentDark,
                      color: theme.accent,
                      borderColor: theme.accent + '40'
                    }
                  : {}
              }
            >
              Pending ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                filter === 'completed'
                  ? 'text-white border shadow-sm'
                  : 'text-github-muted hover:text-white'
              }`}
              style={
                filter === 'completed'
                  ? {
                      backgroundColor: theme.accentDark,
                      color: theme.accent,
                      borderColor: theme.accent + '40'
                    }
                  : {}
              }
            >
              Completed ({tasks.filter((t) => t.completed).length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                filter === 'all'
                  ? 'text-white border shadow-sm'
                  : 'text-github-muted hover:text-white'
              }`}
              style={
                filter === 'all'
                  ? {
                      backgroundColor: theme.accentDark,
                      color: theme.accent,
                      borderColor: theme.accent + '40'
                    }
                  : {}
              }
            >
              All ({tasks.length})
            </button>
          </div>
        )}

        {/* Search input & Category Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-github-muted absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full sm:w-44 pl-8 pr-2.5 py-1.5 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted focus:outline-none"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'border'
                    : 'text-github-muted hover:text-white bg-[#0d1117] border border-github-border'
                }`}
                style={
                  categoryFilter === cat
                    ? {
                        backgroundColor: theme.accentDark,
                        color: theme.accent,
                        borderColor: theme.accent + '50'
                      }
                    : {}
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#161b22] border border-github-border rounded-xl p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-github-muted mx-auto mb-2 opacity-50" />
            <p className="text-xs font-medium text-white">No tasks found</p>
            <p className="text-[11px] text-github-muted mt-0.5">
              {selectedDate
                ? `No tasks recorded for date ${selectedDate}`
                : 'Create a new task above to boost your daily contribution score!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const taskId = task.id || task._id;
            return (
              <div
                key={taskId}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  task.completed
                    ? 'bg-[#161b22]/70 border-github-border/50 text-github-muted'
                    : 'bg-[#161b22] border-github-border hover:border-white/30 text-white shadow-sm'
                }`}
              >
                {/* Left: Checkbox + Title */}
                <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                  <button
                    onClick={() => handleToggle(taskId)}
                    className="focus:outline-none flex-shrink-0"
                    title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {task.completed ? (
                      <CheckCircle2
                        className="w-5 h-5 transition-colors"
                        style={{ color: theme.accent }}
                      />
                    ) : (
                      <Circle className="w-5 h-5 text-github-muted hover:text-white transition-colors" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`text-xs sm:text-sm font-medium block truncate ${
                        task.completed ? 'line-through text-github-muted' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-github-muted flex-wrap">
                      <span className="font-mono">{task.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedMinutes}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Badges, Edit & Delete */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  {/* Category Pill */}
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0d1117] text-github-text border border-github-border hidden sm:inline">
                    {task.category}
                  </span>

                  {/* Priority Pill */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                      task.priority === 'High'
                        ? 'bg-red-950/40 text-red-300 border-red-800/40'
                        : task.priority === 'Medium'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                        : 'bg-[#0d1117] text-github-muted border-github-border'
                    }`}
                  >
                    {task.priority}
                  </span>

                  {/* Individual Edit Task Button */}
                  <button
                    onClick={() => setEditingTask(task)}
                    className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
                    title="Edit individual task"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => onDeleteTask(taskId)}
                    className="p-1 rounded-md text-github-muted hover:text-red-400 hover:bg-[#21262d] transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSaveTask={onEditTask}
      />
    </div>
  );
}
