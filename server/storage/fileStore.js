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
        const initial = {
          user: defaultUserProfile,
          tasks: defaultTasks,
          challenges: defaultChallenges,
          timerSessions: defaultTimerSessions,
          lastUpdated: new Date().toISOString()
        };
        fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
      }
    } catch (e) {
      console.error('[FileStore] Initialization error:', e);
    }
  }

  readStore() {
    this.ensureInitialized();
    try {
      const raw = fs.readFileSync(STORE_FILE, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('[FileStore] Read error:', e);
      return {
        user: defaultUserProfile,
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
  getUser() {
    const store = this.readStore();
    return store.user || defaultUserProfile;
  }

  updateUser(userData) {
    const store = this.readStore();
    store.user = {
      ...(store.user || defaultUserProfile),
      ...userData
    };
    this.writeStore(store);
    return store.user;
  }

  // Task operations
  getTasks(filterDate = null) {
    const store = this.readStore();
    const tasks = store.tasks || [];
    if (filterDate) {
      return tasks.filter(t => t.date === filterDate);
    }
    return tasks;
  }

  createTask(taskData) {
    const store = this.readStore();
    const newTask = {
      id: taskData.id || `task-${Date.now()}`,
      title: taskData.title,
      category: taskData.category || 'General',
      priority: taskData.priority || 'Medium',
      date: taskData.date || todayStr,
      estimatedMinutes: parseInt(taskData.estimatedMinutes, 10) || 30,
      completed: !!taskData.completed,
      completedAt: taskData.completed ? (taskData.completedAt || new Date().toISOString()) : null
    };

    store.tasks = [newTask, ...(store.tasks || [])];
    this.writeStore(store);
    return newTask;
  }

  updateTask(taskId, updates) {
    const store = this.readStore();
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
    const prevLength = (store.tasks || []).length;
    store.tasks = (store.tasks || []).filter(t => t.id !== taskId && t._id !== taskId);
    this.writeStore(store);
    return store.tasks.length < prevLength;
  }

  // Challenge operations
  getChallenges() {
    const store = this.readStore();
    return store.challenges || [];
  }

  createChallenge(challengeData) {
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

    const newChallenge = {
      id: challengeData.id || `ch-${Date.now()}`,
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

  // Timer sessions operations
  getTimerSessions() {
    const store = this.readStore();
    return store.timerSessions || [];
  }

  addTimerSession(sessionData) {
    const store = this.readStore();
    const newSession = {
      id: sessionData.id || `ts-${Date.now()}`,
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

  // Full Bi-Directional Intelligent Sync
  syncAll({ user, tasks, challenges, timerSessions }) {
    const store = this.readStore();

    // 1. Merge User
    if (user && user.username) {
      store.user = {
        ...(store.user || defaultUserProfile),
        ...user
      };
    }

    // 2. Merge Tasks: combine existing store tasks with incoming tasks by id / title+date
    if (Array.isArray(tasks) && tasks.length > 0) {
      const taskMap = new Map();
      // First put server tasks
      (store.tasks || []).forEach(t => {
        const key = t.id || `${t.title}_${t.date}`;
        taskMap.set(key, t);
      });
      // Then merge incoming tasks (incoming overrides if newer or completed)
      tasks.forEach(incoming => {
        const key = incoming.id || `${incoming.title}_${incoming.date}`;
        if (taskMap.has(key)) {
          const existing = taskMap.get(key);
          // If incoming is completed or modified, keep incoming
          taskMap.set(key, { ...existing, ...incoming });
        } else {
          taskMap.set(key, incoming);
        }
      });
      store.tasks = Array.from(taskMap.values());
    }

    // 3. Merge Challenges
    if (Array.isArray(challenges) && challenges.length > 0) {
      const chMap = new Map();
      (store.challenges || []).forEach(c => {
        const key = c.id || c.title;
        chMap.set(key, c);
      });
      challenges.forEach(incoming => {
        const key = incoming.id || incoming.title;
        if (chMap.has(key)) {
          chMap.set(key, { ...chMap.get(key), ...incoming });
        } else {
          chMap.set(key, incoming);
        }
      });
      store.challenges = Array.from(chMap.values());
    }

    // 4. Merge Timer Sessions
    if (Array.isArray(timerSessions) && timerSessions.length > 0) {
      const sessMap = new Map();
      (store.timerSessions || []).forEach(s => {
        sessMap.set(s.id, s);
      });
      timerSessions.forEach(incoming => {
        if (incoming.id) {
          sessMap.set(incoming.id, incoming);
        }
      });
      store.timerSessions = Array.from(sessMap.values());
    }

    this.writeStore(store);

    return {
      user: store.user,
      tasks: store.tasks,
      challenges: store.challenges,
      timerSessions: store.timerSessions,
      lastUpdated: store.lastUpdated
    };
  }
}

export const fileStore = new FileStore();
