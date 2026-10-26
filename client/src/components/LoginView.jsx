import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, LogIn, CheckSquare, ShieldCheck, Database, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function LoginView({ userProfile, onLoginSuccess }) {
  const { theme } = useTheme();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

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
    } else {
      setErrorMessage('Invalid username or password. Check demo credentials below.');
    }
  };

  const handleQuickDemoFill = () => {
    setUsernameInput(userProfile?.username || 'n0vemberain');
    setPasswordInput(userProfile?.password || 'Password123!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col justify-between items-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background ambient decorative glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.accent }}
      />

      {/* Top Header Branding */}
      <header className="w-full max-w-md pt-6 sm:pt-10 flex flex-col items-center text-center z-10">
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center border shadow-xl mb-4`}
          style={{ borderColor: theme.accent + '60' }}
        >
          <CheckSquare className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          DailyTask
        </h1>
        <p className="text-xs sm:text-sm text-github-muted mt-1.5 max-w-xs">
          Personal Activity Dashboard, Habit Tracker and Goal Matrix
        </p>
      </header>

      {/* Login Card */}
      <main className="w-full max-w-sm sm:max-w-md my-auto py-6 z-10">
        <div className="bg-[#161b22] border border-github-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Card Title Bar */}
          <div className="px-6 py-4 border-b border-github-border bg-[#0d1117]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" style={{ color: theme.accent }} />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Authentication Required
              </span>
            </div>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accentLight
              }}
            >
              Session Locked
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/70 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Username / Handle
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-github-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. n0vemberain"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-xl text-sm text-white placeholder-github-muted outline-none transition-colors font-mono focus:border-white/40"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-github-muted absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0d1117] border border-github-border rounded-xl text-sm text-white placeholder-github-muted outline-none transition-colors font-mono focus:border-white/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-github-muted hover:text-white transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Auto-fill Demo credentials */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-github-muted hover:text-white select-none">
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
                className="text-xs font-medium hover:underline transition-colors"
                style={{ color: theme.accentLight }}
              >
                Auto-fill Demo Credentials
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${theme.primaryBtn} shadow-lg transition-all active:scale-[0.99]`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </button>
            </div>
          </form>

          {/* Demo Credentials Reminder Footer inside Card */}
          <div className="px-6 py-3.5 bg-[#0d1117] border-t border-github-border text-center text-[11px] text-github-muted">
            Registered Demo Account:{' '}
            <span className="font-mono text-white font-semibold">n0vemberain</span> /{' '}
            <span className="font-mono text-white font-semibold">Password123!</span>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-md py-4 text-center text-xs text-github-muted z-10 space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Database className="w-3.5 h-3.5" style={{ color: theme.accent }} />
          <span>Dual Persistence: LocalStorage + MongoDB Sync</span>
        </div>
        <p className="text-[11px]">
          All activity data is privately stored and synchronized for authenticated sessions.
        </p>
      </footer>
    </div>
  );
}
