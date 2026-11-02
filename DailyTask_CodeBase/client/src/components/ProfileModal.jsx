import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Camera,
  Upload,
  Trash2,
  Lock,
  AtSign,
  GraduationCap,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ProfileModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile
}) {
  const { theme } = useTheme();

  const [name, setName] = useState(userProfile?.name || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(userProfile?.fieldOfStudy || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');
  const [savedAlert, setSavedAlert] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Password Management
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setUsername(userProfile.username || '');
      setFieldOfStudy(userProfile.fieldOfStudy || '');
      setAvatarUrl(userProfile.avatarUrl || '');
    }
  }, [userProfile]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Photo file size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarUrl(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    let finalPassword = userProfile?.password || 'Password123!';

    if (isChangingPassword) {
      if (!currentPasswordInput.trim()) {
        setPasswordError('Current account password is required.');
        return;
      }

      const expectedCurrent = userProfile?.password || 'Password123!';
      if (currentPasswordInput !== expectedCurrent) {
        setPasswordError('Current password does not match account records.');
        return;
      }

      if (!newPasswordInput.trim() || newPasswordInput.length < 4) {
        setPasswordError('New password must be at least 4 characters long.');
        return;
      }

      if (newPasswordInput !== confirmPasswordInput) {
        setPasswordError('New password confirmation does not match.');
        return;
      }

      finalPassword = newPasswordInput.trim();
    }

    const updated = {
      ...(userProfile || {}),
      name: name.trim() || 'User',
      username: username.trim().toLowerCase() || 'user',
      fieldOfStudy: fieldOfStudy.trim() || 'General',
      avatarUrl: avatarUrl || '',
      password: finalPassword
    };

    if (onSaveProfile) {
      onSaveProfile(updated);
    }

    setSavedAlert(true);
    setIsChangingPassword(false);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');

    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#161b22] border border-github-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-github-border bg-[#0d1117]">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accent
              }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">User Profile</h3>
              <p className="text-xs text-github-muted">
                Profile photo, account identity, password, and study field
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Alert Banner */}
        {savedAlert && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>Profile information updated and saved successfully.</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Profile Photo & Avatar Section */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-2.5">
              Profile Photo &amp; Avatar
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0d1117] p-4 rounded-xl border border-github-border">
              {/* Avatar Preview */}
              <div className="relative group flex-shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-20 h-20 rounded-full object-cover border-2 shadow-md"
                    style={{ borderColor: theme.accent }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl border-2 border-dashed"
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
                  htmlFor="profile-modal-photo"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full text-white cursor-pointer shadow-md border border-white/20 transition-transform hover:scale-110"
                  style={{ backgroundColor: theme.accent }}
                  title="Upload New Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </label>
                <input
                  id="profile-modal-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Upload & Remove Controls */}
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <label
                    htmlFor="profile-modal-photo"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    <span>Upload Photo</span>
                  </label>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/30 border border-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-github-muted">
                  Supports JPG, PNG, GIF, or WebP. Preserved across sessions.
                </p>
              </div>
            </div>
          </div>

          {/* Full Name Input */}
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
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* User ID / Username Input */}
          <div>
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
              User ID / Username *
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 text-github-muted absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. n0vemberain"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none font-mono focus:border-white/40"
              />
            </div>
          </div>

          {/* Current Field of Study Input */}
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
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Account Password Section */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider">
              Account Password
            </label>
            <div className="bg-[#0d1117] border border-github-border rounded-lg p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-md bg-[#161b22] border border-github-border text-github-muted flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-xs tracking-widest text-github-muted select-none">
                    ••••••••••••
                  </div>
                  <div className="text-[10px] text-github-muted flex items-center gap-1 mt-0.5">
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

            {/* Expandable Change Password Drawer */}
            {isChangingPassword && (
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-github-border space-y-3 animate-in fade-in">
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>Update Account Password</span>
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
                    className="w-full px-3 py-2 bg-[#161b22] border border-github-border rounded-lg text-xs text-white outline-none focus:border-white/40 font-mono"
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
                      placeholder="Min 4 characters"
                      className="w-full px-3 py-2 bg-[#161b22] border border-github-border rounded-lg text-xs text-white outline-none focus:border-white/40 font-mono"
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
                      className="w-full px-3 py-2 bg-[#161b22] border border-github-border rounded-lg text-xs text-white outline-none focus:border-white/40 font-mono"
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

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-github-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-github-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl text-xs font-semibold ${theme.primaryBtn} shadow-md transition-all`}
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
