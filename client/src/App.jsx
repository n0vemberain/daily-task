import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import ContributionHeatmap from './components/ContributionHeatmap';
import ChallengeTracker from './components/ChallengeTracker';
import TaskManager from './components/TaskManager';
import UserProfile from './components/UserProfile';
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';
import DataCleanModal from './components/DataCleanModal';
import FocusTimer from './components/FocusTimer';
import LoginView from './components/LoginView';
import MobileBottomNav from './components/MobileBottomNav';
import { storageService } from './services/storageService';
import { apiService } from './services/apiService';
import {
  formatDateStr,
  initialUserProfile,
  initialTasks,
  sampleDemoTasks,
  initialChallenges,
  initialTimerSessions
} from './data/initialData';
import { processChallengeTaskRollovers } from './utils/challengeRollover';
import { Calendar, Flame, CheckSquare, Database, Quote, Timer } from 'lucide-react';
import GithubIcon from './components/GithubIcon';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(null);

  // Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCleanCenterOpen, setIsCleanCenterOpen] = useState(false);

  // Core State initialized from LocalStorage (Isolated per active user)
  const [currentUser, setCurrentUser] = useState(() => storageService.getCurrentUser());
  const [userProfile, setUserProfile] = useState(() => storageService.getUserProfile(storageService.getCurrentUser()?.username));
  const [tasks, setTasks] = useState(() => storageService.getTasks(storageService.getCurrentUser()?.username));
  const [challenges, setChallenges] = useState(() => storageService.getChallenges(storageService.getCurrentUser()?.username));
  const [timerSessions, setTimerSessions] = useState(() => storageService.getTimerSessions(storageService.getCurrentUser()?.username));

  // Authentication State: MUST be explicitly true to access the dashboard
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('daily_task_auth_session') === 'true';
  });

  // Ensure profile tab redirects to dashboard and opens profile modal
  useEffect(() => {
    if (activeTab === 'profile') {
      setActiveTab('dashboard');
      setIsProfileModalOpen(true);
    }
  }, [activeTab]);

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

  // Bi-directional full sync across devices with User Isolation
  const performSync = useCallback(
    async (currentData = null) => {
      setIsSyncing(true);
      const activeUser = storageService.getCurrentUser();
      const uname = (activeUser?.username || 'n0vemberain').toLowerCase();
      const isAdmin = activeUser?.role === 'admin' || uname === 'n0vemberain';
      const dataToSync = currentData
        ? { sessionVersion: activeUser?.sessionVersion || 1, ...currentData }
        : {
            user: storageService.getUserProfile(uname),
            tasks: storageService.getTasks(uname),
            challenges: storageService.getChallenges(uname),
            timerSessions: storageService.getTimerSessions(uname),
            username: uname,
            sessionVersion: activeUser?.sessionVersion || 1
          };

      const result = await apiService.syncAll(dataToSync);
      const now = new Date().toISOString();

      if (result && result.sessionRevoked && !isAdmin) {
        setIsAuthenticated(false);
        storageService.clearCurrentSession();
        setIsSyncing(false);
        return;
      }

      if (result && result.success && result.data) {
        if (result.data.user) {
          setUserProfile(result.data.user);
          storageService.saveUserProfile(result.data.user, uname);

          // Keep current active session version synchronized with server
          if (activeUser && activeUser.username.toLowerCase() === uname) {
            const updatedActive = {
              ...activeUser,
              ...result.data.user,
              sessionVersion: result.data.user.sessionVersion || activeUser.sessionVersion || 1
            };
            setCurrentUser(updatedActive);
            storageService.saveCurrentUser(updatedActive);
          }
        }
        if (Array.isArray(result.data.tasks)) {
          setTasks(result.data.tasks);
          storageService.saveTasks(result.data.tasks, uname);
        }
        if (Array.isArray(result.data.challenges)) {
          setChallenges(result.data.challenges);
          storageService.saveChallenges(result.data.challenges, uname);
        }
        if (Array.isArray(result.data.timerSessions)) {
          setTimerSessions(result.data.timerSessions);
          storageService.saveTimerSessions(result.data.timerSessions, uname);
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
    const activeUser = storageService.getCurrentUser();
    const uname = (activeUser?.username || 'n0vemberain').toLowerCase();
    const isAdmin = activeUser?.role === 'admin' || uname === 'n0vemberain';

    // Initial fetch from central server on mount
    apiService
      .getFullData(uname, activeUser?.sessionVersion)
      .then((res) => {
        if (res && res.sessionRevoked && !isAdmin) {
          setIsAuthenticated(false);
          storageService.clearCurrentSession();
          return;
        }
        if (res && res.success && res.data) {
          if (res.data.user) {
            setUserProfile(res.data.user);
            storageService.saveUserProfile(res.data.user, uname);

            if (activeUser && activeUser.username.toLowerCase() === uname) {
              const updatedActive = {
                ...activeUser,
                ...res.data.user,
                sessionVersion: res.data.user.sessionVersion || activeUser.sessionVersion || 1
              };
              setCurrentUser(updatedActive);
              storageService.saveCurrentUser(updatedActive);
            }
          }
          if (Array.isArray(res.data.tasks)) {
            setTasks(res.data.tasks);
            storageService.saveTasks(res.data.tasks, uname);
          }
          if (Array.isArray(res.data.challenges)) {
            setChallenges(res.data.challenges);
            storageService.saveChallenges(res.data.challenges, uname);
          }
          if (Array.isArray(res.data.timerSessions)) {
            setTimerSessions(res.data.timerSessions);
            storageService.saveTimerSessions(res.data.timerSessions, uname);
          }
        }
        checkServerStatus();
      })
      .catch(() => {
        checkServerStatus();
      });

    // Periodic background sync every 20 seconds
    const interval = setInterval(() => {
      performSync();
    }, 20000);

    return () => clearInterval(interval);
  }, [checkServerStatus, performSync]);

  // Automatic Challenge Task Carryover / Rollover for uncompleted tasks on past challenge days
  useEffect(() => {
    if (tasks.length > 0 && challenges.length > 0) {
      const today = formatDateStr(new Date());
      const { updatedTasks, hasChanges } = processChallengeTaskRollovers(tasks, challenges, today);
      if (hasChanges) {
        const uname = storageService.getCurrentUser()?.username || 'n0vemberain';
        setTasks(updatedTasks);
        storageService.saveTasks(updatedTasks, uname);
        performSync({ user: userProfile, tasks: updatedTasks, challenges, username: uname });
      }
    }
  }, [challenges, tasks, userProfile, performSync]);

  // Handlers for Authentication
  const handleLoginSuccess = ({ rememberMe, username, user }) => {
    const uname = (user?.username || username || 'guest').toLowerCase();
    const activeUser = user || {
      username: uname,
      name: uname === 'n0vemberain' ? 'Fatin Ishraque' : uname,
      role: uname === 'n0vemberain' ? 'admin' : 'guest',
      sessionVersion: 1
    };
    setCurrentUser(activeUser);
    storageService.saveCurrentUser(activeUser);
    setIsAuthenticated(true);
    localStorage.setItem('daily_task_auth_session', 'true');

    // Isolate and apply profile for the authenticated user
    const isolatedProfile = user || storageService.getUserProfile(uname);
    setUserProfile(isolatedProfile);
    storageService.saveUserProfile(isolatedProfile, uname);

    const userTasks = storageService.getTasks(uname);
    const userChallenges = storageService.getChallenges(uname);
    const userSessions = storageService.getTimerSessions(uname);
    setTasks(userTasks);
    setChallenges(userChallenges);
    setTimerSessions(userSessions);

    apiService
      .getFullData(uname, activeUser.sessionVersion)
      .then((res) => {
        if (res && res.success && res.data) {
          if (res.data.user) {
            setUserProfile(res.data.user);
            storageService.saveUserProfile(res.data.user, uname);
            const updatedActive = {
              ...activeUser,
              ...res.data.user,
              sessionVersion: res.data.user.sessionVersion || activeUser.sessionVersion || 1
            };
            setCurrentUser(updatedActive);
            storageService.saveCurrentUser(updatedActive);
          }
          if (Array.isArray(res.data.tasks)) {
            setTasks(res.data.tasks);
            storageService.saveTasks(res.data.tasks, uname);
          }
          if (Array.isArray(res.data.challenges)) {
            setChallenges(res.data.challenges);
            storageService.saveChallenges(res.data.challenges, uname);
          }
          if (Array.isArray(res.data.timerSessions)) {
            setTimerSessions(res.data.timerSessions);
            storageService.saveTimerSessions(res.data.timerSessions, uname);
          }
        }
      })
      .catch(() => {});
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    storageService.clearCurrentSession();
    setCurrentUser(null);
    setUserProfile(null);
    setTasks([]);
    setChallenges([]);
    setTimerSessions([]);
  };

  // Handlers for User Profile
  const handleSaveProfile = async (updated) => {
    const uname = (storageService.getCurrentUser()?.username || userProfile?.username || 'n0vemberain').toLowerCase();
    const updatedWithUser = { ...updated, username: uname };
    setUserProfile(updatedWithUser);
    storageService.saveUserProfile(updatedWithUser, uname);
    await apiService.updateProfile(updatedWithUser);
    const now = new Date().toISOString();
    setLastSyncTime(now);
    storageService.setLastSync(now);
  };

  // Handlers for Tasks with past-date protection
  const handleAddTask = async (newTask) => {
    const today = formatDateStr(new Date());
    if (newTask.date && newTask.date < today && !newTask.allowPast) {
      return; // Prevent creating tasks in the past unless authorized
    }
    const uname = (storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
    const taskWithUser = { ...newTask, userId: uname };
    const updated = [taskWithUser, ...tasks];
    setTasks(updated);
    storageService.saveTasks(updated, uname);
    await apiService.createTask(taskWithUser);
  };

  const handleToggleTask = async (taskId) => {
    const uname = (storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
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
    storageService.saveTasks(updated, uname);
  };

  const handleDeleteTask = async (taskId) => {
    const uname = (storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
    const updated = tasks.filter((t) => t.id !== taskId && t._id !== taskId);
    setTasks(updated);
    storageService.saveTasks(updated, uname);
    await apiService.deleteTask(taskId);
  };

  // Individual Task Edit Handler
  const handleEditTask = async (taskId, updatedFields) => {
    const uname = (storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
    const updated = tasks.map((t) => {
      if (t.id === taskId || t._id === taskId) {
        const patched = { ...t, ...updatedFields };
        apiService.updateTask(taskId, patched);
        return patched;
      }
      return t;
    });

    setTasks(updated);
    storageService.saveTasks(updated, uname);
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

    const uname = (storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
    const newChallenge = {
      id: `ch-${Date.now()}`,
      userId: uname,
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
    storageService.saveChallenges(updated, uname);
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

  // Individual Challenge Edit Handler with schedule and linked task adaptation
  const handleEditChallenge = async (challengeId, updatedFields) => {
    const addDays = (dStr, days) => {
      const d = new Date(dStr);
      d.setDate(d.getDate() + days);
      return formatDateStr(d);
    };

    let targetUpdatedChallenge = null;

    const updated = challenges.map((ch) => {
      if (ch.id === challengeId || ch._id === challengeId) {
        const newStartDate = updatedFields.startDate || ch.startDate || formatDateStr(new Date());
        const newDuration = updatedFields.durationDays
          ? parseInt(updatedFields.durationDays, 10)
          : ch.durationDays || ch.totalDays || 30;
        const newEndDate = addDays(newStartDate, newDuration - 1);

        // Adapt checkIns for the new duration and dates while preserving existing day status & notes
        const prevCheckIns = ch.checkIns || [];
        const newCheckIns = Array.from({ length: newDuration }, (_, i) => {
          const dayNumber = i + 1;
          const dayDate = addDays(newStartDate, i);
          const existing = prevCheckIns.find((ci) => ci.dayNumber === dayNumber);
          return {
            dayNumber,
            date: dayDate,
            status: existing?.status || 'pending',
            note: existing?.note || '',
            completedAt: existing?.completedAt || null
          };
        });

        const merged = {
          ...ch,
          ...updatedFields,
          startDate: newStartDate,
          endDate: newEndDate,
          durationDays: newDuration,
          totalDays: newDuration,
          checkIns: newCheckIns
        };
        targetUpdatedChallenge = merged;
        return merged;
      }
      return ch;
    });

    setChallenges(updated);
    storageService.saveChallenges(updated);

    // Sync dates for any tasks linked to this challenge's days
    let updatedTasks = tasks;
    if (targetUpdatedChallenge && targetUpdatedChallenge.checkIns) {
      updatedTasks = tasks.map((t) => {
        if ((t.challengeId === challengeId || t.challengeId === targetUpdatedChallenge.id) && t.dayNumber) {
          const matchingDay = targetUpdatedChallenge.checkIns.find((d) => d.dayNumber === t.dayNumber);
          if (matchingDay && matchingDay.date !== t.date) {
            return { ...t, date: matchingDay.date };
          }
        }
        return t;
      });

      if (updatedTasks !== tasks) {
        setTasks(updatedTasks);
        storageService.saveTasks(updatedTasks);
      }
    }

    performSync({ user: userProfile, tasks: updatedTasks, challenges: updated });
  };

  // Focus Timer Session Handlers
  const handleAddTimerSession = (session) => {
    const uname = (storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
    const updated = [session, ...timerSessions];
    setTimerSessions(updated);
    storageService.saveTimerSessions(updated, uname);
  };

  const handleDeleteTimerSession = (sessionId) => {
    const uname = (storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
    const updated = timerSessions.filter((s) => s.id !== sessionId);
    setTimerSessions(updated);
    storageService.saveTimerSessions(updated, uname);
  };

  // Data Clean Handlers
  const handleClearAllData = async () => {
    setTasks([]);
    setChallenges([]);
    setTimerSessions([]);
    storageService.saveTasks([]);
    storageService.saveChallenges([]);
    storageService.saveTimerSessions([]);
    try {
      localStorage.removeItem('daily_task_heatmap_history_v1');
      localStorage.setItem('daily_task_initialized', 'true');
    } catch (e) {}
    await apiService.resetAll();
  };

  const handleClearCompletedTasks = async () => {
    const remaining = tasks.filter((t) => !t.completed);
    setTasks(remaining);
    storageService.saveTasks(remaining);
    await performSync({ user: userProfile, tasks: remaining, challenges, overwrite: true });
  };

  const handleClearChallenges = async () => {
    setChallenges([]);
    storageService.saveChallenges([]);
    await performSync({ user: userProfile, tasks, challenges: [], overwrite: true });
  };

  const handleResetDemoData = () => {
    setUserProfile(initialUserProfile);
    setTasks(sampleDemoTasks);
    setChallenges(initialChallenges);
    setTimerSessions(initialTimerSessions);
    storageService.saveUserProfile(initialUserProfile);
    storageService.saveTasks(sampleDemoTasks);
    storageService.saveChallenges(initialChallenges);
    storageService.saveTimerSessions(initialTimerSessions);
    performSync({
      user: initialUserProfile,
      tasks: sampleDemoTasks,
      challenges: initialChallenges,
      timerSessions: initialTimerSessions,
      overwrite: true
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
        onOpenProfile={() => setIsProfileModalOpen(true)}
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
                userProfile={userProfile}
              />
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <ChallengeTracker
            challenges={challenges}
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onCreateChallenge={handleCreateChallenge}
            onCheckIn={handleCheckIn}
            onDeleteChallenge={handleDeleteChallenge}
            onEditChallenge={handleEditChallenge}
            userProfile={userProfile}
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
            userProfile={userProfile}
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
            currentUser={currentUser}
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

      {/* Central Application Settings Modal (Unified Settings, Skills, QR & Users) */}
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
        userProfile={userProfile}
        currentUser={currentUser}
        onSaveProfile={handleSaveProfile}
      />

      {/* Personal Profile Modal (Avatar, Name, User ID, Password, Field of Study Only) */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
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
        onOpenSettings={() => setIsSettingsOpen(true)}
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
