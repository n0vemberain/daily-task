import React, { useState } from 'react';
import {
  User,
  Upload,
  Camera,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  Plus,
  X,
  CheckCircle2,
  HardDrive,
  Database,
  Lock,
  AtSign,
  LogOut,
  LogIn,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function UserProfile({
  userProfile,
  onSaveProfile,
  mongoStatus,
  lastSyncTime,
  isAuthenticated = true,
  onOpenLogin,
  onSignOut,
  onOpenCleanModal
}) {
  const { theme } = useTheme();
  const [name, setName] = useState(userProfile?.name || 'Fatin Ishraque');
  const [username, setUsername] = useState(userProfile?.username || 'n0vemberain');
  const [fieldOfStudy, setFieldOfStudy] = useState(
    userProfile?.fieldOfStudy || 'Computer Science & Engineering'
  );
  const [skills, setSkills] = useState(userProfile?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');
  const [savedAlert, setSavedAlert] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Password Management: never expose raw password in input on load
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const suggestedSkills = [
    'React.js',
    'TypeScript',
    'Node.js',
    'Python',
    'MongoDB',
    'Tailwind CSS',
    'Docker',
    'Next.js',
    'GraphQL',
    'Git & GitHub',
    'System Design',
    'FastAPI'
  ];

  // Handle Photo upload and convert to base64
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
  };

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkillInput).trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    let finalPassword = userProfile?.password || 'Password123!';

    if (isChangingPassword) {
      if (!currentPasswordInput) {
        setPasswordError('Please enter your current password to authorize change.');
        return;
      }
      if (currentPasswordInput !== (userProfile?.password || 'Password123!')) {
        setPasswordError('Current password does not match.');
        return;
      }
      if (!newPasswordInput || newPasswordInput.length < 6) {
        setPasswordError('New password must be at least 6 characters.');
        return;
      }
      if (newPasswordInput !== confirmPasswordInput) {
        setPasswordError('New password and confirm password do not match.');
        return;
      }
      finalPassword = newPasswordInput;
    }

    const updated = {
      name: name.trim(),
      username: username.trim(),
      password: finalPassword,
      fieldOfStudy: fieldOfStudy.trim(),
      skills,
      avatarUrl
    };

    onSaveProfile(updated);
    setSavedAlert(true);
    if (isChangingPassword) {
      setIsChangingPassword(false);
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    }
    setTimeout(() => setSavedAlert(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl border flex items-center justify-center"
            style={{
              backgroundColor: theme.accentDark,
              borderColor: theme.accent + '40',
              color: theme.accent
            }}
          >
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">User Profile &amp; Settings</h2>
            <p className="text-xs text-github-muted">
              Configure personal credentials, field of study, and individual profile options
            </p>
          </div>
        </div>

        {/* Persistence & Active Theme Pill */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-github-muted">
          <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-1.5 rounded-lg border border-github-border">
            <Database className="w-3.5 h-3.5" style={{ color: theme.accent }} />
            <span>MongoDB &amp; LocalStorage</span>
          </div>
          <div
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold border"
            style={{
              backgroundColor: theme.accentDark,
              borderColor: theme.accent + '50',
              color: theme.accentLight
            }}
          >
            Theme: {theme.name}
          </div>
        </div>
      </div>

      {/* Authentication & Session Management Card */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg border ${
              isAuthenticated
                ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-400'
                : 'bg-amber-950/60 border-amber-700/50 text-amber-400'
            }`}
          >
            {isAuthenticated ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {isAuthenticated ? 'Authenticated Account Session' : 'Guest / Locked Session'}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                  isAuthenticated
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                    : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                }`}
              >
                {isAuthenticated ? 'Active' : 'Locked'}
              </span>
            </div>
            <p className="text-xs text-github-muted mt-0.5">
              {isAuthenticated
                ? `Signed in as @${username || 'user'}. Data modifications are synced to your account.`
                : 'Session is currently in guest read-only view. Sign in to edit or clean data.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={onSignOut}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-red-950/40 text-red-300 border border-github-border hover:border-red-800/50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / Sign Out</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold ${theme.primaryBtn} transition-all`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#161b22] border border-github-border rounded-xl p-6 shadow-sm space-y-6">
          {/* Profile Photo Section */}
          <div className="pb-6 border-b border-github-border">
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-3">
              Profile Photo &amp; Avatar
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-24 h-24 rounded-full object-cover border-2 shadow-lg"
                    style={{ borderColor: theme.accent }}
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex flex-col items-center justify-center font-bold text-2xl shadow-inner border-2 border-dashed"
                    style={{
                      backgroundColor: theme.accentDark,
                      borderColor: theme.accent + '70',
                      color: theme.accentLight
                    }}
                  >
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 p-2 rounded-full text-white cursor-pointer shadow-md border border-white/20 transition-all hover:scale-105"
                  style={{ backgroundColor: theme.accent }}
                  title="Upload New Photo"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Upload Controls */}
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    <span>Upload New Photo</span>
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/30 border border-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-github-muted">
                  Supports JPG, PNG, GIF, or WebP up to 5MB. Stored locally and persisted to MongoDB.
                </p>
              </div>
            </div>
          </div>

          {/* Account Credentials Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-github-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fatin Ishraque"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-sm text-white placeholder-github-muted focus:border-olive-500 focus:ring-1 focus:ring-olive-500 outline-none"
                  style={{ '--tw-ring-color': theme.accent }}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Username / Login ID *
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-github-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. n0vemberain"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-sm text-white placeholder-github-muted outline-none font-mono focus:border-olive-500"
                />
              </div>
            </div>

            {/* Password Credentials - Hidden & Protected */}
            <div>
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Account Password
              </label>
              <div className="bg-[#0d1117] border border-github-border rounded-lg p-2.5 sm:p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-md bg-[#161b22] border border-github-border text-github-muted flex-shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-sm tracking-widest text-github-muted select-none truncate">
                      ••••••••••••
                    </div>
                    <div className="text-[10px] text-github-muted flex items-center gap-1 mt-0.5 whitespace-nowrap">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Password secured and hidden</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(!isChangingPassword);
                    setPasswordError('');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {isChangingPassword ? 'Cancel Change' : 'Change Password'}
                </button>
              </div>

              {/* Expandable Change Password Section */}
              {isChangingPassword && (
                <div className="mt-3 p-3.5 rounded-xl bg-[#0d1117] border border-github-border space-y-3 animate-in fade-in">
                  <div className="text-xs font-semibold text-white flex items-center justify-between">
                    <span>Change Account Password</span>
                    <span className="text-[10px] text-github-muted font-mono">Protected</span>
                  </div>

                  {passwordError && (
                    <div className="p-2 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] text-github-muted mb-1">
                      Current Password (Required)
                    </label>
                    <input
                      type="password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 bg-[#161b22] border border-github-border rounded-lg text-xs text-white outline-none focus:border-olive-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-github-muted mb-1">
                        New Password
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="New password (min 6 chars)"
                        className="w-full px-3 py-2 bg-[#161b22] border border-github-border rounded-lg text-xs text-white outline-none focus:border-olive-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-github-muted mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={confirmPasswordInput}
                        onChange={(e) => setConfirmPasswordInput(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-3 py-2 bg-[#161b22] border border-github-border rounded-lg text-xs text-white outline-none focus:border-olive-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-[11px] text-github-muted hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showNewPassword ? 'Hide inputs' : 'Show new password'}</span>
                    </button>
                    <span className="text-[10px] text-github-muted">
                      Save profile to apply
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Current Field of Study *
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-github-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-sm text-white placeholder-github-muted outline-none focus:border-olive-500"
                />
              </div>
            </div>
          </div>

          {/* Extra Skills Section */}
          <div className="pt-4 border-t border-github-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider">
                Individual Skills &amp; Competencies ({skills.length})
              </label>
              <span className="text-[11px] text-github-muted">
                Press Enter or click Add to append
              </span>
            </div>

            {/* Active Skills Badges */}
            <div className="flex flex-wrap gap-2 min-h-10 p-3 bg-[#0d1117] border border-github-border rounded-lg">
              {skills.length === 0 ? (
                <span className="text-xs text-github-muted italic">
                  No skills listed yet. Add some below.
                </span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-sm"
                    style={{
                      backgroundColor: theme.accentDark,
                      borderColor: theme.accent + '40',
                      color: theme.accentLight
                    }}
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-400 p-0.5 rounded-full transition-colors"
                      title="Remove skill"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Input to Add Custom Skill */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type a skill (e.g. Next.js, Redis, Docker) and press Enter..."
                className="flex-1 px-3.5 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none focus:border-olive-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold ${theme.primaryBtn} transition-colors`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Suggested Skill Quick-add Pills */}
            <div>
              <span className="text-[11px] text-github-muted mr-2">Quick Add Suggestions:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {suggestedSkills
                  .filter((s) => !skills.includes(s))
                  .slice(0, 8)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-github-muted hover:text-white border border-github-border transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{s}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar & Alerts */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#161b22] border border-github-border rounded-xl p-4">
          <div className="text-xs text-github-muted flex items-center gap-2">
            <HardDrive className="w-4 h-4" style={{ color: theme.accent }} />
            <span>
              Instant LocalStorage auto-save &amp; background MongoDB sync
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {savedAlert && (
              <span className="flex items-center gap-1 text-xs text-emerald-300 font-medium animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Saved successfully!
              </span>
            )}
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold ${theme.primaryBtn} shadow-md transition-all`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </div>
      </form>

      {/* Advanced Data Clean & Factory Reset Section */}
      <div className="bg-[#161b22] border border-red-900/40 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-800/40 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Data Management &amp; Cleanup Center</h3>
              <p className="text-xs text-github-muted">
                Clean completed tasks, wipe all challenges, or perform full factory database wipe
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenCleanModal}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/50 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Open Clean Center</span>
          </button>
        </div>
      </div>
    </div>
  );
}
