# DailyTask — Personal Daily Activity Dashboard and Goal Matrix

A web-based personal daily activity dashboard developed with React 18, Vite, Tailwind CSS, and Node.js/Express with MongoDB. Engineered with an authentic GitHub dark aesthetic and dynamic color theme palettes, this system provides visual productivity analytics, custom-duration habit challenge tracking, individual item editing, data cleaning management, and user authentication.

---

## Key Features

### 1. App-Wide Dynamic Color Themes
- **System-Wide Palette Synchronisation:** Unlike standalone components, selecting a theme instantly transforms the entire application, including the top navigation bar, metric cards, heatmap cells, challenge progress indicators, task priority badges, mobile navigation controls, and modal dialogs.
- **5 Curated Color Themes:**
  - **Olive Green (Default):** GitHub dark slate with dark to vibrant olive green shades (#161b22, #263b19, #3d5c24, #5a8533, #7eb644).
  - **Emerald Mint:** Deep forest to vivid emerald green (#161b22, #0e4429, #006d32, #26a641, #39d353).
  - **Ocean Cyan:** Deep marine to neon cyber cyan (#161b22, #0b3c49, #0e6075, #189cb5, #38d8f5).
  - **Sunset Amber:** Dark espresso to golden sunrise amber (#161b22, #452607, #783c07, #b86209, #f59e0b).
  - **Amethyst Purple:** Obsidian to bright lavender purple (#161b22, #341948, #58207c, #8736bf, #b366f5).
- **Persistent Preferences:** Theme selection is saved to browser `localStorage` and maintained across sessions and page reloads.

---

### 2. GitHub Contribution-Style Heatmap (Multi-Timeframe and Responsive Grid)
- **Selectable Timeframes (1 Year, 6 Months, 1 Month):**
  - **1 Year (52 Weeks):** Comprehensive annual activity matrix showing all 365 days.
  - **6 Months (26 Weeks):** Mid-term view highlighting recent consistency and momentum.
  - **1 Month (5 Weeks):** Dedicated responsive mobile-optimized monthly calendar with enlarged touch-friendly squares and day-of-month indicators that fit any phone screen without horizontal scrolling.
- **Interactive Tooltips:** Dynamic cursor-following tooltips display exact calendar dates, total tasks completed, and individual task titles.
- **Mobile Tap Drawer:** On touch devices, tapping any cell opens a dedicated date inspection card with a one-tap action to filter and manage tasks for that day.
- **Filter by Date:** Clicking a day cell immediately filters the daily task manager to show tasks scheduled or completed on that date.
- **Productivity Streaks:** Real-time calculation of Current Streak, Longest Streak (All-Time Record), Total Active Days, and Total Completed Tasks.

---

### 3. User Authentication and Session Management
- **Dedicated Authentication Modal (`LoginModal.jsx`):** Enables user sign-in with username and password verification.
- **Convenient Auto-Fill:** One-click credential helper to populate registered credentials (`n0vemberain` / `Password123!`).
- **Session Lock and Sign Out:** Lock session into guest view mode or switch accounts directly from the top navigation bar or user profile settings.
- **Session Persistence:** Remembers user authentication state via `localStorage`.

---

### 4. Comprehensive Data Cleaning and Factory Reset Center
- **Selective and Global Cleaning (`DataCleanModal.jsx`):**
  - **Clean Completed Tasks Only:** Removes finished tasks while preserving active pending tasks, streak history, and habit challenges.
  - **Clean All Habit Challenges:** Wipes all challenge records while retaining the task database.
  - **Restore Standard Sample Data:** Re-seeds realistic demonstration tasks, challenges, and multi-month heatmap activity.
  - **Full Factory Reset:** Complete database wipe with a double-confirmation safety barrier to prevent accidental data loss.

---

### 5. Individual Item Editing Across All Modules
- **Individual Task Editing (`EditTaskModal.jsx`):** Edit task title, category (Coding, Study, Fitness, Work, General), priority level (Low, Medium, High), scheduled date, and estimated duration.
- **Individual Challenge Editing (`EditChallengeModal.jsx`):** Modify challenge title, description, and category.
- **Individual Day Reflection Check-In (`CheckInModal.jsx`):** Edit check-in status (Completed, Skipped/Rest, Pending) and append personal accomplishment notes or reflections for each specific day.
- **Individual User Profile Editing (`UserProfile.jsx`):** Update full name, username handle, password, academic concentration, and add or remove individual skill tags.

---

### 6. Responsive Navigation and Mobile Architecture
- **Desktop Navigation Bar:** Includes brand logo with dynamic theme gradient, navigation tabs, real-time sync badge, theme switcher dropdown, audio feedback toggle, JSON backup modal trigger, data cleaning shortcut, repository link, and account avatar.
- **Mobile Drawer Navigation:** Accessible hamburger menu featuring user profile preview, full 5-theme color picker, tab links, sync triggers, and data management shortcuts.
- **Sticky Bottom Navigation (`MobileBottomNav.jsx`):** Thumb-friendly fixed footer for smartphones (<768px) with an elevated quick-add button and iOS safe-area support (`env(safe-area-inset-bottom)`).

---

### 7. Dual-Persistence Architecture (MongoDB and LocalStorage)
- **Zero-Latency Offline-First Operation:** All client state updates, task completions, and profile edits persist immediately to browser `localStorage`.
- **Database Synchronization:** An Express REST API with Mongoose handles bi-directional data persistence with MongoDB (`mongodb://localhost:27017/daily_task` or remote MongoDB Atlas).
- **Resilient Fallback Mode:** When MongoDB is unreachable, the client operates in LocalStorage mode with an informational status badge (`LocalStorage Active`) and synchronizes automatically upon database connection.
- **Manual and Periodic Synchronization:** Automatic background sync combined with a manual `Sync Data` button.

---

### 8. Audio Haptic Feedback and JSON Portability
- **Synthesized Audio Tones:** Web Audio API sound generator providing subtle ascending harmonic chords upon task or challenge completion (includes navbar mute/unmute control).
- **JSON Data Backup and Restore:** One-click data export to formatted JSON (`daily-task-backup-[date].json`) and full JSON backup restoration.

---

### 9. Remote Public Access via Cloudflare Tunnel
- **Global Network Access:** Integrated Cloudflare Tunnel (`cloudflared`) enables secure public HTTPS access from any smartphone, laptop, or remote network without port forwarding or DNS configuration.
- **Single-Port Architecture:** Express server hosts both the compiled React frontend (`client/dist`) and REST API (`/api/*`) on port 5001, providing clean remote access via a single tunnel.

---

## Device and Cross-Browser Compatibility

### Mobile Responsiveness (375px to 430px)
- **Sticky Bottom Navigation:** Fixed thumb-friendly navigation bar on viewports under 768px.
- **iOS Safe Area Support:** Uses `env(safe-area-inset-bottom)` to prevent interface clipping.
- **Touch Targets:** Interactive controls maintain minimum dimensions of 44x44px.

### Desktop Optimization (1024px to 4K Displays)
- **Full 52-Week Visualization:** Displays complete annual contribution grid without layout breakage.
- **Multi-Column Layouts:** Four-column metrics overview and real-time task search filtering.

### Browser Engine Verification
- **Google Chrome / Chromium:** Verified on Blink engine.
- **Apple Safari / iOS Safari:** Verified on WebKit engine.
- **Mozilla Firefox:** Verified on Gecko engine.
- **Microsoft Edge:** Verified on Chromium engine.

---

## Automated Test Suite

Unit and integration tests are executed using Vitest and React Testing Library:

```bash
$ npm test --prefix client

 Test Files  7 passed (7)
      Tests  26 passed (26)
   Duration  5.11s
```

Detailed test coverage and audit metrics are documented in [TESTING_REPORT.md](TESTING_REPORT.md).

---

## Installation and Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)
- (Optional) MongoDB local service or MongoDB Atlas connection string

### 1. Clone Repository and Install Dependencies
```bash
git clone https://github.com/n0vemberain/daily-task.git
cd daily-task
npm run install:all
```

### 2. Environment Configuration (Optional)
Create `server/.env` (default configuration provided in `server/.env.example`):
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/daily_task
```

### 3. Local Development Mode
Run both Express server and Vite client concurrently:
```bash
npm run dev
```
- Frontend Client: `http://localhost:5173`
- Backend API: `http://localhost:5001`
- Server Health Check: `http://localhost:5001/api/health`

### 4. Remote Access via Cloudflare Tunnel
To run the application and make it accessible from any phone or remote internet connection:
```bash
npm run tunnel
```
This builds the production assets, starts the integrated Express server, and outputs a public Cloudflare URL (e.g., `https://[subdomain].trycloudflare.com`).

### 5. Production Build
```bash
npm run build
```

---

## Project Structure

```
daily-task/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header, theme switcher, responsive drawer
│   │   │   ├── ContributionHeatmap.jsx  # Multi-range heatmap with 5 color themes
│   │   │   ├── StatsOverview.jsx        # Streaks and productivity summary cards
│   │   │   ├── ChallengeTracker.jsx     # Challenge grid and daily check-ins
│   │   │   ├── ChallengeModal.jsx       # Modal for creating custom challenges
│   │   │   ├── CheckInModal.jsx         # Modal for day check-in and reflection notes
│   │   │   ├── TaskManager.jsx          # Task CRUD, search and category filters
│   │   │   ├── UserProfile.jsx          # Profile credentials, photo, and skills
│   │   │   ├── LoginModal.jsx           # Account login & authentication modal
│   │   │   ├── DataCleanModal.jsx       # Data cleaning & factory reset modal
│   │   │   ├── EditTaskModal.jsx        # Modal for editing individual tasks
│   │   │   ├── EditChallengeModal.jsx   # Modal for editing individual challenges
│   │   │   ├── SyncStatusBadge.jsx      # MongoDB and LocalStorage sync indicator
│   │   │   ├── BackupModal.jsx          # JSON data export and import modal
│   │   │   ├── MobileBottomNav.jsx      # Mobile sticky bottom navigation
│   │   │   └── GithubIcon.jsx           # SVG GitHub icon
│   │   ├── context/
│   │   │   └── ThemeContext.jsx         # Global 5-theme provider and hook
│   │   ├── services/
│   │   │   ├── storageService.js        # LocalStorage persistence manager
│   │   │   └── apiService.js            # Express API communication client
│   │   ├── utils/
│   │   │   └── audioFeedback.js         # Web Audio API tone synthesizer
│   │   ├── tests/
│   │   │   ├── storageService.test.js   # Storage persistence test suite
│   │   │   ├── ContributionHeatmap.test.jsx
│   │   │   ├── ChallengeTracker.test.jsx
│   │   │   ├── UserProfile.test.jsx
│   │   │   ├── LoginModal.test.jsx      # Authentication modal test suite
│   │   │   ├── DataCleanModal.test.jsx  # Data cleaning modal test suite
│   │   │   ├── ThemeContext.test.jsx    # Global theme switching test suite
│   │   │   └── setup.js
│   │   ├── data/
│   │   │   └── initialData.js           # Seed data for immediate preview
│   │   ├── App.jsx                      # Root application controller and sync pipeline
│   │   ├── main.jsx                     # Vite React entrypoint wrapped with ThemeProvider
│   │   └── index.css                    # Tailwind CSS directives and cross-browser styling
│   ├── tailwind.config.js               # Theme color definitions
│   ├── vitest.config.js                 # Vitest runner configuration
│   └── vite.config.js                   # Vite configuration with API proxy
├── server/                     # Express and Mongoose Backend
│   ├── models/
│   │   ├── User.js                      # User profile document schema
│   │   ├── Task.js                      # Task document schema
│   │   └── Challenge.js                 # Challenge document schema
│   ├── routes/
│   │   ├── userRoutes.js                # Profile API endpoints
│   │   ├── taskRoutes.js                # Task CRUD and heatmap aggregation endpoints
│   │   ├── challengeRoutes.js           # Challenge CRUD and check-in endpoints
│   │   └── syncRoutes.js                # Bi-directional dual sync endpoint
│   ├── server.js                        # Express server entry point with static asset hosting
│   ├── .env.example
│   └── package.json
├── scripts/
│   └── start-tunnel.js                  # Cloudflare Tunnel orchestration runner
├── TESTING_REPORT.md                    # Device, browser, and testing documentation
├── .gitignore
├── package.json                         # Root concurrency orchestrator
└── README.md
```

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server status and MongoDB connectivity |
| `GET` | `/api/user/profile` | Fetches active user profile |
| `PUT` | `/api/user/profile` | Updates user credentials, photo, and skills |
| `GET` | `/api/tasks` | Lists tasks (supports `?date=YYYY-MM-DD` query filter) |
| `POST` | `/api/tasks` | Creates a new task |
| `PUT` | `/api/tasks/:id` | Updates task title, category, priority, status, or date |
| `DELETE` | `/api/tasks/:id` | Deletes a task |
| `GET` | `/api/tasks/heatmap` | Aggregates completed task counts grouped by date |
| `GET` | `/api/challenges` | Lists all challenges |
| `POST` | `/api/challenges` | Creates challenge and generates day-by-day check-in array |
| `POST` | `/api/challenges/:id/checkin` | Updates daily check-in status and reflection notes |
| `DELETE` | `/api/challenges/:id` | Deletes a challenge |
| `POST` | `/api/sync` | Bi-directional synchronization between LocalStorage and MongoDB |

---

## Repository and License
- **GitHub Repository:** [https://github.com/n0vemberain/daily-task](https://github.com/n0vemberain/daily-task)
- **Author:** Fatin Ishraque ([@n0vemberain](https://github.com/n0vemberain))
- **License:** MIT
