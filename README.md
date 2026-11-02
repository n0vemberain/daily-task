# DailyTask

[![macOS DMG Release](https://img.shields.io/badge/Download-macOS%20(.dmg)%20v1.0.0-success?style=for-the-badge&logo=apple)](https://github.com/n0vemberain/daily-task/releases/latest)
[![CI/CD Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![Test Suite](https://img.shields.io/badge/tests-91%2F91%20passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![Electron](https://img.shields.io/badge/Electron-macOS%20Desktop-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-gray?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

DailyTask is a personal productivity platform inspired by the GitHub aesthetic. It unites daily task management, multi-day habit challenges, and a contribution heatmap into an offline-first desktop and web experience with dual-persistence storage and remote access support.

---

## 📥 Download Desktop App (macOS)

You can run DailyTask as a native Mac app without opening any terminal or installing Node.js:

[![Download for macOS](https://img.shields.io/badge/Download%20for%20macOS-Apple%20Silicon%20(M1%2FM2%2FM3%2FM4)-black?style=for-the-badge&logo=apple)](https://github.com/n0vemberain/daily-task/releases/latest)

> **Direct Release Link:** [Download DailyTask-1.0.0-arm64.dmg](https://github.com/n0vemberain/daily-task/releases/latest)  
> *(Local binary also located at: `DailyTask_MacOS/release/DailyTask-1.0.0-arm64.dmg`)*

### macOS Installation Steps:
1. Download **`DailyTask-1.0.0-arm64.dmg`**.
2. Double-click the `.dmg` file to open the installer window.
3. Drag **DailyTask** into your **Applications** folder.
4. Launch **DailyTask** from Launchpad or Spotlight.

> [!NOTE]
> **First-Time macOS Gatekeeper Notice:**  
> Since this application is self-built without an Apple Developer paid certificate (\$99/year), macOS may display an "unidentified developer" prompt on first launch.  
> Simply **Right-Click** (or Control-Click) `DailyTask.app` in your Applications folder and select **Open**, or run this one-time command in Terminal:
> ```bash
> xattr -cr /Applications/DailyTask.app
> ```

---

## 📸 Screenshots & UI Preview

| | |
| :---: | :---: |
| ![](DailyTask_CodeBase/images/01.png) | ![](DailyTask_CodeBase/images/02.png) |
| ![](DailyTask_CodeBase/images/03.png) | ![](DailyTask_CodeBase/images/04.png) |
| ![](DailyTask_CodeBase/images/05.png) | ![](DailyTask_CodeBase/images/06.png) |
| ![](DailyTask_CodeBase/images/07.png) | ![](DailyTask_CodeBase/images/08.png) |
| ![](DailyTask_CodeBase/images/09.png) | ![](DailyTask_CodeBase/images/10.png) |
| ![](DailyTask_CodeBase/images/11.png) | ![](DailyTask_CodeBase/images/12.png) |
| ![](DailyTask_CodeBase/images/13.png) | ![](DailyTask_CodeBase/images/14.png) |
| ![](DailyTask_CodeBase/images/15.png) | ![](DailyTask_CodeBase/images/16.png) |
| ![](DailyTask_CodeBase/images/17.png) | ![](DailyTask_CodeBase/images/18.png) |

---

## 🌟 Key Features

- **Activity Heatmap:** Visualizes daily productivity with 1-Year, 6-Month, and 1-Month views across 5 color themes (Olive, Blue, Purple, Orange, Dark).
- **Goal Challenges:** Structured multi-day habit tracking with day-by-day task planning that syncs with your daily task list.
- **Task Management:** Flexible task CRUD with priorities, duration estimates, filters, and custom categories.
- **Protected History:** Password authorization required to modify, mark, or delete tasks and check-ins from previous dates.
- **Multi-User Isolation:** Administrator panel with isolated guest accounts, credential management, and session control.
- **Offline-First Persistence:** Instant local updates via `localStorage` with background sync to Express FileStore and MongoDB.
- **Consolidated Settings:** Unified control center for themes, audio feedback, data backup/restore, clean center, and account security.
- **Remote Access:** Built-in Cloudflare Tunnel support for secure HTTPS access from mobile devices without port forwarding.

---

## 🚀 Execution Options

### Option 1: Native macOS Desktop App
Use the pre-built `.dmg` in `DailyTask_MacOS/release/DailyTask-1.0.0-arm64.dmg` or build it from source:
```bash
cd DailyTask_MacOS
npm install
npm run dist:mac
```
The app embeds the Express backend, automatically sets up persistent storage at `~/Library/Application Support/DailyTask/data/store.json`, and runs completely offline.

---

### Option 2: Local Web Server (Full-Stack Dev Mode)
If you want to run or develop the web version:

1. **Navigate to codebase:**
   ```bash
   cd DailyTask_CodeBase
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   - Frontend UI: `http://localhost:5173`
   - Express API: `http://localhost:5001`

4. **Production Build & Start:**
   ```bash
   npm run build
   npm start
   ```

---

### Option 3: Remote Access via Cloudflare Tunnel
To access your dashboard from your smartphone or outside network securely over HTTPS:
```bash
cd DailyTask_CodeBase
npm run tunnel
```
This builds the client, starts the local server, spins up `cloudflared`, and generates a secure public HTTPS URL and in-app QR code.

---

### Option 4: Run Automated Tests
Execute the unit, integration, and stress test suites:
```bash
cd DailyTask_CodeBase/client && npm test -- --run
```
*(All 17 test suites, 85 unit/integration tests passing)*

---

## 📁 Repository Structure

```
DailyTask/
├── DailyTask_CodeBase/      # Full-stack web application (React 18 + Express 4)
│   ├── client/              # React 18 frontend (Vite, Tailwind CSS, Lucide)
│   ├── server/              # Express backend with FileStore & MongoDB
│   ├── images/              # Application screenshots & UI showcases (01.png - 18.png)
│   ├── scripts/             # Cloudflare Tunnel runner & automation
│   ├── TESTING_REPORT.md    # Detailed stress and reliability report
│   └── package.json         # Workspace scripts
│
├── DailyTask_MacOS/         # Standalone desktop application (Electron + macOS)
│   ├── electron/            # Main process, preload, and custom retina .icns icon
│   ├── client/              # React desktop view bundle
│   ├── server/              # Embedded backend runner
│   ├── release/             # Built macOS .dmg and .app binaries
│   └── package.json         # Electron packaging configuration
│
└── README.md                # Project documentation & download portal
```

---

## 👤 Author & License

- **Author:** Fatin Ishraque ([@n0vemberain](https://github.com/n0vemberain))
- **Repository:** [https://github.com/n0vemberain/daily-task](https://github.com/n0vemberain/daily-task)
- **License:** MIT
