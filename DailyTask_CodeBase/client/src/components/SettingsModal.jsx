import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Settings,
  Palette,
  Database,
  RefreshCw,
  Volume2,
  VolumeX,
  HardDriveDownload,
  Upload,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Info,
  QrCode,
  Globe,
  Smartphone,
  Laptop,
  Wifi,
  Copy,
  Check,
  Share2,
  Plus,
  Users,
  Award,
  Lock
} from 'lucide-react';
import GithubIcon from './GithubIcon';
import { useTheme } from '../context/ThemeContext';
import { soundEffects } from '../utils/audioFeedback';
import { apiService } from '../services/apiService';
import UserManagementSection from './UserManagementSection';
import RecycleBinModal from './RecycleBinModal';

export default function SettingsModal({
  isOpen,
  onClose,
  mongoStatus,
  isSyncing,
  lastSyncTime,
  onManualSync,
  data,
  onRestoreData,
  onOpenCleanCenter,
  userProfile,
  currentUser,
  onSaveProfile,
  initialTab = 'general',
  recycleBin = [],
  onRestoreFromBin,
  onPermanentDeleteFromBin,
  onEmptyBin
}) {
  const { theme, themeId, setThemeId, availableThemes } = useTheme();
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted());
  const [activeTab, setActiveTab] = useState(initialTab);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Skills state
  const [skills, setSkills] = useState(
    Array.isArray(userProfile?.skills) ? userProfile.skills : []
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  // Synchronize skills when userProfile changes
  useEffect(() => {
    if (userProfile?.skills) {
      setSkills(Array.isArray(userProfile.skills) ? userProfile.skills : []);
    }
  }, [userProfile]);

  // Network & Remote Access State
  const [networkInfo, setNetworkInfo] = useState({
    publicUrl: '',
    localhostUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001',
    localNetworkUrl: '',
    isTunnelActive: false
  });
  const [activeUrlType, setActiveUrlType] = useState('public');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedType, setCopiedType] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    apiService
      .getNetworkAccess()
      .then((res) => {
        if (isMounted && res && res.success && res.data) {
          setNetworkInfo(res.data);
          if (!res.data.publicUrl && res.data.localhostUrl) {
            setActiveUrlType('localhost');
          }
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const currentSelectedUrl = useMemo(() => {
    if (activeUrlType === 'public') {
      return (
        networkInfo.publicUrl ||
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001')
      );
    }
    if (activeUrlType === 'lan') {
      return networkInfo.localNetworkUrl || 'http://localhost:5001';
    }
    return networkInfo.localhostUrl || 'http://localhost:5001';
  }, [activeUrlType, networkInfo]);

  useEffect(() => {
    if (!isOpen || !currentSelectedUrl) return;
    let isMounted = true;
    QRCode.toDataURL(currentSelectedUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#0d1117',
        light: '#ffffff'
      }
    })
      .then((url) => {
        if (isMounted) setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentSelectedUrl]);

  if (!isOpen) return null;

  const showNotification = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playSuccess();
    }
  };

  const handleTestSound = () => {
    if (isMuted) {
      setIsMuted(false);
      soundEffects.setMuted(false);
    }
    soundEffects.playCelebration();
    showNotification('Audio tone played successfully.');
  };

  // Export JSON file
  const handleExport = () => {
    try {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        user: data?.user || userProfile,
        tasks: data?.tasks || [],
        challenges: data?.challenges || []
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-task-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showNotification('Backup downloaded successfully.');
    } catch (e) {
      showNotification('Export failed: ' + e.message, 'error');
    }
  };

  // Import JSON file
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.tasks || !parsed.user) {
          throw new Error('Invalid backup file format');
        }

        if (onRestoreData) {
          onRestoreData({
            user: parsed.user,
            tasks: parsed.tasks,
            challenges: parsed.challenges || []
          });
        }

        showNotification('Data restored successfully from backup file.');
      } catch (err) {
        showNotification('Failed to parse JSON file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };

  // Skills Management Handlers
  const handleAddSkill = (skillToAdd) => {
    const target = (skillToAdd || newSkillInput).trim();
    if (!target) return;
    if (skills.some((s) => s.toLowerCase() === target.toLowerCase())) {
      setNewSkillInput('');
      return;
    }
    const updatedSkills = [...skills, target];
    setSkills(updatedSkills);
    setNewSkillInput('');
    if (onSaveProfile && userProfile) {
      onSaveProfile({
        ...userProfile,
        skills: updatedSkills
      });
    }
    showNotification(`Skill added: ${target}`);
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(updatedSkills);
    if (onSaveProfile && userProfile) {
      onSaveProfile({
        ...userProfile,
        skills: updatedSkills
      });
    }
    showNotification(`Skill removed: ${skillToRemove}`);
  };

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
    'Linux',
    'Express.js',
    'REST APIs',
    'PostgreSQL',
    'AWS'
  ];

  const handleCopy = (text, typeKey) => {
    if (!text) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedType(typeKey);
      setTimeout(() => setCopiedType(null), 2500);
      showNotification('Copied to clipboard.');
    }
  };

  const isMongoOnline = mongoStatus?.isMongoConnected;
  const activeUser = currentUser || userProfile;
  const isAdmin =
    activeUser?.role === 'admin' ||
    userProfile?.role === 'admin' ||
    activeUser?.username === 'n0vemberain';

  // Reactive navigation tabs configuration
  const navigationTabs = [
    { id: 'general', label: 'Theme & Preferences', icon: Palette, badge: null },
    { id: 'skills', label: 'Skills & Badges', icon: Award, badge: skills.length > 0 ? skills.length : null },
    { id: 'network', label: 'Remote Access & QR', icon: QrCode, badge: null },
    ...(isAdmin ? [{ id: 'users', label: 'User Management', icon: Users, badge: 'Admin' }] : []),
    { id: 'sync', label: 'Sync & Backup', icon: Database, badge: null }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-[#161b22] border border-github-border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-github-border bg-[#0d1117] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accent
              }}
            >
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Application Settings</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-github-muted hover:text-white hover:bg-[#21262d] transition-colors"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reactive Navigation Menu Bar */}
        <div className="bg-[#0d1117]/80 border-b border-github-border px-3 sm:px-6 py-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all select-none border whitespace-nowrap ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-github-muted hover:text-white hover:bg-[#161b22] border-transparent'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: theme.accentDark,
                          borderColor: theme.accent + '60',
                          color: theme.accentLight
                        }
                      : {}
                  }
                >
                  <Icon
                    className="w-3.5 h-3.5 flex-shrink-0 transition-transform"
                    style={{ color: isActive ? theme.accent : undefined }}
                  />
                  <span>{tab.label}</span>
                  {tab.badge !== null && (
                    <span
                      className="text-[10px] px-1.5 py-0.2 rounded-full font-mono border"
                      style={
                        isActive
                          ? {
                              backgroundColor: theme.accent + '30',
                              borderColor: theme.accent + '50',
                              color: '#ffffff'
                            }
                          : {
                              backgroundColor: '#21262d',
                              borderColor: '#30363d',
                              color: '#8b949e'
                            }
                      }
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status notification toast */}
        {statusMessage && (
          <div
            className={`mx-5 sm:mx-6 mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 flex-shrink-0 animate-in fade-in ${
              statusMessage.type === 'error'
                ? 'bg-red-950/70 border-red-700/60 text-red-300'
                : 'bg-[#0d1117] border-white/20 text-white'
            }`}
            style={
              statusMessage.type !== 'error'
                ? {
                    backgroundColor: theme.accentDark,
                    borderColor: theme.accent + '50',
                    color: theme.accentLight
                  }
                : {}
            }
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Modal Body Content (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* TAB 1: General (Theme, Sound, Repo) */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Theme Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4" style={{ color: theme.accent }} />
                    <span className="font-bold text-white text-sm">Application Color Theme</span>
                  </div>
                  <span
                    className="text-[11px] font-mono px-2.5 py-1 rounded-md border flex-shrink-0"
                    style={{
                      backgroundColor: theme.accentDark,
                      borderColor: theme.accent + '40',
                      color: theme.accentLight
                    }}
                  >
                    Active: {theme.name}
                  </span>
                </div>
                <p className="text-github-muted text-xs leading-relaxed">
                  Select a color palette. Changes take effect across the entire application, heatmap, navigation, and badges instantly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {Object.values(availableThemes).map((t) => {
                    const isSelected = t.id === themeId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setThemeId(t.id)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all h-full min-h-[64px] ${
                          isSelected
                            ? 'bg-[#21262d] border-white text-white shadow-md ring-1 ring-white/20'
                            : 'bg-[#0d1117] border-github-border text-github-text hover:bg-[#161b22] hover:border-github-borderLight'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: t.accent }}
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-xs text-white truncate">{t.name}</div>
                            <div className="text-[11px] text-github-muted truncate">
                              {t.id === 'olive' ? 'GitHub Original' : `${t.name.split(' ')[0]} Accent`}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          {t.hexLevels.slice(1).map((hex, i) => (
                            <span
                              key={i}
                              className="w-2.5 h-5 rounded-[2px]"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound Feedback Card */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-github-muted flex-shrink-0" />
                    ) : (
                      <Volume2 className="w-4 h-4 flex-shrink-0" style={{ color: theme.accent }} />
                    )}
                    <span className="font-bold text-white text-sm">Audio Feedback</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap flex-shrink-0 ${
                      isMuted
                        ? 'bg-[#21262d] border-github-border text-github-muted hover:text-white'
                        : 'text-white border-white/30'
                    }`}
                    style={
                      !isMuted
                        ? {
                            backgroundColor: theme.accentDark,
                            borderColor: theme.accent + '50',
                            color: theme.accentLight
                          }
                        : {}
                    }
                  >
                    {isMuted ? 'Sound Disabled' : 'Sound Enabled'}
                  </button>
                </div>
                <p className="text-github-muted text-xs leading-relaxed">
                  Plays harmonic chimes synthesized using the browser Web Audio API upon completing tasks or challenge milestones.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleTestSound}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#161b22] hover:bg-[#21262d] text-white border border-github-border transition-colors flex items-center gap-1.5 w-fit"
                  >
                    <Volume2 className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    <span>Play Test Tone</span>
                  </button>
                </div>
              </div>

              {/* App Info & GitHub Repository Card */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-white text-xs">Application Repository</span>
                  <div className="text-[11px] text-github-muted mt-0.5">
                    Version 1.2.0 • React 18, Vite, Tailwind CSS, Express, MongoDB
                  </div>
                </div>
                <a
                  href="https://github.com/n0vemberain/daily-task"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-github-border text-xs font-medium transition-colors w-fit flex-shrink-0"
                  style={{ color: theme.accentLight }}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>n0vemberain/daily-task</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 2: Skills & Badges */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4" style={{ color: theme.accent }} />
                  <span>Technical Skills &amp; Competencies ({skills.length})</span>
                </h4>
                <p className="text-github-muted text-xs mt-0.5">
                  Manage your active engineering skills, tools, and technical competencies.
                </p>
              </div>

              {/* Active Skills Badges Container */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border min-h-[90px] flex items-center">
                {skills.length === 0 ? (
                  <span className="text-xs text-github-muted italic">
                    No skills listed yet. Add some below.
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2 w-full">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm transition-all"
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
                          className="hover:text-red-400 p-0.5 rounded-full transition-colors flex-shrink-0"
                          title={`Remove ${skill}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Input to Add Custom Skill */}
              <div className="flex flex-col sm:flex-row gap-2">
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
                  className="flex-1 min-w-0 px-3.5 py-2.5 bg-[#0d1117] border border-github-border rounded-xl text-xs text-white placeholder-github-muted outline-none focus:border-white/40"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold ${theme.primaryBtn} transition-colors whitespace-nowrap`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>

              {/* Suggested Skill Quick-add Pills */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border space-y-2.5">
                <span className="text-xs font-semibold text-white">Quick Add Suggestions:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestedSkills
                    .filter((s) => !skills.includes(s))
                    .slice(0, 10)
                    .map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-github-muted hover:text-white border border-github-border transition-colors whitespace-nowrap"
                      >
                        <Plus className="w-3 h-3 text-github-muted" />
                        <span>{s}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Remote Access & QR Code */}
          {activeTab === 'network' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-github-border">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <QrCode className="w-4 h-4" style={{ color: theme.accent }} />
                    <span>Multi-Device &amp; Remote Network Access</span>
                  </h4>
                  <p className="text-xs text-github-muted mt-0.5">
                    Access DailyTask from other devices (smartphones, laptops, tablets) or any external network.
                  </p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full font-mono bg-blue-950/60 text-blue-300 border border-blue-800/50 flex items-center gap-1 whitespace-nowrap">
                  <Globe className="w-3 h-3 text-blue-400" />
                  Remote &amp; Local
                </span>
              </div>

              {/* Balanced Two-Column Responsive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Left: QR Code Card */}
                <div className="lg:col-span-5 flex flex-col items-center justify-between p-5 rounded-xl bg-[#0d1117] border border-github-border text-center">
                  <div className="text-xs font-semibold text-github-text uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Smartphone className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    <span>Scan QR Code on Phone</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl shadow-lg border border-white/20 my-2 flex items-center justify-center">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="DailyTask Mobile Access QR Code"
                        className="w-44 h-44 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-gray-500 font-mono text-xs">
                        Generating QR Code...
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-github-muted mt-1 max-w-[240px] leading-relaxed">
                    Scan with phone camera to open DailyTask immediately on your mobile browser.
                  </p>

                  {/* Active URL selector tabs */}
                  <div className="flex items-center gap-1 mt-4 w-full bg-[#161b22] p-1 rounded-lg border border-github-border text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveUrlType('public')}
                      className={`flex-1 py-1.5 rounded text-center font-medium transition-all ${
                        activeUrlType === 'public'
                          ? 'bg-white text-black font-semibold shadow-sm'
                          : 'text-github-muted hover:text-white'
                      }`}
                    >
                      Public
                    </button>
                    {networkInfo.localNetworkUrl && (
                      <button
                        type="button"
                        onClick={() => setActiveUrlType('lan')}
                        className={`flex-1 py-1.5 rounded text-center font-medium transition-all ${
                          activeUrlType === 'lan'
                            ? 'bg-white text-black font-semibold shadow-sm'
                            : 'text-github-muted hover:text-white'
                        }`}
                      >
                        LAN Wi-Fi
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveUrlType('localhost')}
                      className={`flex-1 py-1.5 rounded text-center font-medium transition-all ${
                        activeUrlType === 'localhost'
                          ? 'bg-white text-black font-semibold shadow-sm'
                          : 'text-github-muted hover:text-white'
                      }`}
                    >
                      Localhost
                    </button>
                  </div>
                </div>

                {/* Right: Direct Link Cards */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-3">
                  {/* Public Link Card */}
                  <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border flex flex-col justify-between gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-semibold text-white text-xs truncate">
                        <Globe className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="truncate">Public Internet Access</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 flex-shrink-0">
                        {networkInfo.isTunnelActive ? 'Active Tunnel' : 'Remote'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={networkInfo.publicUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001')}
                        className="flex-1 min-w-0 bg-[#161b22] border border-github-border rounded-lg px-3 py-2 text-xs text-white font-mono outline-none truncate"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(networkInfo.publicUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001'), 'public')}
                        className="flex-shrink-0 px-3.5 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors flex items-center gap-1.5 text-xs font-medium"
                        title="Copy Public URL"
                      >
                        {copiedType === 'public' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-github-muted" />
                        )}
                        <span>{copiedType === 'public' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Wi-Fi LAN Link Card */}
                  {networkInfo.localNetworkUrl && (
                    <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border flex flex-col justify-between gap-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-semibold text-white text-xs truncate">
                          <Wifi className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">Same Wi-Fi Network (LAN)</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-950/60 text-blue-300 border border-blue-800/40 flex-shrink-0">
                          Local IP
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={networkInfo.localNetworkUrl}
                          className="flex-1 min-w-0 bg-[#161b22] border border-github-border rounded-lg px-3 py-2 text-xs text-white font-mono outline-none truncate"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(networkInfo.localNetworkUrl, 'lan')}
                          className="flex-shrink-0 px-3.5 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors flex items-center gap-1.5 text-xs font-medium"
                          title="Copy LAN URL"
                        >
                          {copiedType === 'lan' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-github-muted" />
                          )}
                          <span>{copiedType === 'lan' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Localhost Link Card */}
                  <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border flex flex-col justify-between gap-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-semibold text-white text-xs truncate">
                        <Laptop className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="truncate">Localhost Machine</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40 flex-shrink-0">
                        Loopback
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={networkInfo.localhostUrl}
                        className="flex-1 min-w-0 bg-[#161b22] border border-github-border rounded-lg px-3 py-2 text-xs text-white font-mono outline-none truncate"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(networkInfo.localhostUrl, 'localhost')}
                        className="flex-shrink-0 px-3.5 py-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors flex items-center gap-1.5 text-xs font-medium"
                        title="Copy Localhost URL"
                      >
                        {copiedType === 'localhost' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-github-muted" />
                        )}
                        <span>{copiedType === 'localhost' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: User Management (Admin Only) */}
          {activeTab === 'users' && isAdmin && (
            <div className="space-y-4 animate-in fade-in">
              <UserManagementSection
                currentUser={currentUser || userProfile}
                theme={theme}
                embedded={true}
              />
            </div>
          )}

          {/* TAB 5: Sync & Data Portability */}
          {activeTab === 'sync' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Persistence & Database Sync Card */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Database className="w-4 h-4 flex-shrink-0" style={{ color: theme.accent }} />
                    <span className="font-bold text-white text-sm">Dual Persistence &amp; Sync</span>
                  </div>
                  <button
                    type="button"
                    onClick={onManualSync}
                    disabled={isSyncing}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold ${theme.primaryBtn} transition-all disabled:opacity-50 flex-shrink-0`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#161b22] border border-github-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-github-muted">Database State:</span>
                    <span className="flex items-center gap-1.5 font-mono text-white">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isMongoOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      <span>{isMongoOnline ? 'MongoDB & LocalStorage Synced' : 'LocalStorage Active'}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-github-muted pt-1 border-t border-github-border">
                    <span>Last Synchronization:</span>
                    <span className="font-mono">
                      {lastSyncTime
                        ? new Date(lastSyncTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })
                        : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Export Card */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm">Download Backup (JSON)</div>
                  <div className="text-[11px] text-github-muted">
                    Saves all tasks, challenge records, heatmap activity, and user profile to a JSON file.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ${theme.primaryBtn} shadow-sm transition-all whitespace-nowrap flex-shrink-0`}
                >
                  <HardDriveDownload className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
              </div>

              {/* Data Import Card */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm">Restore from Backup</div>
                  <div className="text-[11px] text-github-muted">
                    Restores dashboard data from a previously downloaded backup.
                  </div>
                </div>
                <label className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border cursor-pointer transition-colors whitespace-nowrap flex-shrink-0">
                  <Upload className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 30-Day Recycle Bin Card */}
              <div className="p-4 rounded-xl bg-[#0d1117] border border-github-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-emerald-400" />
                    <span>Recycle Bin</span>
                    {Array.isArray(recycleBin) && recycleBin.length > 0 && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {recycleBin.length} items
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-github-muted leading-relaxed">
                    Deleted tasks, challenges, and timer sessions are safely kept for 30 days before permanent removal.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRecycleBinOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border transition-colors whitespace-nowrap shadow-sm flex items-center justify-center gap-1.5 flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                  <span>Open Recycle Bin</span>
                </button>
              </div>

              {/* Clean Center Launcher (Danger Zone) */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-red-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>Data Clean Center</span>
                  </div>
                  <div className="text-[11px] text-github-muted mt-1 leading-relaxed">
                    Protected zone to clean finished tasks, clear challenges, or factory reset data. Requires password.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenCleanCenter) onOpenCleanCenter();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-950 hover:bg-red-900 text-red-200 border border-red-800/60 transition-colors whitespace-nowrap shadow-sm flex-shrink-0"
                >
                  Open Clean Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer */}
        <div className="px-6 py-3 bg-[#0d1117] border-t border-github-border flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#21262d] hover:bg-[#30363d] rounded-xl border border-github-border transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>

      {/* 30-Day Recycle Bin Modal Dialog */}
      <RecycleBinModal
        isOpen={isRecycleBinOpen}
        onClose={() => setIsRecycleBinOpen(false)}
        recycleBin={recycleBin}
        onRestore={onRestoreFromBin}
        onPermanentDelete={onPermanentDeleteFromBin}
        onEmptyBin={onEmptyBin}
        userProfile={userProfile}
      />
    </div>
  );
}
