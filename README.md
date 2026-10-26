# 🎯 DailyTask — Personal Daily Activity Dashboard & Goal Matrix

[![GitHub License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React 18](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248.svg)](https://www.mongodb.com/)
[![Vitest](https://img.shields.io/badge/Tests-14%2F14%20Passing-brightgreen.svg)](https://vitest.dev/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-n0vemberain%2Fdaily--task-blue.svg)](https://github.com/n0vemberain/daily-task)

A modern, high-performance personal daily activity dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Node.js/Express + MongoDB**. Designed with an authentic GitHub dark aesthetic and dark/olive green contribution shades, this application empowers users to build productive habits, track daily task completion, set custom duration streak challenges, and manage academic/professional profiles.

---

## 🌟 Key Features

### 1. 🟩 GitHub Contribution-Style Heatmap (Dark & Olive Green Shades)
- **Authentic 52-Week Matrix:** Tracks daily task completions across 365 days or 6-month views.
- **Olive Green Color Scale:**
  - **Level 0 (No activity):** `#161b22` (GitHub Dark Slate)
  - **Level 1 (1 task):** `#263b19` (Dark Olive)
  - **Level 2 (2 tasks):** `#3d5c24` (Medium Olive)
  - **Level 3 (3–4 tasks):** `#5a8533` (Rich Olive Green)
  - **Level 4 (5+ tasks):** `#7eb644` (Vibrant Olive Green)
- **Interactive Tooltips:** Hover over any date cell on desktop to view exact date, task count, and titles of completed tasks.
- **Mobile Tap Drawer:** Tapping any day cell on mobile screens opens an interactive details drawer with a 1-tap "Manage tasks for this date" action.
- **Click-to-Filter:** Click any day cell in the heatmap to immediately inspect and filter daily tasks for that specific date.
- **Productivity Streaks:** Real-time calculation of **Current Streak**, **Longest Streak (PR)**, **Total Active Days**, and total completed tasks.

---

### 2. 🏆 Challenge-Based Goal Tracker (Custom Duration & Visual Day Grid)
- **Custom Duration Support:** Set challenges of any arbitrary duration:
  - Preset quick picks: **7 Days**, **14 Days**, **21 Days**, **30 Days**, **50 Days**, **75 Hard**, **100 Days**.
  - Custom duration input for tailored routines (e.g. 45 days, 90 days).
- **Day-by-Day Visual Grid:** Every single day of the challenge is rendered as an interactive square card:
  - **Completed (Olive Green Checkmark):** Day accomplished with timestamp.
  - **Skipped / Rest (Amber Alert):** Day intentionally rested or missed.
  - **Today (Pulsing Glow):** Highlights the active target day.
  - **Upcoming (Subtle Slate):** Future milestone days.
- **Daily Reflection & Check-In Modal:** Log daily reflections, accomplishments, or notes for each day.
- **Confetti & Sound Effects:** Celebratory visual confetti effects and synthesized Web Audio tones upon completing challenge milestones!

---

### 3. 👤 User Profile & Academic Skills
- **Profile Photo Upload:** Upload personal photos with instant base64 conversion and preview (supported up to 5MB).
- **Core Credentials:** Full name, GitHub username (`@n0vemberain`), and password with secure toggle visibility (`Eye` / `EyeOff`).
- **Current Field of Study:** Highlight academic discipline (e.g., *Computer Science & Engineering*).
- **Extra Skills Manager:** Interactive skill chips with add/remove tags and 1-click popular skill suggestions (*React*, *Node.js*, *MongoDB*, *TypeScript*, *Docker*, *Tailwind CSS*, etc.).

---

### 4. 💾 Dual-Persistence Architecture (MongoDB + LocalStorage)
- **Offline-First & Instant UI:** All user actions, tasks, profile updates, and challenge check-ins write immediately to `localStorage` for zero-latency performance.
- **MongoDB Synchronization:** Full REST API with Express and Mongoose saves and synchronizes data with MongoDB (`mongodb://localhost:27017/daily_task` or MongoDB Atlas).
- **Resilient Fallback:** If MongoDB is offline or starting up, the client gracefully operates in LocalStorage mode with a visual status pill (`🟡 LocalStorage Active`) and synchronizes seamlessly as soon as the database connects (`🟢 MongoDB & LocalStorage Synced`).
- **Manual & Automatic Sync:** Periodic background sync plus a one-click **"Sync Data"** button.

---

### 5. 🔊 Audio Haptic Feedback & Data Portability
- **Web Audio Synthesizer:** Low-latency ascending harmonic chords played when completing tasks or challenge days (with mute/unmute toggle in navbar).
- **JSON Backup & Restore:** 1-click export of complete dataset (`daily-task-backup-[date].json`) and import/restore file picker.

---

## 📱 Mobile, Tablet & Desktop UX Compatibility

The application is engineered with a mobile-first responsive architecture:

- **Mobile Viewports (375px – 430px):**
  - Sticky bottom thumb-navigation (`MobileBottomNav.jsx`) with elevated center quick-add button.
  - Full support for iOS gesture bars via `env(safe-area-inset-bottom)`.
  - Horizontal swipeable heatmap with visual navigation hint (`← Swipe horizontally to explore full year →`).
  - Minimum 44×44px touch targets.
- **Laptop & Desktop Viewports (1024px – 4K):**
  - Full 52-week horizontal contribution graph with 60fps cursor hover micro-scaling.
  - Floating tooltip engine displaying task titles and completion timestamps.
  - Multi-column challenge grids and real-time task search filtering.
- **Cross-Browser Verified:**
  - Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge, iOS Mobile Safari, and Chrome for Android.

---

## 🔬 Testing & Quality Assurance

Comprehensive unit and integration tests are executed using **Vitest** and **React Testing Library**:

```bash
$ npm test --prefix client

Test Files  4 passed (4)
     Tests  14 passed (14)
  Duration  3.56s
```

Detailed test logs and cross-device metrics are documented in [TESTING_REPORT.md](TESTING_REPORT.md).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- (Optional) MongoDB local service or MongoDB Atlas connection string

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/n0vemberain/daily-task.git
cd daily-task
npm run install:all
```

### 2. Configure Environment (Optional)
Create `server/.env` (pre-configured defaults provided):
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/daily_task
```

### 3. Start Development Server
Run both Express server and Vite React client simultaneously with a single command:
```bash
npm run dev
```

- **Frontend Client:** `http://localhost:5173`
- **Backend API:** `http://localhost:5001`
- **Health Check:** `http://localhost:5001/api/health`

### 4. Run Test Suite
```bash
cd client
npm test
```

### 5. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
daily-task/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header, Tab navigation, Sound & Backup
│   │   │   ├── ContributionHeatmap.jsx  # Dark & Olive Green Heatmap matrix
│   │   │   ├── StatsOverview.jsx        # Streaks & metrics summary cards
│   │   │   ├── ChallengeTracker.jsx     # Challenge grid with day check-ins
│   │   │   ├── ChallengeModal.jsx       # Modal for creating custom challenges
│   │   │   ├── CheckInModal.jsx         # Modal for day-by-day check-in & notes
│   │   │   ├── TaskManager.jsx          # Daily task CRUD, search & category filters
│   │   │   ├── UserProfile.jsx          # Profile photo, password, study & skills
│   │   │   ├── SyncStatusBadge.jsx      # MongoDB & LocalStorage sync indicator
│   │   │   ├── BackupModal.jsx          # Export & restore JSON data backups
│   │   │   ├── MobileBottomNav.jsx      # Mobile sticky bottom thumb navigation
│   │   │   └── GithubIcon.jsx           # SVG GitHub icon
│   │   ├── services/
│   │   │   ├── storageService.js        # LocalStorage persistence manager
│   │   │   └── apiService.js            # Express API integration
│   │   ├── utils/
│   │   │   └── audioFeedback.js         # Web Audio API tone synthesizer
│   │   ├── tests/
│   │   │   ├── storageService.test.js   # Storage tests
│   │   │   ├── ContributionHeatmap.test.jsx
│   │   │   ├── ChallengeTracker.test.jsx
│   │   │   ├── UserProfile.test.jsx
│   │   │   └── setup.js
│   │   ├── data/
│   │   │   └── initialData.js           # Seed data for immediate rich preview
│   │   ├── App.jsx                      # Main app controller & sync pipeline
│   │   ├── main.jsx                     # Vite React entry point
│   │   └── index.css                    # Tailwind CSS directives & scrollbars
│   ├── tailwind.config.js               # Olive green & GitHub dark color palette
│   ├── vitest.config.js                 # Vitest test runner configuration
│   └── vite.config.js                   # Vite config with API proxy
├── server/                     # Express + Mongoose Backend
│   ├── models/
│   │   ├── User.js                      # User profile schema
│   │   ├── Task.js                      # Task schema
│   │   └── Challenge.js                 # Challenge schema with checkIns subdocs
│   ├── routes/
│   │   ├── userRoutes.js                # Profile endpoints
│   │   ├── taskRoutes.js                # Task CRUD & heatmap aggregation
│   │   ├── challengeRoutes.js           # Challenge CRUD & day check-in
│   │   └── syncRoutes.js                # Bi-directional dual sync endpoint
│   ├── server.js                        # Express server entry point
│   ├── .env.example
│   └── package.json
├── TESTING_REPORT.md                    # Comprehensive cross-browser & mobile report
├── .gitignore
├── package.json                         # Root concurrency orchestrator
└── README.md
```

---

## 🔗 Repository & Author
- **GitHub Repository:** [https://github.com/n0vemberain/daily-task](https://github.com/n0vemberain/daily-task)
- **Author:** Fatin Ishraque ([@n0vemberain](https://github.com/n0vemberain))
