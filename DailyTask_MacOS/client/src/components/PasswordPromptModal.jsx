import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ShieldAlert, KeyRound } from 'lucide-react';
import { storageService } from '../services/storageService';
import { soundEffects } from '../utils/audioFeedback';

export default function PasswordPromptModal({
  isOpen,
  onClose,
  onSuccess,
  title = 'Authorization Required',
  description = 'You are attempting to modify or delete previous history. Please enter your account password to authorize this change.',
  userProfile
}) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAuthorize = (e) => {
    e.preventDefault();
    const currentProfile = userProfile || storageService.getUserProfile();
    const expectedPassword = currentProfile?.password || 'Password123!';

    if (!password.trim()) {
      setError('Account password is required to authorize modifying past history.');
      return;
    }

    if (password !== expectedPassword) {
      setError('Incorrect password. Authorization failed.');
      return;
    }

    setError('');
    setPassword('');
    soundEffects.playSuccess();
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/50 border border-amber-800/50 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{title}</span>
              </h3>
              <p className="text-[11px] text-github-muted">History Protection System</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 rounded-md text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleAuthorize} className="p-5 space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-950/20 border border-amber-800/30 text-amber-300 text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{description}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your account password..."
                className="w-full px-3 py-2 pr-10 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none focus:border-white/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-github-muted hover:text-white"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-github-border">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition-all"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Authorize &amp; Proceed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
