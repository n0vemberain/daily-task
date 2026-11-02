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

  getNetworkAccess: async () => {
    try {
      const res = await fetch(`${BASE_URL}/network-access`, {
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('Failed to fetch network access details');
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  getFullData: async (username = null, sessionVersion = null) => {
    try {
      const params = new URLSearchParams();
      if (username) params.append('username', username);
      if (sessionVersion !== null && sessionVersion !== undefined) {
        params.append('sessionVersion', sessionVersion);
      }
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${BASE_URL}/sync${queryStr}`, {
        signal: AbortSignal.timeout(6000)
      });
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  syncAll: async ({ user, tasks, challenges, timerSessions, heatmapHistory, username = null, sessionVersion = null, overwrite = false }) => {
    try {
      const res = await fetch(`${BASE_URL}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, tasks, challenges, timerSessions, heatmapHistory, username, sessionVersion, overwrite }),
        signal: AbortSignal.timeout(8000)
      });
      const data = await res.json();
      return data;
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  // Authentication & Multi-User Operations
  login: async ({ username, password }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: AbortSignal.timeout(5000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  verifySession: async ({ username, sessionVersion }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/verify-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, sessionVersion }),
        signal: AbortSignal.timeout(4000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  getAllUsers: async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/all`, {
        signal: AbortSignal.timeout(4000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  createUser: async (userData) => {
    try {
      const res = await fetch(`${BASE_URL}/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        signal: AbortSignal.timeout(5000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  updateUserCredentials: async (userId, data) => {
    try {
      const res = await fetch(`${BASE_URL}/user/${userId}/credentials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  forceLogoutUser: async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/user/${userId}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(4000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  toggleUserStatus: async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/user/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(4000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  deleteUser: async (userId) => {
    try {
      const res = await fetch(`${BASE_URL}/user/${userId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(4000)
      });
      return await res.json();
    } catch (e) {
      return { success: false, error: e.message, offline: true };
    }
  },

  resetAll: async () => {
    try {
      const res = await fetch(`${BASE_URL}/sync/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
