import React, { useState, useEffect } from 'react';
import { X, Edit3, Flame, Calendar, Tag, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function EditChallengeModal({
  isOpen,
  onClose,
  challenge,
  onSaveChallenge
}) {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [isManualCategory, setIsManualCategory] = useState(false);
  const [manualCategoryInput, setManualCategoryInput] = useState('');

  useEffect(() => {
    if (challenge) {
      setTitle(challenge.title || '');
      setDescription(challenge.description || '');
      setCategory(challenge.category || 'Coding');
      setIsManualCategory(false);
      setManualCategoryInput('');
    }
  }, [challenge]);

  if (!isOpen || !challenge) return null;

  const categories = ['Coding', 'Study', 'Fitness', 'Habit', 'Reading', 'Career', 'General'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = isManualCategory && manualCategoryInput.trim()
      ? manualCategoryInput.trim()
      : category;

    onSaveChallenge(challenge.id || challenge._id, {
      ...challenge,
      title: title.trim(),
      description: description.trim(),
      category: finalCategory || 'Habit'
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
            <h3 className="text-sm font-bold text-white">Edit Challenge Details</h3>
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
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-md transition-all"
              style={{ backgroundColor: theme.accent, color: '#0d1117' }}
            >
              Update Challenge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
