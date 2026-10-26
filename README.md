# 🎯 DailyTask — Personal Daily Activity Dashboard & Goal Matrix

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
- **Interactive Tooltips:** Hover over any date cell to view exact date, task count, and titles of completed tasks.
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
- **Confetti Micro-Interactions:** Celebratory visual effects upon completing challenge milestones!

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

## 🚀 Quick Start

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

### 4. Build for Production
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
│   │   │   ├── Navbar.jsx               # Header, Tab navigation & Sync Status
│   │   │   ├── ContributionHeatmap.jsx  # Dark & Olive Green Heatmap matrix
│   │   │   ├── StatsOverview.jsx        # Streaks & metrics summary cards
│   │   │   ├── ChallengeTracker.jsx     # Challenge grid with day check-ins
│   │   │   ├── ChallengeModal.jsx       # Modal for creating custom challenges
│   │   │   ├── CheckInModal.jsx         # Modal for day-by-day check-in & notes
│   │   │   ├── TaskManager.jsx          # Daily task CRUD & category filters
│   │   │   ├── UserProfile.jsx          # Profile photo, password, study & skills
│   │   │   ├── SyncStatusBadge.jsx      # MongoDB & LocalStorage sync indicator
│   │   │   └── GithubIcon.jsx           # SVG GitHub icon
│   │   ├── services/
│   │   │   ├── storageService.js        # LocalStorage persistence manager
│   │   │   └── apiService.js            # Express API integration
│   │   ├── data/
│   │   │   └── initialData.js           # Seed data for immediate rich preview
│   │   ├── App.jsx                      # Main app controller & sync pipeline
│   │   ├── main.jsx                     # Vite React entry point
│   │   └── index.css                    # Tailwind CSS directives & scrollbars
│   ├── tailwind.config.js               # Olive green & GitHub dark color palette
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
├── .gitignore
├── package.json                         # Root concurrency orchestrator
└── README.md
```

---

## 🔗 Repository
- **GitHub:** [https://github.com/n0vemberain/daily-task](https://github.com/n0vemberain/daily-task)
- **Author:** Fatin Ishraque ([@n0vemberain](https://github.com/n0vemberain))
