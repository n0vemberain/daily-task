import React, { useState } from 'react';
import {
  User,
  Upload,
  Camera,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  HardDrive,
  Database,
  Lock,
  AtSign
} from 'lucide-react';

export default function UserProfile({
  userProfile,
  onSaveProfile,
  mongoStatus,
  lastSyncTime
}) {
  const [name, setName] = useState(userProfile?.name || 'Fatin Ishraque');
  const [username, setUsername] = useState(userProfile?.username || 'n0vemberain');
  const [password, setPassword] = useState(userProfile?.password || '••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldOfStudy, setFieldOfStudy] = useState(
    userProfile?.fieldOfStudy || 'Computer Science & Engineering'
  );
  const [skills, setSkills] = useState(userProfile?.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');
  const [savedAlert, setSavedAlert] = useState(false);

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
    const updated = {
      name: name.trim(),
      username: username.trim(),
      password,
      fieldOfStudy: fieldOfStudy.trim(),
      skills,
      avatarUrl
    };

    onSaveProfile(updated);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#161b22] border border-github-border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-olive-950 border border-olive-700/40 text-olive-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">User Profile & Academic Credentials</h2>
            <p className="text-xs text-github-muted">
              Configure personal details, study field, and skill tags with dual MongoDB & LocalStorage persistence
            </p>
          </div>
        </div>

        {/* Persistence Status Badge */}
        <div className="flex items-center gap-2 text-xs text-github-muted bg-[#0d1117] px-3 py-1.5 rounded-lg border border-github-border">
          <Database className="w-3.5 h-3.5 text-olive-400" />
          <span>MongoDB & LocalStorage Sync</span>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#161b22] border border-github-border rounded-xl p-6 shadow-sm space-y-6">
          {/* Profile Photo Section */}
          <div className="pb-6 border-b border-github-border">
            <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-3">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-olive-500 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-olive-950 border-2 border-dashed border-olive-700/60 text-olive-300 flex flex-col items-center justify-center font-bold text-2xl shadow-inner">
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}

                <label
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-olive-700 text-white hover:bg-olive-600 cursor-pointer shadow-md border border-white/20 transition-all"
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
                    <Upload className="w-3.5 h-3.5 text-olive-400" />
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
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
                GitHub / App Username *
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-github-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. n0vemberain"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-sm text-white placeholder-github-muted focus:border-olive-500 focus:ring-1 focus:ring-olive-500 outline-none font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1.5">
                Account Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-github-muted absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-sm text-white focus:border-olive-500 focus:ring-1 focus:ring-olive-500 outline-none font-mono"
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
                  placeholder="e.g. Computer Science & Engineering, Software Engineering"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-lg text-sm text-white placeholder-github-muted focus:border-olive-500 focus:ring-1 focus:ring-olive-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Extra Skills Section */}
          <div className="pt-4 border-t border-github-border space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-github-text uppercase tracking-wider">
                Extra Skills & Competencies ({skills.length})
              </label>
              <span className="text-[11px] text-github-muted">
                Press Enter or click Add to append
              </span>
            </div>

            {/* Active Skills Badges */}
            <div className="flex flex-wrap gap-2 min-h-10 p-3 bg-[#0d1117] border border-github-border rounded-lg">
              {skills.length === 0 ? (
                <span className="text-xs text-github-muted italic">
                  No extra skills listed yet. Add some below!
                </span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-olive-950 text-olive-300 border border-olive-700/50 shadow-sm"
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
                className="flex-1 px-3.5 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted focus:border-olive-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-olive-800 hover:bg-olive-700 text-white border border-olive-600/40 transition-colors"
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
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#21262d] hover:bg-[#30363d] text-github-muted hover:text-olive-300 border border-github-border transition-colors flex items-center gap-1"
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
            <HardDrive className="w-4 h-4 text-olive-400" />
            <span>
              Instant LocalStorage auto-save &amp; background MongoDB sync
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {savedAlert && (
              <span className="flex items-center gap-1 text-xs text-olive-300 font-medium animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-olive-400" />
                Saved to LocalStorage &amp; MongoDB!
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold bg-olive-700 hover:bg-olive-600 text-white shadow-md border border-olive-500/40 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
