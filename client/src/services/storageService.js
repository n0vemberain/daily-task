import { initialUserProfile, initialTasks, initialChallenges } from '../data/initialData';

const KEYS = {
  USER: 'daily_task_user_v1',
  TASKS: 'daily_task_tasks_v1',
  CHALLENGES: 'daily_task_challenges_v1',
  LAST_SYNC: 'daily_task_last_sync_v1'
};

export const storageService = {
  getUserProfile: () => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : initialUserProfile;
    } catch (e) {
      console.error('Error reading user profile from localStorage', e);
      return initialUserProfile;
    }
  },

  saveUserProfile: (user) => {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
      return true;
    } catch (e) {
      console.error('Error saving user profile to localStorage', e);
      return false;
    }
  },

  getTasks: () => {
    try {
      const data = localStorage.getItem(KEYS.TASKS);
      return data ? JSON.parse(data) : initialTasks;
    } catch (e) {
      console.error('Error reading tasks from localStorage', e);
      return initialTasks;
    }
  },

  saveTasks: (tasks) => {
    try {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
      return true;
    } catch (e) {
      console.error('Error saving tasks to localStorage', e);
      return false;
    }
  },

  getChallenges: () => {
    try {
      const data = localStorage.getItem(KEYS.CHALLENGES);
      return data ? JSON.parse(data) : initialChallenges;
    } catch (e) {
      console.error('Error reading challenges from localStorage', e);
      return initialChallenges;
    }
  },

  saveChallenges: (challenges) => {
    try {
      localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
      return true;
    } catch (e) {
      console.error('Error saving challenges to localStorage', e);
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
