const BASE_URL = '/api';

export const apiService = {
  checkHealth: async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) throw new Error('Health check non-200');
      const data = await res.json();
      return { connected: true, isMongoConnected: data.isMongoConnected, data };
    } catch (e) {
      return { connected: false, isMongoConnected: false, error: e.message };
    }
  },

  getFullData: async () => {
    try {
      const res = await fetch(`${BASE_URL}/sync`, {
        signal: AbortSignal.timeout(6000)
      });
      if (!res.ok) throw new Error('Failed to fetch full data');
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  syncAll: async ({ user, tasks, challenges, timerSessions }) => {
    try {
      const res = await fetch(`${BASE_URL}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, tasks, challenges, timerSessions }),
        signal: AbortSignal.timeout(8000)
      });
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  updateProfile: async (profile) => {
    try {
      const res = await fetch(`${BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
        signal: AbortSignal.timeout(4000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  createTask: async (task) => {
    try {
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
        signal: AbortSignal.timeout(3000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  updateTask: async (id, task) => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
        signal: AbortSignal.timeout(3000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  deleteTask: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  createChallenge: async (challenge) => {
    try {
      const res = await fetch(`${BASE_URL}/challenges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(challenge),
        signal: AbortSignal.timeout(3000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  checkinChallenge: async (challengeId, checkinData) => {
    try {
      const res = await fetch(`${BASE_URL}/challenges/${challengeId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkinData),
        signal: AbortSignal.timeout(3000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  deleteChallenge: async (challengeId) => {
    try {
      const res = await fetch(`${BASE_URL}/challenges/${challengeId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  }
};
