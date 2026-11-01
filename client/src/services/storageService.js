import { initialUserProfile, initialTasks, initialChallenges, initialTimerSessions } from '../data/initialData';

const KEYS = {
  CURRENT_USER: 'daily_task_current_user',
  AUTH_SESSION: 'daily_task_auth_session',
  ALL_USERS: 'daily_task_all_users_v1',
  USER: 'daily_task_user_v1',
  TASKS: 'daily_task_tasks_v1',
  CHALLENGES: 'daily_task_challenges_v1',
  TIMER_SESSIONS: 'daily_task_timer_sessions_v1',
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
      const targetUser = (username || storageService.getCurrentUser()?.username || 'n0vemberain').toLowerCase();
      const userKey = targetUser === 'n0vemberain' ? KEYS.USER : `daily_task_user_${targetUser}`;
      const data = localStorage.getItem(userKey);
      return data ? JSON.parse(data) : initialUserProfile;
    } catch (e) {
      console.error('Error reading user profile from localStorage', e);
      return initialUserProfile;
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

  getLastSync: () => {
    return localStorage.getItem(KEYS.LAST_SYNC) || null;
  },

  setLastSync: (timestamp) => {
    localStorage.setItem(KEYS.LAST_SYNC, timestamp);
  }
};
