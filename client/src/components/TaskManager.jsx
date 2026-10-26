import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatDateStr } from '../data/initialData';
import { soundEffects } from '../utils/audioFeedback';

export default function TaskManager({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  selectedDate,
  onClearDateFilter
}) {
  const [filter, setFilter] = useState(selectedDate ? 'selectedDate' : 'today');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Coding');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newEstimatedMinutes, setNewEstimatedMinutes] = useState(30);
  const [newDate, setNewDate] = useState(selectedDate || formatDateStr(new Date()));

  const todayStr = formatDateStr(new Date());

  const categories = ['All', 'Coding', 'Study', 'Fitness', 'Work', 'General'];

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
          colors: ['#7eb644', '#5a8533', '#94af54']
        });
      } catch (e) {}
    }

    onToggleTask(taskId);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      estimatedMinutes: parseInt(newEstimatedMinutes, 10) || 30,
      date: newDate || todayStr,
      completed: false,
      completedAt: null
    });

    setNewTitle('');
    setIsAddFormOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchCategory = t.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory) return false;
    }

    // Category match
    if (categoryFilter !== 'All' && t.category !== categoryFilter) {
      return false;
    }

    // Date / completion status match
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
    return true; // 'all'
  });

  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const todayDone = todayTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-olive-400" />
              Daily Task Activity Manager
            </h2>
            {selectedDate ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-olive-950 text-olive-300 border border-olive-700/40 font-mono">
                Filtered: {selectedDate}
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-olive-950 text-olive-300 border border-olive-700/40">
                Today: {todayDone}/{todayTasks.length} Completed
              </span>
            )}
          </div>
          <p className="text-xs text-github-muted mt-1">
            Complete daily tasks to light up the GitHub contribution heatmap in olive green
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedDate && (
            <button
              onClick={onClearDateFilter}
              className="text-xs text-olive-400 hover:text-olive-300 underline font-medium mr-1"
            >
              Clear Date Filter
            </button>
          )}
          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-olive-700 hover:bg-olive-600 text-white shadow-md border border-olive-500/40 transition-all whitespace-nowrap ml-auto sm:ml-0"
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
          className="bg-[#161b22] border border-olive-600/40 rounded-xl p-5 shadow-lg space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-github-border pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-olive-400" />
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
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted focus:border-olive-500 outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:border-olive-500 outline-none"
              >
                {categories
                  .filter((c) => c !== 'All')
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:border-olive-500 outline-none"
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
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:border-olive-500 outline-none"
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
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:border-olive-500 outline-none"
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
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-olive-700 hover:bg-olive-600 text-white shadow border border-olive-500/40"
            >
              Save &amp; Add to Today
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
                  ? 'bg-olive-800 text-white shadow-sm border border-olive-600/40'
                  : 'text-github-muted hover:text-white'
              }`}
            >
              Today ({todayTasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                filter === 'pending'
                  ? 'bg-olive-800 text-white shadow-sm border border-olive-600/40'
                  : 'text-github-muted hover:text-white'
              }`}
            >
              Pending ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                filter === 'completed'
                  ? 'bg-olive-800 text-white shadow-sm border border-olive-600/40'
                  : 'text-github-muted hover:text-white'
              }`}
            >
              Completed ({tasks.filter((t) => t.completed).length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                filter === 'all'
                  ? 'bg-olive-800 text-white shadow-sm border border-olive-600/40'
                  : 'text-github-muted hover:text-white'
              }`}
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
              className="w-full sm:w-44 pl-8 pr-2.5 py-1.5 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted focus:border-olive-500 outline-none"
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
                    ? 'bg-olive-950 text-olive-300 border border-olive-700/60'
                    : 'text-github-muted hover:text-white bg-[#0d1117] border border-github-border'
                }`}
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
                    ? 'bg-[#161b22]/70 border-olive-900/30 text-github-muted'
                    : 'bg-[#161b22] border-github-border hover:border-olive-600/40 text-white shadow-sm'
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
                      <CheckCircle2 className="w-5 h-5 text-olive-400 hover:text-olive-300 transition-colors" />
                    ) : (
                      <Circle className="w-5 h-5 text-github-muted hover:text-olive-400 transition-colors" />
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

                {/* Right: Badges & Delete */}
                <div className="flex items-center gap-2 flex-shrink-0">
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
    </div>
  );
}
