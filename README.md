# DailyTask — Personal Daily Activity Dashboard and Goal Matrix

A web-based personal daily activity dashboard developed with React 18, Vite, Tailwind CSS, and Node.js/Express with MongoDB. Engineered with an authentic GitHub dark aesthetic and dynamic color theme palettes, this system provides visual productivity analytics, custom-duration habit challenge tracking, individual item editing, manual category creation, comprehensive data cleaning, full-screen authentication protection, and a centered navigation architecture.

---

## Key Features

### 1. Centered Navigation Architecture and Settings Modal
- **Centered Navigation Tabs:** The primary navigation tabs (**Heatmap & Overview**, **Goal Challenges**, **Daily Tasks**, and **Profile & Skills**) are centered in the top navigation bar.
- **Unified Settings Modal (`SettingsModal.jsx`):** Auxiliary controls have been consolidated from the header into a dedicated Settings modal:
  - **Theme Chooser:** Instant switching between 5 themes with live palette swatch previews.
  - **Dual Persistence & Sync:** Live MongoDB connection status, last sync timestamp, and on-demand "Sync Now" button.
  - **Audio Feedback:** Sound effects toggle (mute / unmute) with an instant audio test tone.
  - **Data Portability:** JSON backup download and restore upload options.
  - **Data Cleaning Center:** Clean completed tasks, wipe challenges, restore sample data, or full factory reset.
  - **Repository & System Info:** Direct links to the GitHub repository and system architecture documentation.

---

### 2. Full-Screen Authentication Gate (`LoginView.jsx`)
- **Strict Privacy Protection:** Unauthenticated sessions are blocked by a full-screen authentication screen. The dashboard, tasks, challenges, and activity heatmap remain hidden until credentials are confirmed.
- **One-Click Demo Credentials:** An "Auto-fill Demo Credentials" button populates registered demo credentials (`n0vemberain` / `Password123!`) for instant access.
- **Instant Sign-Out / Session Lock:** Clicking "Sign Out" in the navigation bar immediately clears the session and returns the user to the full-screen login screen.

---

### 3. Full-Width Container Heatmap (1 Year and 6 Months)
- **Full Container Width Scaling:** Selecting **1 Year (52 weeks)** or **Last 6 Months (26 weeks)** expands columns proportionally (`1fr` grid) across 100% of the container box width, leaving no empty space on the right.
- **1 Month Responsive Grid:** The 1-Month view remains an optimized 5-week touch-friendly calendar tailored for mobile viewports.
- **Dynamic Month Labels:** Month indicators align above their corresponding week columns across all screen resolutions.
- **5 Selectable Themes:** Olive Green, Emerald Mint, Ocean Cyan, Sunset Amber, and Amethyst Purple.

---

### 4. Manual Custom Category Creation
- **Flexible Category Workflow:** Users can pick from standard presets or manually enter custom category names in:
  - **Task Manager (`TaskManager.jsx`):** Type custom categories when adding a task or filter tasks by custom tags.
  - **Edit Task Modal (`EditTaskModal.jsx`):** Assign tasks to custom categories.
  - **Challenge Modal (`ChallengeModal.jsx`):** Create habit challenges under custom categories.
  - **Edit Challenge Modal (`EditChallengeModal.jsx`):** Update challenge category tags.
- **Persistent Tag Registry:** Custom categories persist in `localStorage` (`daily_task_custom_categories`) and appear in filter dropdowns automatically.

---

### 5. Individual Item Editing Across All Modules
- **Individual Task Editing (`EditTaskModal.jsx`):** Modify task description, category, priority, date, and estimated duration.
- **Individual Challenge Editing (`EditChallengeModal.jsx`):** Update challenge title, description, and category.
- **Individual Day Reflection Check-In (`CheckInModal.jsx`):** Log daily check-in status (Completed, Skipped/Rest, Pending) and append personal accomplishment reflections.
- **Individual User Profile Editing (`UserProfile.jsx`):** Update full name, username handle, password, academic concentration, and add or delete skill tags.

---

### 6. Comprehensive Data Cleaning and Factory Reset Center
- **Selective and Global Cleaning (`SettingsModal.jsx` & `DataCleanModal.jsx`):**
  - **Clean Completed Tasks Only:** Removes finished tasks while preserving active pending tasks and challenges.
  - **Clean All Habit Challenges:** Wipes all habit challenge goals.
  - **Restore Standard Sample Data:** Re-seeds realistic demonstration tasks, challenges, and multi-month heatmap records.
  - **Full Factory Reset:** Complete database wipe protected by a double-confirmation safety barrier.

---

### 7. Dual-Persistence Architecture (MongoDB and LocalStorage)
- **Zero-Latency Offline-First Operation:** All client state updates, task completions, and profile edits persist immediately to browser `localStorage`.
- **Database Synchronization:** An Express REST API with Mongoose handles bi-directional data persistence with MongoDB (`mongodb://localhost:27017/daily_task` or remote MongoDB Atlas).
- **Resilient Fallback Mode:** When MongoDB is unreachable, the client operates in LocalStorage mode with an informational status badge (`LocalStorage Active`) and synchronizes automatically upon database reconnection.
- **Manual and Periodic Synchronization:** Automatic background sync combined with a manual `Sync Now` button.

---

### 8. Remote Public Access via Cloudflare Tunnel
- **Global Network Access:** Integrated Cloudflare Tunnel (`cloudflared`) enables secure public HTTPS access from any smartphone, laptop, or remote network without port forwarding or DNS configuration.
- **Single-Port Architecture:** Express server hosts both the compiled React frontend (`client/dist`) and REST API (`/api/*`) on port 5001, providing clean remote access via a single tunnel.

---

## Automated Test Suite

Unit and integration tests are executed using Vitest and React Testing Library:

```bash
$ npm test --prefix client

 Test Files  10 passed (10)
      Tests  35 passed (35)
   Duration  3.19s
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
│   │   │   ├── Navbar.jsx               # Header with centered navigation tabs, settings & sign out
│   │   │   ├── SettingsModal.jsx        # Consolidated settings, themes, sync, sound, backup, clean
│   │   │   ├── LoginView.jsx            # Full-screen authentication gate screen
│   │   │   ├── ContributionHeatmap.jsx  # Full-width 1-year, 6-month & 1-month heatmap
│   │   │   ├── StatsOverview.jsx        # Streaks and productivity summary cards
│   │   │   ├── ChallengeTracker.jsx     # Challenge grid and daily check-ins
│   │   │   ├── ChallengeModal.jsx       # Modal for creating challenges with manual categories
│   │   │   ├── CheckInModal.jsx         # Modal for day check-in and reflection notes
│   │   │   ├── TaskManager.jsx          # Task CRUD with manual custom category creation
│   │   │   ├── UserProfile.jsx          # Profile credentials, photo, and skills
│   │   │   ├── LoginModal.jsx           # Account login & authentication modal
│   │   │   ├── DataCleanModal.jsx       # Data cleaning & factory reset modal
│   │   │   ├── EditTaskModal.jsx        # Modal for editing individual tasks & categories
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
│   │   │   ├── LoginModal.test.jsx
│   │   │   ├── LoginView.test.jsx       # Authentication gate test suite
│   │   │   ├── SettingsModal.test.jsx   # Settings modal test suite
│   │   │   ├── TaskManager.test.jsx     # Manual category creation test suite
│   │   │   ├── DataCleanModal.test.jsx
│   │   │   ├── ThemeContext.test.jsx
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
