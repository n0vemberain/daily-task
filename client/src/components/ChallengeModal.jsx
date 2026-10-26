import React, { useState } from 'react';
import { X, Flame, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';
import { formatDateStr } from '../data/initialData';
import { useTheme } from '../context/ThemeContext';

export default function ChallengeModal({ isOpen, onClose, onCreateChallenge }) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [customDays, setCustomDays] = useState(30);
  const [startDate, setStartDate] = useState(formatDateStr(new Date()));

  if (!isOpen) return null;

  const presets = [7, 14, 21, 30, 50, 75, 100];
  const categories = ['Coding', 'Study', 'Fitness', 'Habit', 'Reading', 'Career'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateChallenge({
      title: title.trim(),
      description: description.trim(),
      category,
      durationDays: parseInt(customDays, 10) || 30,
      startDate
    });

    // Reset
    setTitle('');
    setDescription('');
    setCustomDays(30);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accent
              }}
            >
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Goal Challenge</h3>
              <p className="text-xs text-github-muted">Design a custom duration streak challenge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
              Challenge Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 30-Day LeetCode & React Mastery, 75 Hard, etc."
              className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-sm text-white placeholder-github-muted focus:border-white/40 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    category === cat
                      ? 'text-white border-white/50 shadow-sm'
                      : 'bg-[#0d1117] text-github-muted border-github-border hover:text-white hover:border-github-borderLight'
                  }`}
                  style={{
                    backgroundColor: category === cat ? theme.accent : undefined,
                    color: category === cat ? '#0d1117' : undefined,
                    fontWeight: category === cat ? 'bold' : 'normal'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Duration in Days */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
              Challenge Duration (Days) *
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {presets.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setCustomDays(days)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium border transition-all ${
                    parseInt(customDays, 10) === days
                      ? 'border-white/50 shadow-sm'
                      : 'bg-[#0d1117] text-github-muted border-github-border hover:text-white'
                  }`}
                  style={{
                    backgroundColor: parseInt(customDays, 10) === days ? theme.accent : undefined,
                    color: parseInt(customDays, 10) === days ? '#0d1117' : undefined,
                    fontWeight: parseInt(customDays, 10) === days ? 'bold' : 'normal'
                  }}
                >
                  {days} Days
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-github-muted">Or custom duration:</span>
              <input
                type="number"
                min="1"
                max="365"
                value={customDays}
                onChange={(e) => setCustomDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-24 px-3 py-1.5 bg-[#0d1117] border border-github-border rounded-md text-xs font-mono text-white text-center outline-none focus:border-white/40"
              />
              <span className="text-xs text-github-muted">days total</span>
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-sm text-white outline-none focus:border-white/40"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
              Description &amp; Goals (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are your daily goals for this challenge?"
              className="w-full px-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-sm text-white placeholder-github-muted outline-none resize-none focus:border-white/40"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-github-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-github-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold ${theme.primaryBtn} shadow-md transition-all`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Launch Challenge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
