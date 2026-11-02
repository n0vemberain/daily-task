# DailyTask

[![macOS DMG Release](https://img.shields.io/badge/Download-macOS%20(.dmg)%20v1.0.2-success?style=for-the-badge&logo=apple)](https://github.com/n0vemberain/daily-task/releases/latest)
[![Windows Setup Release](https://img.shields.io/badge/Download-Windows%20Setup%20(.exe)%20v1.0.2-0078D6?style=for-the-badge&logo=windows)](https://github.com/n0vemberain/daily-task/releases/latest)
[![CI/CD Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![Test Suite](https://img.shields.io/badge/tests-91%2F91%20passing-brightgreen?style=flat-square)](https://github.com/n0vemberain/daily-task)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![Electron](https://img.shields.io/badge/Electron-45%20Desktop-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-gray?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

DailyTask is a personal productivity platform inspired by the GitHub aesthetic. It unites daily task management, multi-day habit challenges, and an interactive contribution heatmap into an offline-first desktop (macOS & Windows) and web experience with dual-persistence storage and remote access support.

---

## 📥 Download Desktop Apps

### 🪟 Windows Desktop App (Setup Installer)

Run DailyTask natively on any Windows 10 or Windows 11 PC without opening any terminal or installing Node.js:

[![Download for Windows](https://img.shields.io/badge/Download%20for%20Windows-Daily%20Task%20Setup%201.0.2%20(.exe)-0078D6?style=for-the-badge&logo=windows)](https://github.com/n0vemberain/daily-task/releases/latest)

> **Direct Release Link:** [Download Daily Task Setup 1.0.2.exe](https://github.com/n0vemberain/daily-task/releases/latest)  
> *(Local binary also located at: `DailyTask_Windows/release/Daily Task Setup 1.0.2.exe`)*

#### Windows Installation Steps:
1. Download **`Daily Task Setup 1.0.2.exe`**.
2. Double-click the `.exe` file to open the setup wizard.
3. Choose your installation location (or accept default).
4. Select Desktop & Start Menu shortcuts, then click **Install**.
5. Launch **Daily Task** from your Desktop or Start Menu.

> [!NOTE]
> **Windows Defender SmartScreen Notice:**  
> Since this app is independently compiled without a paid corporate certificate, Windows SmartScreen may show an informational message (*"Windows protected your PC"*).  
> Click **"More info"** and then **"Run anyway"**. The application is 100% offline, secure, and open-source.

---

### 🍏 macOS Desktop App (.dmg)

Run DailyTask as a native Mac app optimized for Apple Silicon:

[![Download for macOS](https://img.shields.io/badge/Download%20for%20macOS-Apple%20Silicon%20(M1%2FM2%2FM3%2FM4)-black?style=for-the-badge&logo=apple)](https://github.com/n0vemberain/daily-task/releases/latest)

> **Direct Release Link:** [Download Daily Task-1.0.2-arm64.dmg](https://github.com/n0vemberain/daily-task/releases/latest)  
> *(Local binary also located at: `DailyTask_MacOS/release/Daily Task-1.0.2-arm64.dmg`)*

#### macOS Installation Steps:
1. Download **`Daily Task-1.0.2-arm64.dmg`**.
2. Double-click the `.dmg` file to open the installer window.
3. Drag **Daily Task** into your **Applications** folder.
4. Launch **Daily Task** from Launchpad or Spotlight.

> [!NOTE]
> **First-Time macOS Gatekeeper Notice:**  
> Simply **Right-Click** (or Control-Click) `Daily Task.app` in your Applications folder and select **Open**, or run this one-time command in Terminal:
> ```bash
> xattr -cr "/Applications/Daily Task.app"
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

- **GitHub-Inspired Activity Heatmap:** Visualizes daily productivity with 1-Year, 6-Month, and 1-Month views across 5 color themes (Emerald Olive, Oceanic Blue, Royal Purple, Sunset Orange, Monochrome Dark).
- **Multi-Day Goal Challenges:** Structured habit tracking (7, 14, 21, 30 days) with day-by-day task planning that syncs directly with your daily task list.
- **Task Management & Priorities:** Flexible task CRUD with priority levels (High, Medium, Low), duration estimates, custom categories, and status filters (Today, Pending, Completed).
- **Protected History Mode:** Password authorization required to modify, mark, or delete tasks and check-ins from past dates to prevent accidental tampering.
- **Multi-User Isolation & Security:** Administrator panel with isolated guest accounts, password management, and session control.
- **Offline-First Persistence:** Instant local updates with background sync to Express FileStore. Safe persistent storage location prevents data wipe upon app reinstallation.
- **Consolidated Settings:** Unified control center for themes, audio feedback chimes, data backup & export, clean center, and account security.
- **Remote Access via Cloudflare Tunnel:** Built-in secure HTTPS remote access for mobile devices without opening router ports or exposing IP addresses.

---

## 🚀 Execution & Build Options

### Option 1: Windows Desktop App (.exe Installer)
Use the pre-built installer in `DailyTask_Windows/release/Daily Task Setup 1.0.2.exe` or build from source:
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

### Option 4: Remote Access via Cloudflare Tunnel
To access your dashboard from your smartphone securely over HTTPS:
```bash
cd DailyTask_CodeBase
npm run tunnel
```

### Option 5: Run Automated Tests
Execute the unit, integration, and stress test suites:
```bash
cd DailyTask_CodeBase/client && npm test -- --run
```
*(All 18 test suites, 91 unit/integration tests passing)*

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
│   ├── release/             # Built Windows Setup .exe installer
│   └── package.json         # Windows Electron & NSIS configuration
│
└── README.md                # Project documentation & download portal
```

---

## 👤 Author & License

- **Author:** Fatin Ishraque ([@n0vemberain](https://github.com/n0vemberain))
- **Repository:** [https://github.com/n0vemberain/daily-task](https://github.com/n0vemberain/daily-task)
- **License:** MIT
