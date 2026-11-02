# DailyTask Desktop App

[![Platform: macOS](https://img.shields.io/badge/Platform-macOS%20(Apple%20Silicon%20M1%2FM2%2FM3)-black?style=flat-square&logo=apple)](https://github.com/n0vemberain/DailyTaskApp)
[![Platform: Windows](https://img.shields.io/badge/Platform-Windows%20(Ready)-blue?style=flat-square&logo=windows)](https://github.com/n0vemberain/DailyTaskApp)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-Backend%20Embedded-gray?style=flat-square&logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

**DailyTask Desktop** is the native desktop edition of the personal productivity dashboard inspired by the GitHub aesthetic. It embeds an offline-first Express + FileStore backend and a React 18 frontend into a standalone desktop application with zero terminal setup required.

---

## ✨ Features

- **Native macOS Experience:** Beautiful dark mode interface, custom app icon, keyboard shortcuts, standard menu, and native dock integration.
- **Optimized for Apple Silicon:** Built natively for `arm64` (Apple Silicon M1, M2, M3, M4) with instantaneous startup and low memory usage.
- **Self-Contained & Offline-First:** Embeds both the Express API and React client. No internet or external database connection required.
- **Safe Persistent Storage:** User data is safely stored in `~/Library/Application Support/DailyTask/data/store.json` on macOS. Updating or reinstalling the app never wipes your tasks or heatmap!
- **GitHub-Style Heatmap:** Track daily activity with 5 color themes, 1-Year, 6-Month, and 1-Month views.
- **Habit & Challenge System:** Multi-day goal planning and daily task synchronization.
- **Cross-Platform Ready:** Configured to package for macOS (`.dmg`) and Windows (`.exe` NSIS installer).

---

## 🚀 Quick Install on macOS (.dmg)

1. Download or locate `DailyTask-1.0.0-arm64.dmg` in the `release/` folder.
2. Double-click the `.dmg` file to open the installer.
3. Drag **DailyTask** into your **Applications** folder.
4. Launch **DailyTask** from Launchpad or Spotlight.

> [!NOTE]
> Since this is a self-built app without an Apple Developer paid certificate ($99/year), the first time you open it macOS Gatekeeper might ask for confirmation.
> Simply **Right-Click** (or Control-Click) the app icon in Applications and click **Open**, or run:
> ```bash
> xattr -cr /Applications/DailyTask.app
> ```

---

## 🛠️ Development & Building

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
git clone https://github.com/n0vemberain/DailyTaskApp.git
cd DailyTaskApp
npm run install:all
```

### Run Locally (Dev Mode)
```bash
npm run dev
```

### Build Installers

- **Build macOS DMG (Apple Silicon M1/M2/M3):**
  ```bash
  npm run dist:mac
  ```
  Output: `release/DailyTask-1.0.0-arm64.dmg`

- **Build macOS Universal (Intel + Apple Silicon):**
  ```bash
  npm run dist:mac:universal
  ```

- **Build Windows NSIS Installer:**
  ```bash
  npm run dist:win
  ```
  Output: `release/DailyTask Setup 1.0.0.exe`

---

## 📁 Project Structure

```
DailyTaskApp/
├── client/              # React 18 + Vite frontend
├── server/              # Express.js backend & FileStore persistence
├── electron/            # Electron main process, preload, and macOS icons
│   ├── main.cjs         # App window lifecycle & server runner
│   ├── preload.cjs      # Context isolation script
│   └── assets/          # icon.png, icon.icns
├── scripts/             # Utility scripts
└── release/             # Built .dmg and .app binaries
```

---

## 👤 Author & License

- **Author:** Fatin Ishraque ([@n0vemberain](https://github.com/n0vemberain))
- **License:** MIT
