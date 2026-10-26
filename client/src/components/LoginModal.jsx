import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle, X, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LoginModal({
  isOpen,
  onClose,
  userProfile,
  onLoginSuccess
}) {
  const { theme } = useTheme();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const targetUsername = (userProfile?.username || 'n0vemberain').trim().toLowerCase();
    const targetPassword = userProfile?.password || 'Password123!';

    const enteredUsername = usernameInput.trim().toLowerCase();
    const enteredPassword = passwordInput;

    if (!enteredUsername || !enteredPassword) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    if (enteredUsername === targetUsername && enteredPassword === targetPassword) {
      onLoginSuccess({ rememberMe, username: enteredUsername });
      setUsernameInput('');
      setPasswordInput('');
      onClose();
    } else {
      setErrorMessage('Invalid username or password. Please verify your credentials.');
    }
  };

  const handleQuickDemoFill = () => {
    setUsernameInput(userProfile?.username || 'n0vemberain');
    setPasswordInput(userProfile?.password || 'Password123!');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accent
              }}
            >
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Account Authentication</h3>
              <p className="text-[11px] text-github-muted">Sign in to your DailyTask account</p>
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
        <form onSubmit={handleLogin} className="p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800/50 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-github-muted absolute left-3 top-3" />
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-9 pr-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-github-text uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-github-muted absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-9 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted focus:outline-none focus:border-white/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-github-muted hover:text-white"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Remember me & Auto-fill helper */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-github-muted text-[11px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-github-border bg-[#0d1117]"
              />
              <span>Remember session</span>
            </label>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[11px] font-medium hover:underline"
              style={{ color: theme.accent }}
            >
              Auto-fill Credentials
            </button>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 text-white shadow-md transition-all"
              style={{ backgroundColor: theme.accent, color: '#0d1117' }}
            >
              <LogIn className="w-4 h-4" />
              <span>Authenticate and Access</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
