# DailyTask — Production-Grade Productivity Engineering Platform

[![CI/CD Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![Test Suite](https://img.shields.io/badge/tests-85%2F85%20passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.18-gray?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Active-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Cloudflare Tunnel](https://img.shields.io/badge/Cloudflare-Tunnel-orange?style=flat-square&logo=cloudflare)](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

An enterprise-grade personal productivity and activity engineering platform engineered with React 18, Vite, Tailwind CSS, Express, and dual-layer persistence (FileStore + MongoDB). Designed with an authentic GitHub Dark aesthetic and multi-palette theming, DailyTask integrates high-resolution contribution heatmaps, goal challenge tracking, Pomodoro focus cycles, password-protected historical audits, and isolated multi-tenant guest account management.

---

## About The Project

DailyTask is built for software engineers, researchers, and goal-driven professionals who require immutable activity logging, streak preservation, and multi-device access without vendor lock-in.

### Core Architectural Pillars
- **Authentic Activity Heatmap:** Proportional SVG-free grid displaying daily task intensity across 1-Year (52 weeks), 6-Months (26 weeks), and 1-Month mobile layouts with outside-click neutralization.
- **Multi-Tenant User Isolation:** Role-based access control separating primary Administrator privileges from isolated Guest accounts. Guest sessions are strictly partitioned with separate profile metadata, skill sets, and habit histories.
- **Dual Offline-First Persistence:** Instant local updates via browser `localStorage` mirrored asynchronously with Node.js/Express `FileStore` and MongoDB. Graceful offline fallback guarantees zero data loss during network disruptions.
- **Protected Historical Integrity:** Critical operational barriers preventing accidental or unauthorized alteration of past records. Status toggling, task editing, and deletions on previous dates require account password verification.
- **Edge Deployment & Remote Access:** Built-in Cloudflare Tunnel integration provides global encrypted HTTPS ingress and dynamic QR-code pairing without public IP or router port forwarding.

---

## System Architecture

```text
[ Remote Mobile / Desktop Client ]
              │ (Encrypted HTTPS)
              ▼
   [ Cloudflare Edge Tunnel ]
              │
              ▼
    [ Express API Server :5001 ]
    ├── Static Production Bundle (/client/dist)
    ├── Authentication & Role Middleware (/api/auth)
    ├── Multi-User Management (/api/user)
    ├── Task & Challenge Sync Routes (/api/sync)
    └── Dual Persistence Layer
         ├── Primary FileStore (Atomic JSON Storage)
         └── MongoDB Database (Mongoose ODM)
```

---

## Key Features

### 1. Goal Challenge Day Check-In and Daily Tasks Integration
- **Direct Task Planning Inside Challenge Days:** In Goal Challenges, opening any day (e.g. Day 1) allows users to add daily tasks directly inside the Check-in modal with title, priority (High, Medium, Low), and estimated duration.
- **Bi-Directional Daily Task Synchronization:** Tasks planned inside a challenge day immediately synchronize with the main Daily Task list, tagged with a dedicated challenge badge (e.g., `Day 1 • 30-Day LeetCode Grind`).
- **Interactive Day Grid Task Counters:** Each day square in the challenge matrix displays a real-time completion counter (e.g., `1/2`) representing finished vs total planned tasks for that date.

---

### 2. Password-Protected History and Past Data Security (`PasswordPromptModal.jsx`)
- **Restricted History Modification:** Any attempt to edit, change completion status, or delete historical records (dates prior to today) triggers a secure password authorization prompt.
- **Account Password Authorization:** Users must verify their account password before modifying past task status, editing past tasks, deleting past tasks, or updating past challenge day reflections.
- **Tamper-Resistant Historical Records:** Prevents accidental backdating or deletion while granting access once verified with credentials.

---

### 3. Neutral Activity Heatmap with Outside-Click Reset
- **Pure Activity Visualization:** Heatmap cells strictly display authentic activity colors without neon glowing shadow halos or distracting hover rings.
- **Outside-Click Neutralization:** Clicking anywhere outside the heatmap container immediately resets active selections and returns the heatmap to its neutral state.
- **Full Container Width Scaling:** Selecting 1 Year (52 weeks) or Last 6 Months (26 weeks) stretches seamlessly across 100% of the box width.
- **Dedicated 1-Month Mobile Grid:** 5-week touch-friendly view tailored for smartphones and narrow screens.
- **5 Selectable Color Themes:** Olive Green, Emerald Mint, Ocean Cyan, Sunset Amber, and Amethyst Purple.

---

### 4. Centered Navigation Architecture and Settings Modal
- **Centered Navigation Tabs:** The primary navigation tabs (Heatmap & Overview, Goal Challenges, Daily Tasks, and Profile & Skills) are centered in the top navigation bar.
- **Unified Settings Modal (`SettingsModal.jsx`):** Auxiliary controls have been consolidated from the header into a dedicated Settings modal:
  - **Theme Chooser:** Instant switching between 5 themes with live palette swatch previews.
  - **Dual Persistence & Sync:** Live MongoDB connection status, last sync timestamp, and on-demand "Sync Now" button.
  - **Audio Feedback:** Sound effects toggle (mute / unmute) with an instant audio test tone.
  - **Data Portability:** JSON backup download and restore upload options.
  - **Data Cleaning Center:** Clean completed tasks, wipe challenges, restore sample data, or full factory reset.
  - **Repository & System Info:** Direct links to the GitHub repository and system architecture documentation.

---

### 5. Full-Screen Authentication Gate (`LoginView.jsx`)
- **Strict Privacy Protection:** Unauthenticated sessions are blocked by a full-screen authentication screen. The dashboard, tasks, challenges, and activity heatmap remain hidden until credentials are confirmed.
- **One-Click Demo Credentials:** An "Auto-fill Demo Credentials" button populates registered demo credentials (`n0vemberain` / `Password123!`) for instant access.
- **Instant Sign-Out / Session Lock:** Clicking "Sign Out" in the navigation bar immediately clears the session and returns the user to the full-screen login screen.

---

### 6. Manual Custom Category Creation
- **Flexible Category Workflow:** Users can pick from standard presets or manually enter custom category names in:
  - **Task Manager (`TaskManager.jsx`):** Type custom categories when adding a task or filter tasks by custom tags.
  - **Edit Task Modal (`EditTaskModal.jsx`):** Assign tasks to custom categories.
  - **Challenge Modal (`ChallengeModal.jsx`):** Create habit challenges under custom categories.
  - **Edit Challenge Modal (`EditChallengeModal.jsx`):** Update challenge category tags.
- **Persistent Tag Registry:** Custom categories persist in `localStorage` (`daily_task_custom_categories`) and appear in filter dropdowns automatically.

---

### 7. Individual Item Editing Across All Modules
- **Individual Task Editing (`EditTaskModal.jsx`):** Modify task description, category, priority, date, and estimated duration.
- **Individual Challenge Editing (`EditChallengeModal.jsx`):** Update challenge title, description, and category.
- **Individual Day Reflection Check-In (`CheckInModal.jsx`):** Log daily check-in status (Completed, Skipped/Rest, Pending) and append personal accomplishment reflections.
- **Individual User Profile Editing (`UserProfile.jsx`):** Update full name, username handle, password, academic concentration, and add or delete skill tags.

---

### 8. Comprehensive Data Cleaning and Factory Reset Center
- **Selective and Global Cleaning (`SettingsModal.jsx` & `DataCleanModal.jsx`):**
  - **Clean Completed Tasks Only:** Removes finished tasks while preserving active pending tasks and challenges.
  - **Clean All Habit Challenges:** Wipes all habit challenge goals.
  - **Restore Standard Sample Data:** Re-seeds realistic demonstration tasks, challenges, and multi-month heatmap records.
  - **Full Factory Reset:** Complete database wipe protected by a double-confirmation safety barrier.

---

### 9. Dual-Persistence Architecture (MongoDB and LocalStorage)
- **Zero-Latency Offline-First Operation:** All client state updates, task completions, and profile edits persist immediately to browser `localStorage`.
- **Database Synchronization:** An Express REST API with Mongoose handles bi-directional data persistence with MongoDB (`mongodb://localhost:27017/daily_task` or remote MongoDB Atlas).
- **Resilient Fallback Mode:** When MongoDB is unreachable, the client operates in LocalStorage mode with an informational status badge (`LocalStorage Active`) and synchronizes automatically upon database reconnection.
- **Manual and Periodic Synchronization:** Automatic background sync combined with a manual `Sync Now` button.

---

### 10. Remote Public Access via Cloudflare Tunnel
- **Global Network Access:** Integrated Cloudflare Tunnel (`cloudflared`) enables secure public HTTPS access from any smartphone, laptop, or remote network without port forwarding or DNS configuration.
- **Single-Port Architecture:** Express server hosts both the compiled React frontend (`client/dist`) and REST API (`/api/*`) on port 5001, providing clean remote access via a single tunnel.

---

## Automated Test Suite

DailyTask enforces continuous reliability through 17 automated test suites comprising 85 unit, integration, and stress tests executed via Vitest and React Testing Library:

```bash
$ npm test --prefix client -- --run

 Test Files  17 passed (17)
      Tests  85 passed (85)
   Duration  6.72s
```

Test coverage includes:
- Component rendering and state transitions
- Multi-user storage partitioning and profile isolation
- React Hook ordering and modal lifecycle stability
- Password verification modal boundary and tamper resistance
- High-throughput task manipulation stress tests (50 rapid sequential mutations)
- Fuzzing and injection safety (XSS payloads, SQL/NoSQL injection patterns, Unicode)
- Corrupted storage recovery and graceful degradation

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
│   │   │   ├── CheckInModal.jsx         # Day check-in, reflection notes and daily task manager
│   │   │   ├── PasswordPromptModal.jsx  # Security modal for authorizing past history changes
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
│   │   │   ├── CheckInModal.test.jsx
│   │   │   ├── PasswordPromptModal.test.jsx
│   │   │   ├── UserProfile.test.jsx
│   │   │   ├── LoginModal.test.jsx
│   │   │   ├── LoginView.test.jsx       # Authentication gate test suite
│   │   │   ├── SettingsModal.test.jsx   # Settings modal test suite
│   │   │   ├── TaskManager.test.jsx     # Manual category & history auth test suite
│   │   │   ├── DataCleanModal.test.jsx
│   │   │   ├── ThemeContext.test.jsx
│   │   │   ├── FocusTimer.test.jsx
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
