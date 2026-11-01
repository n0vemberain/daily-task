import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Helper to get formatted date string YYYY-MM-DD
function formatDate(d) {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDate(d);
}

const todayStr = formatDate(new Date());

const defaultUserProfile = {
  name: 'Fatin Ishraque',
  username: 'n0vemberain',
  password: 'Password123!',
  fieldOfStudy: 'Computer Science & Engineering',
  skills: [
    'React.js',
    'JavaScript (ES6+)',
    'Node.js & Express',
    'MongoDB & Mongoose',
    'Tailwind CSS',
    'Git & GitHub',
    'REST APIs',
    'Data Structures & Algorithms'
  ],
  avatarUrl: ''
};

const defaultTasks = [
  {
    id: 'task-1',
    title: 'Solve LeetCode Daily Challenge (Binary Tree Level Order)',
    category: 'Coding',
    priority: 'High',
    completed: true,
    completedAt: new Date().toISOString(),
    date: todayStr,
    estimatedMinutes: 45
  },
  {
    id: 'task-2',
    title: 'Build GitHub contribution heatmap in React',
    category: 'Coding',
    priority: 'High',
    completed: true,
    completedAt: new Date().toISOString(),
    date: todayStr,
    estimatedMinutes: 90
  },
  {
    id: 'task-3',
    title: 'Review MongoDB schema indexing and connection pooling',
    category: 'Study',
    priority: 'Medium',
    completed: false,
    completedAt: null,
    date: todayStr,
    estimatedMinutes: 30
  },
  {
    id: 'task-4',
    title: 'Workout: 30 mins cardio & core training',
    category: 'Fitness',
    priority: 'Low',
    completed: true,
    completedAt: new Date().toISOString(),
    date: todayStr,
    estimatedMinutes: 30
  },
  {
    id: 'task-5',
    title: 'Read System Design Primer chapter on Caching & CDNs',
    category: 'Study',
    priority: 'Medium',
    completed: false,
    completedAt: null,
    date: todayStr,
    estimatedMinutes: 40
  }
];

const defaultChallenges = [
  {
    id: 'ch-1',
    title: '30 Days of Code & Data Structures',
    description: 'Solve at least one medium DSA problem every single day and document time complexity.',
    category: 'Coding',
    durationDays: 30,
    startDate: getPastDate(7),
    endDate: (() => {
      const d = new Date(getPastDate(7));
      d.setDate(d.getDate() + 29);
      return formatDate(d);
    })(),
    status: 'active',
    checkIns: Array.from({ length: 30 }, (_, index) => {
      const d = new Date(getPastDate(7));
      d.setDate(d.getDate() + index);
      const dateStr = formatDate(d);
      const isPast = index < 7;
      const isToday = index === 7;

      return {
        dayNumber: index + 1,
        date: dateStr,
        status: isPast ? (index === 3 ? 'skipped' : 'completed') : isToday ? 'completed' : 'pending',
        note: isPast
          ? `Day ${index + 1} completed: solved daily challenge.`
          : isToday
          ? 'Completed daily goals & pushed updates.'
          : '',
        completedAt: isPast || isToday ? new Date().toISOString() : null
      };
    })
  },
  {
    id: 'ch-2',
    title: '21-Day Focus & Morning Routine',
    description: 'Wake up early, read 20 pages of tech book, and complete daily priority tasks.',
    category: 'Habit',
    durationDays: 21,
    startDate: getPastDate(4),
    endDate: (() => {
      const d = new Date(getPastDate(4));
      d.setDate(d.getDate() + 20);
      return formatDate(d);
    })(),
    status: 'active',
    checkIns: Array.from({ length: 21 }, (_, index) => {
      const d = new Date(getPastDate(4));
      d.setDate(d.getDate() + index);
      const dateStr = formatDate(d);
      const isPast = index < 4;
      const isToday = index === 4;

      return {
        dayNumber: index + 1,
        date: dateStr,
        status: isPast ? 'completed' : isToday ? 'pending' : 'pending',
        note: isPast ? `Finished morning study routine on day ${index + 1}.` : '',
        completedAt: isPast ? new Date().toISOString() : null
      };
    })
  }
];

const defaultTimerSessions = [
  {
    id: 'ts-1',
    durationMinutes: 25,
    date: todayStr,
    timestamp: new Date().toISOString(),
    category: 'Study',
    label: 'Algorithms & Data Structures'
  },
  {
    id: 'ts-2',
    durationMinutes: 20,
    date: todayStr,
    timestamp: new Date().toISOString(),
    category: 'Coding',
    label: 'React Component Optimization'
  },
  {
    id: 'ts-3',
    durationMinutes: 45,
    date: getPastDate(1),
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    category: 'Study',
    label: 'Database Systems Architecture'
  },
  {
    id: 'ts-4',
    durationMinutes: 30,
    date: getPastDate(2),
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    category: 'Coding',
    label: 'Tailwind UI Polish'
  },
  {
    id: 'ts-5',
    durationMinutes: 60,
    date: getPastDate(5),
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    category: 'Study',
    label: 'Computer Networks'
  }
];

class FileStore {
  constructor() {
    this.ensureInitialized();
  }

  ensureInitialized() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (!fs.existsSync(STORE_FILE)) {
        const adminUser = {
          id: 'user-admin',
          username: defaultUserProfile.username.trim().toLowerCase(),
          password: defaultUserProfile.password,
          name: defaultUserProfile.name,
          role: 'admin',
          fieldOfStudy: defaultUserProfile.fieldOfStudy,
          skills: defaultUserProfile.skills,
          avatarUrl: defaultUserProfile.avatarUrl,
          isActive: true,
          sessionVersion: 1,
          createdAt: new Date().toISOString()
        };
        const initial = {
          user: defaultUserProfile,
          users: [adminUser],
          tasks: defaultTasks.map(t => ({ ...t, userId: 'n0vemberain' })),
          challenges: defaultChallenges.map(c => ({ ...c, userId: 'n0vemberain' })),
          timerSessions: defaultTimerSessions.map(s => ({ ...s, userId: 'n0vemberain' })),
          lastUpdated: new Date().toISOString()
        };
        fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
      } else {
        const raw = fs.readFileSync(STORE_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        let updated = false;

        if (!Array.isArray(parsed.users) || parsed.users.length === 0) {
          const adminUser = {
            id: 'user-admin',
            username: (parsed.user?.username || 'n0vemberain').trim().toLowerCase(),
            password: parsed.user?.password || 'Password123!',
            name: parsed.user?.name || 'Fatin Ishraque',
            role: 'admin',
            fieldOfStudy: parsed.user?.fieldOfStudy || 'Computer Science & Engineering',
            skills: parsed.user?.skills || [],
            avatarUrl: parsed.user?.avatarUrl || '',
            isActive: true,
            sessionVersion: 1,
            createdAt: new Date().toISOString()
          };
          parsed.users = [adminUser];
          if (!parsed.user.role) {
            parsed.user.role = 'admin';
          }
          updated = true;
        }

        if (updated) {
          fs.writeFileSync(STORE_FILE, JSON.stringify(parsed, null, 2), 'utf8');
        }
      }
    } catch (e) {
      console.error('[FileStore] Initialization error:', e);
    }
  }

  readStore() {
    this.ensureInitialized();
    try {
      const raw = fs.readFileSync(STORE_FILE, 'utf8');
      const store = JSON.parse(raw);
      if (!Array.isArray(store.users) || store.users.length === 0) {
        store.users = [
          {
            id: 'user-admin',
            username: (store.user?.username || 'n0vemberain').trim().toLowerCase(),
            password: store.user?.password || 'Password123!',
            name: store.user?.name || 'Fatin Ishraque',
            role: 'admin',
            fieldOfStudy: store.user?.fieldOfStudy || 'Computer Science & Engineering',
            skills: store.user?.skills || [],
            avatarUrl: store.user?.avatarUrl || '',
            isActive: true,
            sessionVersion: 1,
            createdAt: new Date().toISOString()
          }
        ];
      }
      return store;
    } catch (e) {
      console.error('[FileStore] Read error:', e);
      return {
        user: defaultUserProfile,
        users: [],
        tasks: defaultTasks,
        challenges: defaultChallenges,
        timerSessions: defaultTimerSessions,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  writeStore(data) {
    this.ensureInitialized();
    try {
      data.lastUpdated = new Date().toISOString();
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (e) {
      console.error('[FileStore] Write error:', e);
      return false;
    }
  }

  // Profile operations
  getUser(username = null) {
    const store = this.readStore();
    if (username) {
      const cleanUname = username.trim().toLowerCase();
      const u = (store.users || []).find(
        user => user.username.toLowerCase() === cleanUname
      );
      if (u) return u;
      if (cleanUname !== 'n0vemberain') {
        return {
          id: `user-${cleanUname}`,
          username: cleanUname,
          name: username,
          role: 'guest',
          fieldOfStudy: '',
          skills: [],
          avatarUrl: '',
          isActive: true,
          sessionVersion: 1
        };
      }
    }
    return store.user || defaultUserProfile;
  }

  updateUser(userData, username = null) {
    const store = this.readStore();
    const targetUsername = (username || userData.username || store.user?.username || 'n0vemberain')
      .trim()
      .toLowerCase();

    // Update in users array
    const userIdx = (store.users || []).findIndex(
      u => u.username.toLowerCase() === targetUsername
    );

    if (userIdx !== -1) {
      store.users[userIdx] = {
        ...store.users[userIdx],
        ...userData
      };
    }

    // Mirror to store.user if admin
    if (targetUsername === 'n0vemberain' || store.users[userIdx]?.role === 'admin') {
      store.user = {
        ...(store.user || defaultUserProfile),
        ...userData
      };
    }

    this.writeStore(store);
    return userIdx !== -1 ? store.users[userIdx] : store.user;
  }

  // User Management operations (Multi-User, Guest accounts, Credentials & Session management)
  getUsers() {
    const store = this.readStore();
    return store.users || [];
  }

  getUserByUsername(username) {
    if (!username) return null;
    const store = this.readStore();
    const clean = username.trim().toLowerCase();
    return (store.users || []).find(u => u.username.toLowerCase() === clean) || null;
  }

  getUserById(userId) {
    if (!userId) return null;
    const store = this.readStore();
    return (store.users || []).find(u => u.id === userId) || null;
  }

  createUser({ username, password, name, role = 'guest', fieldOfStudy = '', skills = [], avatarUrl = '' }) {
    if (!username || !username.trim()) {
      throw new Error('Username / Login ID is required.');
    }
    if (!password || password.trim().length < 4) {
      throw new Error('Password must be at least 4 characters long.');
    }
    if (!name || !name.trim()) {
      throw new Error('User full name is required.');
    }

    const cleanUsername = username.trim().toLowerCase();
    const store = this.readStore();

    if ((store.users || []).some(u => u.username.toLowerCase() === cleanUsername)) {
      throw new Error(`Username "${username}" is already registered. Please choose another.`);
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      password: password.trim(),
      name: name.trim(),
      role: role === 'admin' ? 'admin' : 'guest',
      fieldOfStudy: (fieldOfStudy || 'General').trim(),
      skills: Array.isArray(skills) ? skills : [],
      avatarUrl: avatarUrl || '',
      isActive: true,
      sessionVersion: 1,
      createdAt: new Date().toISOString()
    };

    store.users = [...(store.users || []), newUser];
    this.writeStore(store);
    return newUser;
  }

  updateUserCredentials(userId, updates) {
    const store = this.readStore();
    const userIndex = (store.users || []).findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found.');
    }

    const current = store.users[userIndex];
    let nextUsername = current.username;

    if (updates.username && updates.username.trim().toLowerCase() !== current.username.toLowerCase()) {
      const cleanNew = updates.username.trim().toLowerCase();
      if (store.users.some(u => u.id !== userId && u.username.toLowerCase() === cleanNew)) {
        throw new Error(`Username "${updates.username}" is already taken.`);
      }
      nextUsername = cleanNew;
    }

    const passwordChanged = updates.password && updates.password.trim() !== current.password;
    const usernameChanged = nextUsername !== current.username;

    const updatedUser = {
      ...current,
      name: updates.name !== undefined ? updates.name.trim() : current.name,
      username: nextUsername,
      password: updates.password !== undefined && updates.password.trim() ? updates.password.trim() : current.password,
      role: updates.role !== undefined ? updates.role : current.role,
      fieldOfStudy: updates.fieldOfStudy !== undefined ? updates.fieldOfStudy : current.fieldOfStudy,
      skills: updates.skills !== undefined ? updates.skills : current.skills,
      avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : current.avatarUrl,
      isActive: updates.isActive !== undefined ? Boolean(updates.isActive) : current.isActive,
      sessionVersion: (passwordChanged || usernameChanged) ? (current.sessionVersion || 1) + 1 : (current.sessionVersion || 1)
    };

    store.users[userIndex] = updatedUser;

    // If updating admin, mirror to store.user
    if (updatedUser.role === 'admin' || updatedUser.username === 'n0vemberain') {
      store.user = { ...(store.user || {}), ...updatedUser };
    }

    this.writeStore(store);
    return updatedUser;
  }

  forceLogoutUser(userId) {
    const store = this.readStore();
    const user = (store.users || []).find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found.');
    }

    user.sessionVersion = (user.sessionVersion || 1) + 1;
    user.lastForceLogoutAt = new Date().toISOString();

    if (user.role === 'admin' || user.username === 'n0vemberain') {
      if (store.user) store.user.sessionVersion = user.sessionVersion;
    }

    this.writeStore(store);
    return {
      success: true,
      message: `Active session for user ${user.username} has been terminated.`,
      sessionVersion: user.sessionVersion
    };
  }

  toggleUserStatus(userId) {
    const store = this.readStore();
    const user = (store.users || []).find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found.');
    }
    if (user.role === 'admin' || user.username === 'n0vemberain') {
      throw new Error('Cannot deactivate the primary administrator account.');
    }

    user.isActive = !user.isActive;
    if (!user.isActive) {
      user.sessionVersion = (user.sessionVersion || 1) + 1;
    }

    this.writeStore(store);
    return user;
  }

  deleteUser(userId) {
    const store = this.readStore();
    const user = (store.users || []).find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found.');
    }
    if (user.role === 'admin' || user.username === 'n0vemberain') {
      throw new Error('Cannot delete the primary administrator account.');
    }

    const username = user.username;
    // Remove user
    store.users = (store.users || []).filter(u => u.id !== userId);
    // Isolate & delete associated tasks and challenges for this user
    store.tasks = (store.tasks || []).filter(t => (t.userId || 'n0vemberain').toLowerCase() !== username.toLowerCase());
    store.challenges = (store.challenges || []).filter(c => (c.userId || 'n0vemberain').toLowerCase() !== username.toLowerCase());
    store.timerSessions = (store.timerSessions || []).filter(s => (s.userId || 'n0vemberain').toLowerCase() !== username.toLowerCase());

    this.writeStore(store);
    return true;
  }

  // Task operations with User Isolation
  getTasks(filterDate = null, username = null) {
    const store = this.readStore();
    let tasks = store.tasks || [];
    if (username) {
      const cleanUser = username.trim().toLowerCase();
      tasks = tasks.filter(t => {
        const itemUser = (t.userId || 'n0vemberain').toLowerCase();
        return itemUser === cleanUser;
      });
    }
    if (filterDate) {
      return tasks.filter(t => t.date === filterDate);
    }
    return tasks;
  }

  createTask(taskData, username = null) {
    const today = formatDate(new Date());
    if (taskData.date && taskData.date < today) {
      throw new Error('Cannot create tasks with past dates. History is locked.');
    }
    const store = this.readStore();
    const targetUser = (taskData.userId || username || 'n0vemberain').trim().toLowerCase();
    const newTask = {
      id: taskData.id || `task-${Date.now()}`,
      userId: targetUser,
      title: taskData.title,
      category: taskData.category || 'General',
      priority: taskData.priority || 'Medium',
      date: taskData.date || today,
      estimatedMinutes: parseInt(taskData.estimatedMinutes, 10) || 30,
      completed: !!taskData.completed,
      completedAt: taskData.completed ? (taskData.completedAt || new Date().toISOString()) : null,
      challengeId: taskData.challengeId || null,
      challengeTitle: taskData.challengeTitle || null,
      dayNumber: taskData.dayNumber || null
    };

    store.tasks = [newTask, ...(store.tasks || [])];
    this.writeStore(store);
    return newTask;
  }

  updateTask(taskId, updates) {
    const today = formatDate(new Date());
    const store = this.readStore();
    const existing = (store.tasks || []).find(t => t.id === taskId || t._id === taskId);
    if (existing && existing.date < today && !updates.authorized) {
      throw new Error('Tasks from past dates cannot be edited without authorization.');
    }
    if (updates.date && updates.date < today && !updates.authorized) {
      throw new Error('Cannot move task to a past date without authorization.');
    }

    let updated = null;
    store.tasks = (store.tasks || []).map(t => {
      if (t.id === taskId || t._id === taskId) {
        updated = { ...t, ...updates };
        if (updates.completed !== undefined) {
          updated.completed = updates.completed;
          updated.completedAt = updates.completed ? (updates.completedAt || new Date().toISOString()) : null;
        }
        return updated;
      }
      return t;
    });

    if (updated) {
      this.writeStore(store);
    }
    return updated;
  }

  deleteTask(taskId) {
    const store = this.readStore();
    const taskToDelete = (store.tasks || []).find(t => t.id === taskId || t._id === taskId);
    // Lock contribution history for past dates if completed so heatmap blocks never disappear
    if (taskToDelete && taskToDelete.completed && taskToDelete.date) {
      if (!store.heatmapHistory) store.heatmapHistory = {};
      const d = taskToDelete.date;
      const count = (store.tasks || []).filter(t => t.completed && t.date === d).length;
      store.heatmapHistory[d] = {
        count: Math.max(store.heatmapHistory[d]?.count || 0, count),
        tasks: Array.from(new Set([...(store.heatmapHistory[d]?.tasks || []), taskToDelete.title])),
        isLocked: true
      };
    }

    const prevLength = (store.tasks || []).length;
    store.tasks = (store.tasks || []).filter(t => t.id !== taskId && t._id !== taskId);
    this.writeStore(store);
    return store.tasks.length < prevLength;
  }

  // Challenge operations with User Isolation
  getChallenges(username = null) {
    const store = this.readStore();
    let challenges = store.challenges || [];
    if (username) {
      const cleanUser = username.trim().toLowerCase();
      challenges = challenges.filter(c => {
        const itemUser = (c.userId || 'n0vemberain').toLowerCase();
        return itemUser === cleanUser;
      });
    }
    return challenges;
  }

  createChallenge(challengeData, username = null) {
    const store = this.readStore();
    const duration = parseInt(challengeData.durationDays, 10) || 7;
    const addDaysFn = (dStr, days) => {
      const d = new Date(dStr);
      d.setDate(d.getDate() + days);
      return formatDate(d);
    };

    const checkIns = challengeData.checkIns || Array.from({ length: duration }, (_, i) => ({
      dayNumber: i + 1,
      date: addDaysFn(challengeData.startDate, i),
      status: 'pending',
      note: '',
      completedAt: null
    }));

    const targetUser = (challengeData.userId || username || 'n0vemberain').trim().toLowerCase();
    const newChallenge = {
      id: challengeData.id || `ch-${Date.now()}`,
      userId: targetUser,
      title: challengeData.title,
      description: challengeData.description || '',
      category: challengeData.category || 'Habit',
      durationDays: duration,
      startDate: challengeData.startDate,
      endDate: challengeData.endDate || addDaysFn(challengeData.startDate, duration - 1),
      status: 'active',
      checkIns
    };

    store.challenges = [newChallenge, ...(store.challenges || [])];
    this.writeStore(store);
    return newChallenge;
  }

  checkinChallenge(challengeId, checkinData) {
    const store = this.readStore();
    let updated = null;

    store.challenges = (store.challenges || []).map(ch => {
      if (ch.id === challengeId || ch._id === challengeId) {
        const newCheckIns = ch.checkIns.map(ci => {
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

        const allDone = newCheckIns.every(c => c.status === 'completed' || c.status === 'skipped');
        updated = {
          ...ch,
          checkIns: newCheckIns,
          status: allDone ? 'completed' : 'active'
        };
        return updated;
      }
      return ch;
    });

    if (updated) {
      this.writeStore(store);
    }
    return updated;
  }

  deleteChallenge(challengeId) {
    const store = this.readStore();
    store.challenges = (store.challenges || []).filter(c => c.id !== challengeId && c._id !== challengeId);
    this.writeStore(store);
    return true;
  }

  // Timer sessions operations with User Isolation
  getTimerSessions(username = null) {
    const store = this.readStore();
    let sessions = store.timerSessions || [];
    if (username) {
      const cleanUser = username.trim().toLowerCase();
      sessions = sessions.filter(s => {
        const itemUser = (s.userId || 'n0vemberain').toLowerCase();
        return itemUser === cleanUser;
      });
    }
    return sessions;
  }

  addTimerSession(sessionData, username = null) {
    const store = this.readStore();
    const targetUser = (sessionData.userId || username || 'n0vemberain').trim().toLowerCase();
    const newSession = {
      id: sessionData.id || `ts-${Date.now()}`,
      userId: targetUser,
      durationMinutes: parseInt(sessionData.durationMinutes, 10) || 25,
      date: sessionData.date || todayStr,
      timestamp: sessionData.timestamp || new Date().toISOString(),
      category: sessionData.category || 'Study',
      label: sessionData.label || 'Focus Session'
    };

    store.timerSessions = [newSession, ...(store.timerSessions || [])];
    this.writeStore(store);
    return newSession;
  }

  deleteTimerSession(sessionId) {
    const store = this.readStore();
    store.timerSessions = (store.timerSessions || []).filter(s => s.id !== sessionId);
    this.writeStore(store);
    return true;
  }

  // Full Bi-Directional Intelligent Sync with Multi-User Isolation & Session Invalidation
  syncAll({ user, tasks, challenges, timerSessions, username = null, sessionVersion = null, overwrite = false }) {
    const store = this.readStore();
    const targetUsername = (username || user?.username || 'n0vemberain').trim().toLowerCase();

    // Verify session version & active status (only for guest users, admin is exempt)
    const dbUser = this.getUserByUsername(targetUsername);
    if (dbUser) {
      const isAdmin = dbUser.role === 'admin' || targetUsername === 'n0vemberain';
      if (!isAdmin) {
        if (dbUser.isActive === false) {
          return {
            sessionRevoked: true,
            message: 'This account has been deactivated or suspended by the administrator.'
          };
        }
        if (sessionVersion !== null && sessionVersion !== undefined && parseInt(sessionVersion, 10) < (dbUser.sessionVersion || 1)) {
          return {
            sessionRevoked: true,
            message: 'Active session has been terminated by the administrator. Please log in again.'
          };
        }
      }
    }

    if (overwrite) {
      if (user && user.username) {
        this.updateUser(user, targetUsername);
      }
      // Replace only targetUser's items
      store.tasks = (store.tasks || []).filter(t => (t.userId || 'n0vemberain').toLowerCase() !== targetUsername);
      if (Array.isArray(tasks)) {
        store.tasks.push(...tasks.map(t => ({ ...t, userId: targetUsername })));
      }

      store.challenges = (store.challenges || []).filter(c => (c.userId || 'n0vemberain').toLowerCase() !== targetUsername);
      if (Array.isArray(challenges)) {
        store.challenges.push(...challenges.map(c => ({ ...c, userId: targetUsername })));
      }

      store.timerSessions = (store.timerSessions || []).filter(s => (s.userId || 'n0vemberain').toLowerCase() !== targetUsername);
      if (Array.isArray(timerSessions)) {
        store.timerSessions.push(...timerSessions.map(s => ({ ...s, userId: targetUsername })));
      }

      store.lastUpdated = new Date().toISOString();
      this.writeStore(store);

      const updatedUser = this.getUserByUsername(targetUsername) || store.user;
      return {
        user: updatedUser,
        users: (updatedUser.role === 'admin' || targetUsername === 'n0vemberain') ? store.users : undefined,
        tasks: this.getTasks(null, targetUsername),
        challenges: this.getChallenges(targetUsername),
        timerSessions: this.getTimerSessions(targetUsername),
        heatmapHistory: store.heatmapHistory || {},
        lastUpdated: store.lastUpdated
      };
    }

    // 1. Merge User Profile
    if (user && user.username) {
      this.updateUser(user, targetUsername);
    }

    // 2. Merge Tasks: isolate by targetUser
    if (Array.isArray(tasks)) {
      const userTasksMap = new Map();
      (store.tasks || [])
        .filter(t => (t.userId || 'n0vemberain').toLowerCase() === targetUsername)
        .forEach(t => {
          const key = t.id || `${t.title}_${t.date}`;
          userTasksMap.set(key, t);
        });

      tasks.forEach(incoming => {
        const key = incoming.id || `${incoming.title}_${incoming.date}`;
        const withUser = { ...incoming, userId: targetUsername };
        if (userTasksMap.has(key)) {
          const existing = userTasksMap.get(key);
          userTasksMap.set(key, { ...existing, ...withUser });
        } else {
          userTasksMap.set(key, withUser);
        }
      });

      const otherUsersTasks = (store.tasks || []).filter(t => (t.userId || 'n0vemberain').toLowerCase() !== targetUsername);
      store.tasks = [...otherUsersTasks, ...Array.from(userTasksMap.values())];
    }

    // 3. Merge Challenges: isolate by targetUser
    if (Array.isArray(challenges)) {
      const userChMap = new Map();
      (store.challenges || [])
        .filter(c => (c.userId || 'n0vemberain').toLowerCase() === targetUsername)
        .forEach(c => {
          const key = c.id || c.title;
          userChMap.set(key, c);
        });

      challenges.forEach(incoming => {
        const key = incoming.id || incoming.title;
        const withUser = { ...incoming, userId: targetUsername };
        if (userChMap.has(key)) {
          userChMap.set(key, { ...userChMap.get(key), ...withUser });
        } else {
          userChMap.set(key, withUser);
        }
      });

      const otherUsersChallenges = (store.challenges || []).filter(c => (c.userId || 'n0vemberain').toLowerCase() !== targetUsername);
      store.challenges = [...otherUsersChallenges, ...Array.from(userChMap.values())];
    }

    // 4. Merge Timer Sessions: isolate by targetUser
    if (Array.isArray(timerSessions)) {
      const userSessMap = new Map();
      (store.timerSessions || [])
        .filter(s => (s.userId || 'n0vemberain').toLowerCase() === targetUsername)
        .forEach(s => {
          userSessMap.set(s.id, s);
        });

      timerSessions.forEach(incoming => {
        if (incoming.id) {
          userSessMap.set(incoming.id, { ...incoming, userId: targetUsername });
        }
      });

      const otherUsersSessions = (store.timerSessions || []).filter(s => (s.userId || 'n0vemberain').toLowerCase() !== targetUsername);
      store.timerSessions = [...otherUsersSessions, ...Array.from(userSessMap.values())];
    }

    store.lastUpdated = new Date().toISOString();
    this.writeStore(store);

    const currentUserObj = this.getUserByUsername(targetUsername) || store.user;
    return {
      user: currentUserObj,
      users: (currentUserObj.role === 'admin' || targetUsername === 'n0vemberain') ? store.users : undefined,
      tasks: this.getTasks(null, targetUsername),
      challenges: this.getChallenges(targetUsername),
      timerSessions: this.getTimerSessions(targetUsername),
      heatmapHistory: store.heatmapHistory || {},
      lastUpdated: store.lastUpdated
    };
  }

  factoryReset() {
    const fresh = {
      user: defaultUserProfile,
      tasks: [],
      challenges: [],
      timerSessions: [],
      heatmapHistory: {},
      lastUpdated: new Date().toISOString()
    };
    this.writeStore(fresh);
    return fresh;
  }
}

export const fileStore = new FileStore();
