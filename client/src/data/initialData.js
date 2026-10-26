// Helper to format date YYYY-MM-DD in local time
export const formatDateStr = (d) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getPastDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDateStr(d);
};

export const todayStr = formatDateStr(new Date());

export const initialUserProfile = {
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

export const initialTasks = [
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
    estimatedMinutes: 40
  },
  {
    id: 'task-4',
    title: 'Evening 30-minute cardio & stretching',
    category: 'Fitness',
    priority: 'Low',
    completed: false,
    completedAt: null,
    date: todayStr,
    estimatedMinutes: 30
  },
  // Past tasks to populate heatmap realistically
  {
    id: 'task-p1',
    title: 'Review System Design Microservices Patterns',
    category: 'Study',
    priority: 'Medium',
    completed: true,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    date: getPastDateStr(1),
    estimatedMinutes: 60
  },
  {
    id: 'task-p2',
    title: 'Implement JWT authentication backend',
    category: 'Coding',
    priority: 'High',
    completed: true,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    date: getPastDateStr(1),
    estimatedMinutes: 75
  },
  {
    id: 'task-p3',
    title: 'Solve 3 LeetCode Graph Traversal problems',
    category: 'Coding',
    priority: 'High',
    completed: true,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    date: getPastDateStr(1),
    estimatedMinutes: 90
  },
  {
    id: 'task-p4',
    title: 'Push feature updates to GitHub repository',
    category: 'Coding',
    priority: 'Medium',
    completed: true,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    date: getPastDateStr(1),
    estimatedMinutes: 20
  },
  // Days 2 to 60 with realistic activity
  ...generateHistoricalTasks()
];

function generateHistoricalTasks() {
  const tasks = [];
  // Generate sample completions for past 120 days with a nice realistic pattern
  for (let i = 2; i <= 120; i++) {
    const dateStr = getPastDateStr(i);
    // Skip some days (e.g. weekend rest or break)
    const dayOfWeek = new Date(dateStr).getDay();
    let count = 0;
    if (i % 7 === 0) {
      count = 1; // light day
    } else if (i % 11 === 0) {
      count = 0; // rest day
    } else if (i % 3 === 0) {
      count = 4; // heavy day
    } else if (i % 2 === 0) {
      count = 3; // medium-heavy
    } else {
      count = 2; // medium
    }

    const titles = [
      'DSA Practice & Problem Solving',
      'React Components Refactoring',
      'Backend REST API optimization',
      'Database Schema Migration',
      'CS Fundamentals Reading'
    ];

    for (let c = 0; c < count; c++) {
      tasks.push({
        id: `hist-${i}-${c}`,
        title: `${titles[c % titles.length]} #${i}`,
        category: c % 2 === 0 ? 'Coding' : 'Study',
        priority: 'Medium',
        completed: true,
        completedAt: new Date(Date.now() - i * 86400000).toISOString(),
        date: dateStr,
        estimatedMinutes: 30 + c * 15
      });
    }
  }
  return tasks;
}

// Initial challenges
export const initialChallenges = [
  {
    id: 'ch-1',
    title: '30-Day Full-Stack & LeetCode Sprint',
    description: 'Solve at least 2 coding problems and commit code every day for 30 consecutive days.',
    category: 'Coding',
    durationDays: 30,
    startDate: getPastDateStr(8),
    endDate: (() => {
      const d = new Date(getPastDateStr(8));
      d.setDate(d.getDate() + 29);
      return formatDateStr(d);
    })(),
    status: 'active',
    checkIns: Array.from({ length: 30 }, (_, index) => {
      const d = new Date(getPastDateStr(8));
      d.setDate(d.getDate() + index);
      const dateStr = formatDateStr(d);
      const isPast = index < 8;
      const isToday = index === 8;

      return {
        dayNumber: index + 1,
        date: dateStr,
        status: isPast ? (index === 3 ? 'skipped' : 'completed') : isToday ? 'completed' : 'pending',
        note: isPast
          ? `Day ${index + 1} completed: solved daily challenge and worked on personal dashboard.`
          : isToday
          ? 'Completed daily goals & pushed updates to GitHub.'
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
    startDate: getPastDateStr(4),
    endDate: (() => {
      const d = new Date(getPastDateStr(4));
      d.setDate(d.getDate() + 20);
      return formatDateStr(d);
    })(),
    status: 'active',
    checkIns: Array.from({ length: 21 }, (_, index) => {
      const d = new Date(getPastDateStr(4));
      d.setDate(d.getDate() + index);
      const dateStr = formatDateStr(d);
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

export const initialTimerSessions = [
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
    date: getPastDateStr(1),
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    category: 'Study',
    label: 'Database Systems Architecture'
  },
  {
    id: 'ts-4',
    durationMinutes: 30,
    date: getPastDateStr(2),
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    category: 'Coding',
    label: 'Tailwind UI Polish'
  },
  {
    id: 'ts-5',
    durationMinutes: 60,
    date: getPastDateStr(5),
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    category: 'Study',
    label: 'Computer Networks'
  },
  {
    id: 'ts-6',
    durationMinutes: 45,
    date: getPastDateStr(15),
    timestamp: new Date(Date.now() - 1296000000).toISOString(),
    category: 'Study',
    label: 'Operating Systems Virtual Memory'
  },
  {
    id: 'ts-7',
    durationMinutes: 50,
    date: getPastDateStr(40),
    timestamp: new Date(Date.now() - 3456000000).toISOString(),
    category: 'Study',
    label: 'Software Engineering Concepts'
  }
];
