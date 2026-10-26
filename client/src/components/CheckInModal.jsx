import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, RotateCcw, Calendar, FileText, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckInModal({
  isOpen,
  onClose,
  challenge,
  dayItem,
  onSaveCheckIn
}) {
  const [status, setStatus] = useState(dayItem?.status || 'completed');
  const [note, setNote] = useState(dayItem?.note || '');

  if (!isOpen || !dayItem || !challenge) return null;

  const handleSave = (selectedStatus) => {
    const finalStatus = selectedStatus || status;

    if (finalStatus === 'completed') {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#7eb644', '#5a8533', '#94af54', '#ffffff']
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

  const formattedDate = new Date(dayItem.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-olive-950 border border-olive-700/40 text-olive-400 flex items-center justify-center font-bold text-xs font-mono">
              D{dayItem.dayNumber}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Day {dayItem.dayNumber} Check-in</h3>
              <p className="text-xs text-github-muted">{challenge.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-github-muted bg-[#0d1117] p-2.5 rounded-lg border border-github-border">
            <Calendar className="w-4 h-4 text-olive-400" />
            <span>Target Date: <strong className="text-white">{formattedDate}</strong></span>
          </div>

          {/* Status Selection Buttons */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-2">
              Select Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  status === 'completed'
                    ? 'bg-olive-900/60 border-olive-500 text-white shadow-sm'
                    : 'bg-[#0d1117] border-github-border text-github-muted hover:text-white hover:border-olive-800'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${status === 'completed' ? 'text-olive-400' : 'text-github-muted'}`} />
                <span>Completed</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('skipped')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  status === 'skipped'
                    ? 'bg-amber-950/60 border-amber-500 text-white shadow-sm'
                    : 'bg-[#0d1117] border-github-border text-github-muted hover:text-white hover:border-amber-800'
                }`}
              >
                <XCircle className={`w-5 h-5 ${status === 'skipped' ? 'text-amber-400' : 'text-github-muted'}`} />
                <span>Skipped / Rest</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-1.5 transition-all text-xs font-medium ${
                  status === 'pending'
                    ? 'bg-[#21262d] border-github-borderLight text-white shadow-sm'
                    : 'bg-[#0d1117] border-github-border text-github-muted hover:text-white'
                }`}
              >
                <RotateCcw className={`w-5 h-5 ${status === 'pending' ? 'text-white' : 'text-github-muted'}`} />
                <span>Pending</span>
              </button>
            </div>
          </div>

          {/* Reflection / Daily Note */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Daily Reflection & Accomplishments</span>
              <span className="text-[10px] text-github-muted font-normal">Optional</span>
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you accomplish today? Any lessons or reflections?"
              className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted focus:border-olive-500 outline-none resize-none"
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-olive-700 hover:bg-olive-600 text-white shadow-md border border-olive-500/40 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Save Check-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
