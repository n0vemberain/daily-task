# DailyTask

[![Live Web Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github)](https://n0vemberain.github.io/daily-task/)
[![macOS DMG Release](https://img.shields.io/badge/Download-macOS%20(.dmg)%20v1.0.2-success?style=for-the-badge&logo=apple)](https://github.com/n0vemberain/daily-task/releases/download/v1.0.2/Daily.Task-1.0.2-arm64.dmg)
[![Windows Setup Release](https://img.shields.io/badge/Download-Windows%20Setup%20(.exe)%20v0.0.1-0078D6?style=for-the-badge&logo=windows)](https://github.com/n0vemberain/daily-task/releases/download/v1.0.2/Daily.Task.Setup.0.0.1.exe)
[![CI/CD Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![Test Suite](https://img.shields.io/badge/tests-118%2F118%20passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![Electron](https://img.shields.io/badge/Electron-45%20Desktop-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-gray?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

DailyTask is a personal productivity platform inspired by the GitHub aesthetic. It unites daily task management, multi-day habit challenges, and an interactive contribution heatmap into an offline-first desktop (Windows and macOS) and web experience with dual-persistence storage and remote access support.

---

## Live Web Application (GitHub Pages)

Experience Daily Task directly in your browser without any manual installation:
**[Launch Daily Task Live Web App](https://n0vemberain.github.io/daily-task/)**

- **Live Deployment URL:** [https://n0vemberain.github.io/daily-task/](https://n0vemberain.github.io/daily-task/)
- **Built-in Credentials:**
  - **Username:** `n0vemberain`
  - **Password:** `Password123!`
- **Reset All Data:** Settings -> Data Management -> Clean Center -> Clear All Data -> Password (`Password123!`)
- **Hosting:** GitHub Pages with automated continuous deployment via GitHub Actions.
- **Offline-First Mode:** Fully functional standalone in the browser with local persistence, sound feedback, and GitHub dark theme.

---

## Desktop Downloads and Releases

| Operating System | Package Type | Architecture | Version | Binary File | Direct Download Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Windows** | NSIS Installer (`.exe`) | x64 (64-bit) | v0.0.1 | `Daily Task Setup 0.0.1.exe` | [Direct Download (.exe)](https://github.com/n0vemberain/daily-task/releases/download/v1.0.2/Daily.Task.Setup.0.0.1.exe) |
| **macOS** | Disk Image (`.dmg`) | Apple Silicon (`arm64`) | v1.0.2 | `Daily Task-1.0.2-arm64.dmg` | [Direct Download (.dmg)](https://github.com/n0vemberain/daily-task/releases/download/v1.0.2/Daily.Task-1.0.2-arm64.dmg) |

Local binary locations in repository:
- Windows installer: `DailyTask_Windows/release/Daily Task Setup 0.0.1.exe`
- macOS disk image: `DailyTask_MacOS/release/Daily Task-1.0.2-arm64.dmg`

---

## Installation Instructions

### Windows Installation Steps
1. Download `Daily Task Setup 0.0.1.exe`.
2. Double-click the `.exe` file to open the setup wizard.
3. Choose the target destination folder or keep the default.
4. Select Desktop and Start Menu shortcuts, then click **Install**.
5. Launch **Daily Task** from your Desktop or Start Menu.

> [!NOTE]
> **Windows Defender SmartScreen Notice:**  
> Since this app is independently compiled without a commercial Microsoft EV certificate, Windows SmartScreen may show an informational notice ("Windows protected your PC").  
> Click **More info** and then click **Run anyway**. The app is completely offline, open-source, and self-contained.

### macOS Installation Steps
1. Download `Daily Task-1.0.2-arm64.dmg`.
2. Double-click the `.dmg` file to open the installer window.
3. Drag **Daily Task** into your **Applications** folder.
4. Launch **Daily Task** from Launchpad or Spotlight.

> [!NOTE]
> **macOS Gatekeeper Notice:**  
> On first launch, right-click (or Control-click) `Daily Task.app` in your Applications folder and select **Open**, or run this one-time command in Terminal:
> ```bash
> xattr -cr "/Applications/Daily Task.app"
> ```

---

## Screenshots and UI Preview

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

## Key Features

- **GitHub-Inspired Activity Heatmap:** Visualizes daily productivity with 1-Year, 6-Month, and 1-Month views across 5 color themes (Emerald Olive, Oceanic Blue, Royal Purple, Sunset Orange, and Monochrome Dark).
- **Multi-Day Goal Challenges:** Structured habit tracking (7, 14, 21, and 30 days) with day-by-day task planning that syncs directly with your daily task list.
- **Task Management and Priorities:** Flexible task CRUD operations with priority levels (High, Medium, Low), duration estimates, custom categories, and status filters (Today, Pending, Completed).
- **Protected History Mode:** Password authorization required to modify, mark, or delete tasks and check-ins from past dates to prevent accidental tampering.
- **Multi-User Isolation and Security:** Administrator panel with isolated guest accounts, credential management, and session control.
- **Offline-First Persistence:** Instant local updates with background sync to an embedded Express FileStore. Safe persistent storage locations prevent data loss on app reinstallation or updates.
- **Consolidated Settings:** Unified control center for themes, audio feedback chimes, data backup and JSON export, clean center, and account security.
- **Remote Access via Cloudflare Tunnel:** Built-in secure HTTPS remote access for mobile devices without opening router ports or exposing local network addresses.

---

## Execution and Build Options

### Option 1: Windows Desktop App (.exe Installer)
Use the pre-built installer in `DailyTask_Windows/release/Daily Task Setup 0.0.1.exe` or build from source:
```bash
cd DailyTask_Windows
npm install
npm run dist:win
```

### Option 2: Native macOS Desktop App (.dmg)
Use the pre-built `.dmg` in `DailyTask_MacOS/release/Daily Task-1.0.2-arm64.dmg` or build from source:
```bash
cd DailyTask_MacOS
npm install
npm run dist:mac
```

### Option 3: Local Web Server (Full-Stack Dev Mode)
To run or develop the full-stack web version:

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

4. **Production Build and Start:**
   ```bash
   npm run build
   npm start
   ```

### Option 4: Remote Access via Cloudflare Tunnel
To access your dashboard from your smartphone or tablet securely over HTTPS:
```bash
cd DailyTask_CodeBase
npm run tunnel
```

### Option 5: Run Automated Tests
Execute the unit, integration, and stress test suites:
```bash
cd DailyTask_CodeBase/client && npm test -- --run
```
*(All 21 test suites, 118 unit and integration tests passing)*

---

## Repository Structure

```
DailyTask/
├── DailyTask_CodeBase/      # Full-stack web application (React 18 + Express 4)
│   ├── client/              # React 18 frontend (Vite, Tailwind CSS, Lucide)
│   ├── server/              # Express backend with FileStore and MongoDB
│   ├── images/              # Application screenshots and UI showcases (01.png - 18.png)
│   ├── scripts/             # Cloudflare Tunnel runner and automation
│   └── package.json         # Workspace scripts
│
├── DailyTask_MacOS/         # Standalone desktop application for macOS (Electron DMG)
│   ├── electron/            # Main process, preload, and retina icon.icns
│   ├── client/              # React desktop view bundle
│   ├── server/              # Embedded backend runner
│   ├── release/             # Built macOS .dmg and .zip binaries
│   └── package.json         # Electron packaging configuration
│
├── DailyTask_Windows/       # Standalone desktop application for Windows (Electron NSIS .exe)
│   ├── electron/            # Main process, preload, and Windows icon.ico
│   ├── client/              # React desktop view bundle
│   ├── server/              # Embedded backend runner
│   ├── release/             # Built Windows Setup .exe installer (v0.0.1)
│   └── package.json         # Windows Electron and NSIS configuration
│
└── README.md                # Project documentation and download portal
```

---

## Author and License

- **Author:** Fatin Ishraque ([@n0vemberain](https://github.com/n0vemberain))
- **Repository:** [https://github.com/n0vemberain/daily-task](https://github.com/n0vemberain/daily-task)
- **License:** MIT License
