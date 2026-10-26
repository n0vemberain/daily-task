# DailyTask — Personal Daily Activity Dashboard and Goal Matrix

A web-based personal daily activity dashboard developed with React 18, Vite, Tailwind CSS, and Node.js/Express with MongoDB. Engineered with an authentic GitHub dark aesthetic and olive green contribution shades, this system provides visual productivity analytics, custom-duration habit challenge tracking, and academic profile management.

---

## Key Features

### 1. GitHub Contribution-Style Heatmap (Multi-Timeframe and Theme Options)
- **Selectable Timeframes (1 Year, 6 Months, 1 Month):**
  - **1 Year (52 Weeks):** Comprehensive annual activity matrix showing all 365 days.
  - **6 Months (26 Weeks):** Mid-term view highlighting recent consistency and momentum.
  - **1 Month (5 Weeks):** Dedicated responsive mobile-optimized monthly calendar with enlarged touch-friendly squares and day-of-month indicators that fit any phone screen without horizontal scrolling.
- **5 Selectable Color Themes:**
  - **Olive Green (Default):** GitHub dark slate with dark to vibrant olive green shades (#161b22, #263b19, #3d5c24, #5a8533, #7eb644).
  - **Emerald Mint:** Deep forest to vivid emerald green (#161b22, #0e4429, #006d32, #26a641, #39d353).
  - **Ocean Cyan:** Deep marine to neon cyber cyan (#161b22, #0b3c49, #0e6075, #189cb5, #38d8f5).
  - **Sunset Amber:** Dark espresso to golden sunrise amber (#161b22, #452607, #783c07, #b86209, #f59e0b).
  - **Amethyst Purple:** Obsidian to bright lavender purple (#161b22, #341948, #58207c, #8736bf, #b366f5).
- **Interactive Tooltips:** Dynamic cursor-following tooltips display exact calendar dates, total tasks completed, and individual task titles.
- **Mobile Tap Drawer:** On touch devices, tapping any cell opens a dedicated date inspection card with a one-tap action to filter and manage tasks for that day.
- **Filter by Date:** Clicking a day cell immediately filters the daily task manager to show tasks scheduled or completed on that date.
- **Productivity Streaks:** Real-time calculation of Current Streak, Longest Streak (All-Time Record), Total Active Days, and Total Completed Tasks.

---

### 2. Challenge-Based Goal Tracker (Custom Duration and Visual Day Grid)
- **Custom Duration Support:** Configure habit challenges of arbitrary length:
  - Preset options: 7 Days, 14 Days, 21 Days, 30 Days, 50 Days, 75 Hard, 100 Days.
  - Custom duration input for custom targets (e.g., 45 days, 90 days).
- **Day-by-Day Interactive Grid:** Every day of the challenge is rendered as a distinct status square:
  - **Completed (Olive Green Checkmark):** Verified completion with timestamp.
  - **Skipped / Rest (Amber Indicator):** Scheduled rest day or missed milestone.
  - **Today (Pulsing Outline):** Highlights the active target day.
  - **Upcoming (Subtle Slate):** Future milestone days.
- **Daily Reflection and Check-In Modal:** Log daily reflections, accomplishments, or notes for each day.
- **Milestone Celebration:** Visual particle effects and synthesized audio chimes upon milestone completion.

---

### 3. User Profile and Academic Skills Management
- **Profile Photo Upload:** Image upload with base64 data URL conversion and immediate preview (supports files up to 5MB).
- **Account Credentials:** Full name, GitHub username (@n0vemberain), and password field with visibility toggle.
- **Field of Study:** Academic concentration (e.g., Computer Science and Engineering).
- **Extra Skills Manager:** Interactive skill chips with deletion support and one-click suggestions (React, Node.js, MongoDB, TypeScript, Docker, Tailwind CSS, Python, System Design).

---

### 4. Dual-Persistence Architecture (MongoDB and LocalStorage)
- **Zero-Latency Offline-First Operation:** All client state updates, task completions, and profile edits persist immediately to browser `localStorage`.
- **Database Synchronization:** An Express REST API with Mongoose handles bi-directional data persistence with MongoDB (`mongodb://localhost:27017/daily_task` or remote MongoDB Atlas).
- **Resilient Fallback Mode:** When MongoDB is unreachable, the client operates in LocalStorage mode with an informational status badge (`LocalStorage Active (MongoDB Offline)`) and synchronizes automatically upon database connection.
- **Manual and Periodic Synchronization:** Automatic background sync combined with a manual `Sync Data` button.

---

### 5. Audio Haptic Feedback and Data Portability
- **Synthesized Audio Tones:** Web Audio API sound generator providing subtle ascending harmonic chords upon task or challenge completion (includes navbar mute/unmute control).
- **JSON Data Backup and Restore:** One-click data export to formatted JSON (`daily-task-backup-[date].json`) and full JSON backup restoration.

---

### 6. Remote Public Access via Cloudflare Tunnel
- **Global Network Access:** Integrated Cloudflare Tunnel (`cloudflared`) enables secure public HTTPS access from any smartphone, laptop, or remote network without port forwarding or DNS configuration.
- **Zero-Configuration Tunneling:** Single-command execution exposes both the frontend application and backend API over Cloudflare edge infrastructure.

---

## Device and Cross-Browser Compatibility

### Mobile Responsiveness (375px to 430px)
- **Sticky Bottom Navigation:** Fixed thumb-friendly navigation bar (`MobileBottomNav.jsx`) on viewports under 768px with an elevated quick-add button.
- **iOS Safe Area Support:** Uses `env(safe-area-inset-bottom)` to ensure interface elements do not overlap device home indicators.
- **Touch-Friendly Heatmap:** Optimized with smooth inertia scrolling and horizontal swipe cues.
- **Touch Targets:** Interactive controls maintain minimum dimensions of 44x44px.

### Desktop Optimization (1024px to 4K Displays)
- **Full 52-Week Visualization:** Displays complete annual contribution grid without layout breakage.
- **Hardware-Accelerated Hover:** Smooth micro-scaling on heatmap cells with high-contrast outlines.
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

Test Files  4 passed (4)
     Tests  14 passed (14)
  Duration  3.56s
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
│   │   │   ├── Navbar.jsx               # Header, tab navigation, sound and backup controls
│   │   │   ├── ContributionHeatmap.jsx  # Dark and olive green contribution heatmap
│   │   │   ├── StatsOverview.jsx        # Streaks and productivity summary cards
│   │   │   ├── ChallengeTracker.jsx     # Challenge grid and daily check-ins
│   │   │   ├── ChallengeModal.jsx       # Modal for creating custom challenges
│   │   │   ├── CheckInModal.jsx         # Modal for day check-in and reflection notes
│   │   │   ├── TaskManager.jsx          # Task CRUD, search and category filters
│   │   │   ├── UserProfile.jsx          # Profile photo, password, study field, skills
│   │   │   ├── SyncStatusBadge.jsx      # MongoDB and LocalStorage sync status indicator
│   │   │   ├── BackupModal.jsx          # JSON data export and import modal
│   │   │   ├── MobileBottomNav.jsx      # Mobile sticky bottom navigation
│   │   │   └── GithubIcon.jsx           # SVG GitHub icon
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
│   │   │   └── setup.js
│   │   ├── data/
│   │   │   └── initialData.js           # Seed data for immediate preview
│   │   ├── App.jsx                      # Root application controller and sync pipeline
│   │   ├── main.jsx                     # Vite React entrypoint
│   │   └── index.css                    # Tailwind CSS directives and cross-browser styling
│   ├── tailwind.config.js               # Olive green and GitHub dark color definitions
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
| `PUT` | `/api/tasks/:id` | Updates task title, status, or date |
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
