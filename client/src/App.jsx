import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import ContributionHeatmap from './components/ContributionHeatmap';
import ChallengeTracker from './components/ChallengeTracker';
import TaskManager from './components/TaskManager';
import UserProfile from './components/UserProfile';
import SettingsModal from './components/SettingsModal';
import DataCleanModal from './components/DataCleanModal';
import FocusTimer from './components/FocusTimer';
import LoginView from './components/LoginView';
import MobileBottomNav from './components/MobileBottomNav';
import { storageService } from './services/storageService';
import { apiService } from './services/apiService';
import { formatDateStr, initialUserProfile, initialTasks, initialChallenges, initialTimerSessions } from './data/initialData';
import { Calendar, Flame, CheckSquare, Database, Quote, Timer } from 'lucide-react';
import GithubIcon from './components/GithubIcon';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(null);

  // Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCleanCenterOpen, setIsCleanCenterOpen] = useState(false);

  // Core State initialized from LocalStorage
  const [userProfile, setUserProfile] = useState(() => storageService.getUserProfile());
  const [tasks, setTasks] = useState(() => storageService.getTasks());
  const [challenges, setChallenges] = useState(() => storageService.getChallenges());
  const [timerSessions, setTimerSessions] = useState(() => storageService.getTimerSessions());

  // Authentication State: MUST be explicitly true to access the dashboard
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('daily_task_auth_session') === 'true';
  });

  // MongoDB & Sync State
  const [mongoStatus, setMongoStatus] = useState({ connected: false, isMongoConnected: false });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(() => storageService.getLastSync());

  // Daily Motivational Quote
  const quotes = [
    { text: "Consistency is what transforms average into excellence.", author: "Anonymous" },
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
    { text: "Focus on the step in front of you, not the whole staircase.", author: "Anonymous" },
    { text: "Action isn't just the effect of motivation; it's also the cause of it.", author: "Mark Manson" }
  ];
  const todayQuote = quotes[new Date().getDate() % quotes.length];

  // Check backend server & MongoDB status on start
  const checkServerStatus = useCallback(async () => {
    const status = await apiService.checkHealth();
    setMongoStatus(status);
    return status;
  }, []);

  // Bi-directional full sync across devices
  const performSync = useCallback(
    async (currentData = null) => {
      setIsSyncing(true);
      const dataToSync = currentData || {
        user: storageService.getUserProfile(),
        tasks: storageService.getTasks(),
        challenges: storageService.getChallenges(),
        timerSessions: storageService.getTimerSessions()
      };

      const result = await apiService.syncAll(dataToSync);
      const now = new Date().toISOString();

      if (result && result.success && result.data) {
        if (result.data.user) {
          setUserProfile(result.data.user);
          storageService.saveUserProfile(result.data.user);
        }
        if (Array.isArray(result.data.tasks) && result.data.tasks.length > 0) {
          setTasks(result.data.tasks);
          storageService.saveTasks(result.data.tasks);
        }
        if (Array.isArray(result.data.challenges) && result.data.challenges.length > 0) {
          setChallenges(result.data.challenges);
          storageService.saveChallenges(result.data.challenges);
        }
        if (Array.isArray(result.data.timerSessions) && result.data.timerSessions.length > 0) {
          setTimerSessions(result.data.timerSessions);
          storageService.saveTimerSessions(result.data.timerSessions);
        }
        setMongoStatus({ connected: true, isMongoConnected: !!result.data.isMongoConnected });
      }

      setLastSyncTime(now);
      storageService.setLastSync(now);
      setIsSyncing(false);
    },
    []
  );

  useEffect(() => {
    // Initial fetch from central server on mount so new devices immediately get server data
    apiService.getFullData().then((res) => {
      if (res && res.success && res.data) {
        if (res.data.user) {
          setUserProfile(res.data.user);
          storageService.saveUserProfile(res.data.user);
        }
        if (Array.isArray(res.data.tasks) && res.data.tasks.length > 0) {
          setTasks(res.data.tasks);
          storageService.saveTasks(res.data.tasks);
        }
        if (Array.isArray(res.data.challenges) && res.data.challenges.length > 0) {
          setChallenges(res.data.challenges);
          storageService.saveChallenges(res.data.challenges);
        }
        if (Array.isArray(res.data.timerSessions) && res.data.timerSessions.length > 0) {
          setTimerSessions(res.data.timerSessions);
          storageService.saveTimerSessions(res.data.timerSessions);
        }
      }
      checkServerStatus();
    }).catch(() => {
      checkServerStatus();
    });

    // Periodic background sync every 20 seconds to keep all open devices in sync
    const interval = setInterval(() => {
      performSync();
    }, 20000);

    return () => clearInterval(interval);
  }, [checkServerStatus, performSync]);

  // Handlers for Authentication
  const handleLoginSuccess = ({ rememberMe, username }) => {
    setIsAuthenticated(true);
    localStorage.setItem('daily_task_auth_session', 'true');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('daily_task_auth_session');
  };

  // Handlers for User Profile
  const handleSaveProfile = async (updated) => {
    setUserProfile(updated);
    storageService.saveUserProfile(updated);
    await apiService.updateProfile(updated);
    const now = new Date().toISOString();
    setLastSyncTime(now);
    storageService.setLastSync(now);
  };

  // Handlers for Tasks
  const handleAddTask = async (newTask) => {
    const updated = [newTask, ...tasks];
    setTasks(updated);
    storageService.saveTasks(updated);
    await apiService.createTask(newTask);
  };

  const handleToggleTask = async (taskId) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId || t._id === taskId) {
        const nextCompleted = !t.completed;
        const patched = {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : null
        };
        apiService.updateTask(taskId, patched);
        return patched;
      }
      return t;
    });

    setTasks(updated);
    storageService.saveTasks(updated);
  };

  const handleDeleteTask = async (taskId) => {
    const updated = tasks.filter((t) => t.id !== taskId && t._id !== taskId);
    setTasks(updated);
    storageService.saveTasks(updated);
    await apiService.deleteTask(taskId);
  };

  // Individual Task Edit Handler
  const handleEditTask = async (taskId, updatedFields) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId || t._id === taskId) {
        const patched = { ...t, ...updatedFields };
        apiService.updateTask(taskId, patched);
        return patched;
      }
      return t;
    });

    setTasks(updated);
    storageService.saveTasks(updated);
  };

  // Handlers for Challenges
  const handleCreateChallenge = async (newChallengeData) => {
    const { durationDays, startDate, title, description, category } = newChallengeData;

    const addDays = (dStr, days) => {
      const d = new Date(dStr);
      d.setDate(d.getDate() + days);
      return formatDateStr(d);
    };

    const checkIns = Array.from({ length: durationDays }, (_, i) => ({
      dayNumber: i + 1,
      date: addDays(startDate, i),
      status: 'pending',
      note: '',
      completedAt: null
    }));

    const newChallenge = {
      id: `ch-${Date.now()}`,
      title,
      description,
      category,
      durationDays,
      startDate,
      endDate: addDays(startDate, durationDays - 1),
      status: 'active',
      checkIns
    };

    const updated = [newChallenge, ...challenges];
    setChallenges(updated);
    storageService.saveChallenges(updated);
    await apiService.createChallenge(newChallenge);
  };

  const handleCheckIn = async (challengeId, checkinData) => {
    const updated = challenges.map((ch) => {
      if (ch.id === challengeId || ch._id === challengeId) {
        const newCheckIns = ch.checkIns.map((ci) => {
          if (ci.dayNumber === checkinData.dayNumber) {
            return {
              ...ci,
              status: checkinData.status,
              note: checkinData.note !== undefined ? checkinData.note : ci.note,
              completedAt: checkinData.status === 'completed' ? new Date().toISOString() : null
            };
          }
          return ci;
        });

        const allDone = newCheckIns.every((c) => c.status === 'completed' || c.status === 'skipped');
        return {
          ...ch,
          checkIns: newCheckIns,
          status: allDone ? 'completed' : 'active'
        };
      }
      return ch;
    });

    setChallenges(updated);
    storageService.saveChallenges(updated);
    await apiService.checkinChallenge(challengeId, checkinData);
  };

  const handleDeleteChallenge = async (challengeId) => {
    const updated = challenges.filter((c) => c.id !== challengeId && c._id !== challengeId);
    setChallenges(updated);
    storageService.saveChallenges(updated);
    await apiService.deleteChallenge(challengeId);
  };

  // Individual Challenge Edit Handler
  const handleEditChallenge = async (challengeId, updatedFields) => {
    const updated = challenges.map((ch) => {
      if (ch.id === challengeId || ch._id === challengeId) {
        return { ...ch, ...updatedFields };
      }
      return ch;
    });

    setChallenges(updated);
    storageService.saveChallenges(updated);
    performSync({ user: userProfile, tasks, challenges: updated });
  };

  // Focus Timer Session Handlers
  const handleAddTimerSession = (session) => {
    const updated = [session, ...timerSessions];
    setTimerSessions(updated);
    storageService.saveTimerSessions(updated);
  };

  const handleDeleteTimerSession = (sessionId) => {
    const updated = timerSessions.filter((s) => s.id !== sessionId);
    setTimerSessions(updated);
    storageService.saveTimerSessions(updated);
  };

  // Data Clean Handlers
  const handleClearAllData = async () => {
    setTasks([]);
    setChallenges([]);
    setTimerSessions([]);
    storageService.saveTasks([]);
    storageService.saveChallenges([]);
    storageService.saveTimerSessions([]);
    await performSync({ user: userProfile, tasks: [], challenges: [] });
  };

  const handleClearCompletedTasks = async () => {
    const remaining = tasks.filter((t) => !t.completed);
    setTasks(remaining);
    storageService.saveTasks(remaining);
    await performSync({ user: userProfile, tasks: remaining, challenges });
  };

  const handleClearChallenges = async () => {
    setChallenges([]);
    storageService.saveChallenges([]);
    await performSync({ user: userProfile, tasks, challenges: [] });
  };

  const handleResetDemoData = () => {
    setUserProfile(initialUserProfile);
    setTasks(initialTasks);
    setChallenges(initialChallenges);
    setTimerSessions(initialTimerSessions);
    storageService.saveUserProfile(initialUserProfile);
    storageService.saveTasks(initialTasks);
    storageService.saveChallenges(initialChallenges);
    storageService.saveTimerSessions(initialTimerSessions);
    performSync({
      user: initialUserProfile,
      tasks: initialTasks,
      challenges: initialChallenges
    });
  };

  // Data Restore
  const handleRestoreData = (restored) => {
    if (restored.user) {
      setUserProfile(restored.user);
      storageService.saveUserProfile(restored.user);
    }
    if (restored.tasks) {
      setTasks(restored.tasks);
      storageService.saveTasks(restored.tasks);
    }
    if (restored.challenges) {
      setChallenges(restored.challenges);
      storageService.saveChallenges(restored.challenges);
    }
    performSync(restored);
  };

  // AUTHENTICATION BARRIER: When user is not authenticated, render Login Screen only!
  if (!isAuthenticated) {
    return (
      <LoginView
        userProfile={userProfile}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // AUTHENTICATED USER DASHBOARD
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Daily Motivation Banner */}
        <div
          className="mb-5 border rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-sm transition-all"
          style={{
            background: `linear-gradient(to right, ${theme.accentDark} 0%, #161b22 60%, #161b22 100%)`,
            borderColor: theme.accent + '35'
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg border hidden sm:flex items-center justify-center"
              style={{
                backgroundColor: theme.accentDark,
                borderColor: theme.accent + '40',
                color: theme.accentLight
              }}
            >
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-white font-medium italic">
                "{todayQuote.text}"
              </p>
              <span className="text-[10px] font-mono" style={{ color: theme.accentLight }}>
                — {todayQuote.author}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0d1117] border border-github-border text-[11px] font-mono text-github-muted whitespace-nowrap">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.accent }}
            />
            <span>{formatDateStr(new Date())}</span>
          </div>
        </div>

        {/* Render Tab Contents */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <StatsOverview tasks={tasks} challenges={challenges} />

            {/* Dynamic Full-Width Heatmap */}
            <ContributionHeatmap
              tasks={tasks}
              selectedDate={selectedDate}
              onSelectDate={(d) => setSelectedDate(d)}
              onNavigateToTasks={() => setActiveTab('tasks')}
            />

            {/* Connected Daily Task Quick Section */}
            <div className="pt-2">
              <TaskManager
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onEditTask={handleEditTask}
                selectedDate={selectedDate}
                onClearDateFilter={() => setSelectedDate(null)}
              />
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <ChallengeTracker
            challenges={challenges}
            onCreateChallenge={handleCreateChallenge}
            onCheckIn={handleCheckIn}
            onDeleteChallenge={handleDeleteChallenge}
            onEditChallenge={handleEditChallenge}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            selectedDate={selectedDate}
            onClearDateFilter={() => setSelectedDate(null)}
          />
        )}

        {activeTab === 'timer' && (
          <FocusTimer
            sessions={timerSessions}
            onAddSession={handleAddTimerSession}
            onDeleteSession={handleDeleteTimerSession}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            userProfile={userProfile}
            onSaveProfile={handleSaveProfile}
            mongoStatus={mongoStatus}
            lastSyncTime={lastSyncTime}
            isAuthenticated={isAuthenticated}
            onOpenLogin={() => {}}
            onSignOut={handleSignOut}
            onOpenCleanModal={() => setIsCleanCenterOpen(true)}
          />
        )}
      </main>

      {/* Central Application Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        mongoStatus={mongoStatus}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        onManualSync={() => performSync()}
        data={{ user: userProfile, tasks, challenges }}
        onRestoreData={handleRestoreData}
        onOpenCleanCenter={() => setIsCleanCenterOpen(true)}
      />

      {/* Standalone Password-Protected Data Clean Center Modal */}
      <DataCleanModal
        isOpen={isCleanCenterOpen}
        onClose={() => setIsCleanCenterOpen(false)}
        onClearAllData={handleClearAllData}
        onClearCompletedTasks={handleClearCompletedTasks}
        onClearChallenges={handleClearChallenges}
        onResetDemoData={handleResetDemoData}
        tasksCount={tasks.length}
        challengesCount={challenges.length}
        userProfile={userProfile}
      />

      {/* Mobile Sticky Bottom Navigation (Screens < 768px) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickAdd={() => {
          setActiveTab('tasks');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="border-t border-github-border bg-[#0d1117] py-6 text-center text-xs text-github-muted hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: theme.accent }}
            />
            <span>Personal Daily Activity Dashboard • {theme.name} Palette</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/n0vemberain/daily-task"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span>n0vemberain/daily-task</span>
            </a>
            <span>•</span>
            <span className="font-mono" style={{ color: theme.accentLight }}>
              Dual-Store: LocalStorage + MongoDB
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
