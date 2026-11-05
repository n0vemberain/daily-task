import { initialUserProfile, initialTasks, initialChallenges, initialTimerSessions } from '../data/initialData';

const KEYS = {
  CURRENT_USER: 'daily_task_current_user',
  AUTH_SESSION: 'daily_task_auth_session',
  ALL_USERS: 'daily_task_all_users_v1',
  USER: 'daily_task_user_v1',
  TASKS: 'daily_task_tasks_v1',
  CHALLENGES: 'daily_task_challenges_v1',
  TIMER_SESSIONS: 'daily_task_timer_sessions_v1',
  RECYCLE_BIN: 'daily_task_recycle_bin_v1',
  LAST_SYNC: 'daily_task_last_sync_v1'
};

export const storageService = {
  // Current active user session
  getCurrentUser: () => {
    try {
      const data = localStorage.getItem(KEYS.CURRENT_USER);
      return data
        ? JSON.parse(data)
        : {
            ...initialUserProfile,
            role: 'admin',
            isActive: true,
            sessionVersion: 1
          };
    } catch (e) {
      return {
        ...initialUserProfile,
        role: 'admin',
        isActive: true,
        sessionVersion: 1
      };
    }
  },

  saveCurrentUser: (user) => {
    try {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return true;
    } catch (e) {
      console.error('Error saving current user to localStorage', e);
      return false;
    }
  },

  clearCurrentSession: () => {
    try {
      localStorage.removeItem(KEYS.CURRENT_USER);
      localStorage.removeItem(KEYS.AUTH_SESSION);
      return true;
    } catch (e) {
      return false;
    }
  },

  getAllUsers: () => {
    try {
      const data = localStorage.getItem(KEYS.ALL_USERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveAllUsers: (users) => {
    try {
      localStorage.setItem(KEYS.ALL_USERS, JSON.stringify(users));
      return true;
    } catch (e) {
      return false;
    }
  },

  getUserProfile: (username = null) => {
    try {
      const activeUser = storageService.getCurrentUser();
      const targetUser = (username || activeUser?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.USER : `daily_task_user_${targetUser}`;
      const data = localStorage.getItem(userKey);
      if (data) {
        return JSON.parse(data);
      }
      if (targetUser === 'n0vemberain') {
        return initialUserProfile;
      }
      // Isolated fresh profile for guest user
      return {
        name: activeUser?.username?.toLowerCase() === targetUser ? (activeUser.name || targetUser) : targetUser,
        username: targetUser,
        role: 'guest',
        fieldOfStudy: '',
        skills: [],
        avatarUrl: ''
      };
    } catch (e) {
      console.error('Error reading user profile from localStorage', e);
      return {
        name: username || 'Guest',
        username: username || 'guest',
        role: 'guest',
        fieldOfStudy: '',
        skills: [],
        avatarUrl: ''
      };
    }
  },

  saveUserProfile: (user, username = null) => {
    try {
      const targetUser = (username || user?.username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.USER : `daily_task_user_${targetUser}`;
      localStorage.setItem(userKey, JSON.stringify(user));
      return true;
    } catch (e) {
      console.error('Error saving user profile to localStorage', e);
      return false;
    }
  },

  getTasks: (username = null) => {
    try {
      const targetUser = (username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.TASKS : `daily_task_tasks_${targetUser}`;
      const data = localStorage.getItem(userKey);
      if (data !== null) return JSON.parse(data);
      if (targetUser === 'n0vemberain') {
        if (localStorage.getItem('daily_task_initialized') === 'true') {
          return [];
        }
        return initialTasks;
      }
      return [];
    } catch (e) {
      console.error('Error reading tasks from localStorage', e);
      return [];
    }
  },

  saveTasks: (tasks, username = null) => {
    try {
      const targetUser = (username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.TASKS : `daily_task_tasks_${targetUser}`;
      localStorage.setItem(userKey, JSON.stringify(tasks));
      return true;
    } catch (e) {
      console.error('Error saving tasks to localStorage', e);
      return false;
    }
  },

  getChallenges: (username = null) => {
    try {
      const targetUser = (username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.CHALLENGES : `daily_task_challenges_${targetUser}`;
      const data = localStorage.getItem(userKey);
      if (data !== null) return JSON.parse(data);
      if (targetUser === 'n0vemberain') {
        return initialChallenges;
      }
      return [];
    } catch (e) {
      console.error('Error reading challenges from localStorage', e);
      return [];
    }
  },

  saveChallenges: (challenges, username = null) => {
    try {
      const targetUser = (username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.CHALLENGES : `daily_task_challenges_${targetUser}`;
      localStorage.setItem(userKey, JSON.stringify(challenges));
      return true;
    } catch (e) {
      console.error('Error saving challenges to localStorage', e);
      return false;
    }
  },

  getTimerSessions: (username = null) => {
    try {
      const targetUser = (username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.TIMER_SESSIONS : `daily_task_timer_sessions_${targetUser}`;
      const data = localStorage.getItem(userKey);
      if (data !== null) return JSON.parse(data);
      if (targetUser === 'n0vemberain') {
        return initialTimerSessions;
      }
      return [];
    } catch (e) {
      console.error('Error reading timer sessions from localStorage', e);
      return [];
    }
  },

  saveTimerSessions: (sessions, username = null) => {
    try {
      const targetUser = (username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.TIMER_SESSIONS : `daily_task_timer_sessions_${targetUser}`;
      localStorage.setItem(userKey, JSON.stringify(sessions));
      return true;
    } catch (e) {
      console.error('Error saving timer sessions to localStorage', e);
      return false;
    }
  },

  // Recycle Bin (Trash) with automatic 30-day retention purge
  getRecycleBin: (username = null) => {
    try {
      const targetUser = (username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.RECYCLE_BIN : `daily_task_recycle_bin_${targetUser}`;
      const data = localStorage.getItem(userKey);
      if (!data) return [];

      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      // Auto purge items older than 30 days
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      const validItems = parsed.filter((item) => {
        if (!item || !item.deletedAt) return false;
        const deletedTime = new Date(item.deletedAt).getTime();
        return now - deletedTime <= thirtyDaysMs;
      });

      if (validItems.length !== parsed.length) {
        localStorage.setItem(userKey, JSON.stringify(validItems));
      }

      return validItems;
    } catch (e) {
      console.error('Error reading recycle bin from localStorage', e);
      return [];
    }
  },

  saveRecycleBin: (items, username = null) => {
    try {
      const targetUser = (username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.RECYCLE_BIN : `daily_task_recycle_bin_${targetUser}`;
      localStorage.setItem(userKey, JSON.stringify(items));
      return true;
    } catch (e) {
      console.error('Error saving recycle bin to localStorage', e);
      return false;
    }
  },

  addToRecycleBin: (type, item, cascadeTasks = [], username = null) => {
    try {
      const currentBin = storageService.getRecycleBin(username);
      const generatedId = `rb-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newEntry = {
        id: generatedId,
        recycleBinId: generatedId,
        type, // 'task' | 'challenge' | 'session'
        deletedAt: new Date().toISOString(),
        item,
        cascadeTasks: Array.isArray(cascadeTasks) ? cascadeTasks : []
      };
      const updatedBin = [newEntry, ...currentBin];
      storageService.saveRecycleBin(updatedBin, username);
      return updatedBin;
    } catch (e) {
      console.error('Error adding item to recycle bin', e);
      return [];
    }
  },

  removeFromRecycleBin: (recycleBinId, username = null) => {
    try {
      const currentBin = storageService.getRecycleBin(username);
      const updatedBin = currentBin.filter((entry) => entry.id !== recycleBinId && entry.recycleBinId !== recycleBinId);
      storageService.saveRecycleBin(updatedBin, username);
      return updatedBin;
    } catch (e) {
      console.error('Error removing item from recycle bin', e);
      return [];
    }
  },

  clearRecycleBin: (username = null) => {
    storageService.saveRecycleBin([], username);
    return [];
  },

  getLastSync: () => {
    return localStorage.getItem(KEYS.LAST_SYNC) || null;
  },

  setLastSync: (timestamp) => {
    localStorage.setItem(KEYS.LAST_SYNC, timestamp);
  }
};
