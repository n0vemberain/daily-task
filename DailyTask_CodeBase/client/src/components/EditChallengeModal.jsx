import React, { useState, useEffect } from 'react';
import { X, Edit3, Flame, Calendar, Tag, FileText, Lock, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatDateStr } from '../data/initialData';
import PasswordPromptModal from './PasswordPromptModal';

function addDays(dStr, days) {
  const d = new Date(dStr);
  d.setDate(d.getDate() + days);
  return formatDateStr(d);
}

function calculateDiffDays(startStr, endStr) {
  const s = new Date(startStr);
  const e = new Date(endStr);
  const diffTime = e.getTime() - s.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24)) + 1;
  return Math.max(1, diffDays);
}

export default function EditChallengeModal({
  isOpen,
  onClose,
  challenge,
  onSaveChallenge,
  userProfile
}) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [isManualCategory, setIsManualCategory] = useState(false);
  const [manualCategoryInput, setManualCategoryInput] = useState('');

  // Challenge Schedule & Duration State
  const [startDate, setStartDate] = useState(formatDateStr(new Date()));
  const [durationDays, setDurationDays] = useState(30);
  const [endDate, setEndDate] = useState(formatDateStr(new Date()));

  // Password Authorization State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState(null);

  useEffect(() => {
    if (challenge) {
      setTitle(challenge.title || '');
      setDescription(challenge.description || '');
      setCategory(challenge.category || 'Coding');
      setIsManualCategory(false);
      setManualCategoryInput('');

      const sDate = challenge.startDate || formatDateStr(new Date());
      const days = challenge.durationDays || challenge.totalDays || challenge.checkIns?.length || 30;
      const eDate = challenge.endDate || addDays(sDate, days - 1);

      setStartDate(sDate);
      setDurationDays(days);
      setEndDate(eDate);
    }
  }, [challenge]);

  if (!isOpen || !challenge) return null;

  const presets = [7, 14, 21, 30, 50, 75, 100];
  const categories = ['Coding', 'Study', 'Fitness', 'Habit', 'Reading', 'Career', 'General'];

  const handleStartDateChange = (newStart) => {
    setStartDate(newStart);
    setEndDate(addDays(newStart, durationDays - 1));
  };

  const handleDurationChange = (newDays) => {
    const days = Math.max(1, parseInt(newDays, 10) || 1);
    setDurationDays(days);
    setEndDate(addDays(startDate, days - 1));
  };

  const handleEndDateChange = (newEnd) => {
    setEndDate(newEnd);
    const calculatedDays = calculateDiffDays(startDate, newEnd);
    setDurationDays(calculatedDays);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = isManualCategory && manualCategoryInput.trim()
      ? manualCategoryInput.trim()
      : category;

    const updatedData = {
      ...challenge,
      title: title.trim(),
      description: description.trim(),
      category: finalCategory || 'Habit',
      startDate,
      endDate,
      durationDays: parseInt(durationDays, 10) || 30,
      totalDays: parseInt(durationDays, 10) || 30
    };

    setPendingSaveData(updatedData);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSuccess = () => {
    if (pendingSaveData && onSaveChallenge) {
      onSaveChallenge(challenge.id || challenge._id, pendingSaveData);
      setPendingSaveData(null);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-github-border bg-[#0d1117]">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4" style={{ color: theme.accent }} />
              <div>
                <h3 className="text-sm font-bold text-white">Edit Challenge Details</h3>
                <p className="text-[11px] text-github-muted">Update title, duration, schedule dates, and category</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Challenge Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none focus:border-white/40"
              />
            </div>

            {/* Schedule & Duration Section */}
            <div className="p-3.5 rounded-lg bg-[#0d1117] border border-github-border space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-github-text uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                  <span>Schedule Dates &amp; Duration *</span>
                </label>
                <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Password Protected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Start Date */}
                <div>
                  <span className="block text-[11px] text-github-muted mb-1 font-medium">Start Date:</span>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#161b22] border border-github-border rounded-lg text-xs text-white outline-none focus:border-white/40"
                  />
                </div>

                {/* End Date */}
                <div>
                  <span className="block text-[11px] text-github-muted mb-1 font-medium">End Date:</span>
                  <input
                    type="date"
                    required
                    min={startDate}
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#161b22] border border-github-border rounded-lg text-xs text-white outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Duration Days Input & Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-github-muted font-medium">Total Duration (Days):</span>
                  <span className="font-mono font-bold text-white">{durationDays} Days</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={durationDays}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    className="w-24 px-2.5 py-1 bg-[#161b22] border border-github-border rounded-lg text-xs text-white font-mono outline-none focus:border-white/40"
                  />
                  <span className="text-[11px] text-github-muted">days total</span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1">
                  {presets.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleDurationChange(p)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                        durationDays === p
                          ? 'bg-white text-black font-semibold'
                          : 'bg-[#161b22] text-github-muted border-github-border hover:text-white'
                      }`}
                    >
                      {p}D
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category with Manual Option */}
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
                  placeholder="Type custom category name..."
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none"
                  style={{ borderColor: theme.accent + '70' }}
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                        category === cat
                          ? 'bg-white text-black font-semibold'
                          : 'bg-[#0d1117] text-github-muted border-github-border hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Goals */}
            <div>
              <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Description &amp; Goals
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white focus:outline-none resize-none"
              />
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
                className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow transition-all flex items-center gap-1.5"
                style={{ backgroundColor: theme.accent, color: '#0d1117' }}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mandatory Password Prompt for Saving Challenge Changes */}
      <PasswordPromptModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingSaveData(null);
        }}
        onSuccess={handlePasswordSuccess}
        userProfile={userProfile}
        title="Authorize Challenge Update"
        description={`Updating schedule duration and settings for "${challenge.title}" requires your account password.`}
      />
    </>
  );
}
