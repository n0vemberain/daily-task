# DailyTask

[![CI/CD Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![Test Suite](https://img.shields.io/badge/tests-91%2F91%20passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.18-gray?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Active-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

DailyTask is a personal productivity platform inspired by the GitHub aesthetic. It combines daily task management, multi-day habit challenges, and an activity heatmap into an offline-first, multi-user web application with remote access support.

---

## Key Features

- **Activity Heatmap:** Visualizes daily productivity with 1-Year, 6-Month, and 1-Month mobile views across 5 color themes.
- **Goal Challenges:** Structured multi-day habit tracking with day-by-day task planning that syncs with your daily task list.
- **Task Management:** Flexible task CRUD with priorities, duration estimates, filters, and custom categories.
- **Protected History:** Password authorization required to modify, mark, or delete tasks and check-ins from previous dates.
- **Multi-User Isolation:** Administrator panel with isolated guest accounts, credential management, and session control.
- **Offline-First Persistence:** Instant local updates via `localStorage` with background sync to Express FileStore and MongoDB.
- **Consolidated Settings:** Unified control center for themes, audio feedback, data backup/restore, clean center, and account security.
- **Remote Access:** Built-in Cloudflare Tunnel support for secure HTTPS access from mobile devices without port forwarding.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express 4, FileStore JSON, MongoDB / Mongoose |
| **Testing** | Vitest, React Testing Library (18 test suites, 91 tests passing) |
| **Networking** | Cloudflare Tunnel (`cloudflared`) |

---

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- (Optional) MongoDB local or MongoDB Atlas

### 1. Installation
```bash
git clone https://github.com/n0vemberain/daily-task.git
cd daily-task
npm run install:all
```

### 2. Run Locally
```bash
npm run dev
```
- Client: `http://localhost:5173`
- Server API: `http://localhost:5001`

### 3. Remote Access (Optional)
Run locally and expose securely over the internet via Cloudflare Tunnel:
```bash
npm run tunnel
```

### 4. Run Tests
```bash
cd client && npm test -- --run
```

---

## Author & License

- **Author:** Fatin Ishraque ([@n0vemberain](https://github.com/n0vemberain))
- **License:** MIT
