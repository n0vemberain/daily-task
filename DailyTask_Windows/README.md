# Daily Task Windows Desktop App

[![Platform: Windows](https://img.shields.io/badge/Platform-Windows%20(x64%20Installer)-0078D6?style=for-the-badge&logo=windows)](https://github.com/n0vemberain/daily-task/releases/download/v1.0.2/Daily.Task.Setup.1.0.2.exe)
[![Windows Setup](https://img.shields.io/badge/Download-Daily%20Task%20Setup%201.0.2.exe-success?style=for-the-badge&logo=windows)](https://github.com/n0vemberain/daily-task/releases/download/v1.0.2/Daily.Task.Setup.1.0.2.exe)
[![Electron](https://img.shields.io/badge/Electron-45-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-Backend%20Embedded-gray?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

Daily Task for Windows is the standalone native Windows desktop application for the personal productivity and daily activity dashboard. Inspired by the GitHub aesthetic, it bundles an embedded Express backend, local FileStore database, and a high-performance React 18 interface into a standard Windows installer (`.exe`) with desktop and Start Menu shortcuts.

---

## Download and Installation (Windows)

| Platform | Installer Format | Architecture | Version | Installer Binary | Download Link |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Windows 10 / 11 (Latest) | NSIS Setup (`.exe`) | x64 (64-bit) | v1.0.2 | `Daily Task Setup 1.0.2.exe` | [Direct Download (.exe)](https://github.com/n0vemberain/daily-task/releases/download/v1.0.2/Daily.Task.Setup.1.0.2.exe) |
| Windows 10 / 11 (Previous) | NSIS Setup (`.exe`) | x64 (64-bit) | v0.0.1 | `Daily Task Setup 0.0.1.exe` | [Direct Download (.exe)](https://github.com/n0vemberain/daily-task/releases/download/v1.0.2/Daily.Task.Setup.0.0.1.exe) |

Local binary location in repository:
- Latest: `DailyTask_Windows/release/Daily Task Setup 1.0.2.exe`
- Previous: `DailyTask_Windows/release/Daily Task Setup 0.0.1.exe`

### Windows Installation Steps
1. Download `Daily Task Setup 1.0.2.exe` (or `Daily Task Setup 0.0.1.exe`).
2. Double-click the `.exe` installer.
3. Follow the setup wizard (choose a custom installation directory or use the default `%LOCALAPPDATA%\Programs\Daily Task`).
4. Keep the checkbox checked to create a Desktop Shortcut and Start Menu Shortcut.
5. Click Finish — Daily Task launches immediately.

> [!NOTE]
> **Windows Defender SmartScreen Notice:**  
> Because this executable is independently created without an expensive corporate Microsoft EV certificate, Windows SmartScreen may show an informational prompt: "Windows protected your PC".  
> **To proceed:** Click **More info** and then click **Run anyway**. The application is completely open-source, safe, self-contained, and offline-first.

---

## Key Features and Capabilities

### 1. GitHub-Inspired Contribution Heatmap
- **Activity Visualization:** Visualizes daily task completions, streaks, and focus sessions on an interactive grid.
- **Multiple Time Horizons:** Seamlessly toggle between 1-Year, 6-Month, and 1-Month timelines.
- **5 Custom Color Themes:** Emerald Olive, Oceanic Blue, Royal Purple, Sunset Orange, and Monochrome Dark.
- **Cell Tooltips and Drill-Down:** Hover or click any cell to inspect exact tasks and check-ins completed on that specific day.

### 2. Multi-Day Habit and Goal Challenges
- **Flexible Duration:** Create 7-day, 14-day, 21-day, 30-day, or custom-length habit challenges.
- **Daily Check-Ins:** Visual progress circles, streak calculation, and automated rollover to next days.
- **Status Filtering:** Quickly filter between All, Active, Completed, or Failed challenges with smooth transitions.

### 3. Daily Task Management
- **Smart Filtering:** View tasks by Today, Pending, Completed, or high/medium/low priority tags.
- **Custom Tags and Deadlines:** Assign color-coded category tags and track overdue versus upcoming tasks.
- **Audio Feedback:** Synthesized completion chimes on task check-off (configurable in Settings).

### 4. Offline-First Local Data Storage
- **Automatic Persistence:** All tasks, habits, and user profiles are stored in `%APPDATA%\daily-task-app\data\store.json`.
- **Zero Cloud Dependence:** Works completely offline without an active internet connection.
- **Update Safety:** Reinstalling or updating the app retains all existing tasks and historical heatmap data.

### 5. Multi-User Isolation and Security
- **Admin and Guest Accounts:** Switch between administrator and isolated guest accounts.
- **Credential Protection:** Password protection for personal dashboard access and historical edits.
- **Backup and Export:** One-click JSON backup export and data restoration directly inside Settings.

### 6. Optional Remote Access via Cloudflare Tunnel
- Built-in secure remote tunneling allows accessing your desktop dashboard from a smartphone or tablet anywhere via HTTPS without opening router ports.

---

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Desktop Shell** | Electron 45 (Chromium + Node.js) |
| **Frontend UI** | React 18, Vite 5, Tailwind CSS 3, Lucide Icons |
| **Local API Engine** | Express 4.21, FileStore JSON, MongoDB / Mongoose adapter |
| **Packaging & Installer** | electron-builder, NSIS 3 (Nullsoft Scriptable Install System) |
| **Supported Operating Systems** | Windows 10 and Windows 11 (64-bit x64) |

---

## Developer Setup (Building from Source)

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone Repository and Install Dependencies
```bash
git clone https://github.com/n0vemberain/daily-task.git
cd daily-task/DailyTask_Windows
npm run install:all
```

### 2. Run in Development Mode
```bash
# Starts Express server and Vite client concurrently
npm run dev

# In another terminal window, start Electron window
npm run electron:start
```

### 3. Build Windows Setup Installer (.exe)
```bash
npm run dist:win
```
The output installer will be generated in `release/Daily Task Setup 0.0.1.exe`.

### 4. Build Portable Windows Version
```bash
npm run dist:win:portable
```

---

## Author and License

- **Developer:** Fatin Ishraque ([@n0vemberain](https://github.com/n0vemberain))
- **Repository:** [https://github.com/n0vemberain/daily-task](https://github.com/n0vemberain/daily-task)
- **License:** MIT License
