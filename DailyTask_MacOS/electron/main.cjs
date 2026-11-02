const { app, BrowserWindow, Menu, shell, utilityProcess } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const net = require('net');
const { fork } = require('child_process');

let mainWindow = null;
let serverProcess = null;
const DEFAULT_PORT = 5001;

// Helper: Check if a TCP port is in use
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port, '127.0.0.1');
  });
}

// Find an available port starting from basePort
async function getAvailablePort(basePort) {
  for (let p = basePort; p < basePort + 50; p++) {
    if (await isPortAvailable(p)) {
      return p;
    }
  }
  return basePort;
}

// Ensure persistent user data directory exists and seed initial store if missing
function setupUserDataDirectory() {
  const userDataDir = app.getPath('userData');
  const dataDir = path.join(userDataDir, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const targetStoreFile = path.join(dataDir, 'store.json');
  if (!fs.existsSync(targetStoreFile)) {
    const defaultStoreFile = path.join(__dirname, '../server/data/store.json');
    if (fs.existsSync(defaultStoreFile)) {
      try {
        fs.copyFileSync(defaultStoreFile, targetStoreFile);
        console.log('[Electron] Initial store.json seeded to user data folder.');
      } catch (err) {
        console.warn('[Electron] Could not seed store.json:', err);
      }
    }
  }

  process.env.DAILY_TASK_DATA_DIR = dataDir;
  return dataDir;
}

// Poll server health endpoint until it responds 200 OK
function waitForServer(port, timeoutMs = 15000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
        if (res.statusCode === 200) {
          return resolve();
        }
        retry();
      });
      req.on('error', retry);
      req.setTimeout(1000, () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - startTime > timeoutMs) {
        return reject(new Error(`Server health check timed out after ${timeoutMs}ms`));
      }
      setTimeout(check, 250);
    };

    check();
  });
}

// Launch Express server
async function startBackendServer(port) {
  const serverPath = path.join(__dirname, '../server/server.js');
  const clientDistPath = path.join(__dirname, '../client/dist');

  process.env.PORT = String(port);
  process.env.CLIENT_DIST_PATH = clientDistPath;

  console.log(`[Electron] Launching backend on port ${port}...`);
  console.log(`[Electron] Server script: ${serverPath}`);

  // Use utilityProcess (Electron 22+) for isolated Node execution
  if (utilityProcess && typeof utilityProcess.fork === 'function') {
    try {
      serverProcess = utilityProcess.fork(serverPath, [], {
        env: {
          ...process.env,
          PORT: String(port),
          CLIENT_DIST_PATH: clientDistPath,
          DAILY_TASK_DATA_DIR: process.env.DAILY_TASK_DATA_DIR
        },
        stdio: 'pipe'
      });

      if (serverProcess.stdout) {
        serverProcess.stdout.on('data', (d) => process.stdout.write(`[Server stdout] ${d}`));
      }
      if (serverProcess.stderr) {
        serverProcess.stderr.on('data', (d) => process.stderr.write(`[Server stderr] ${d}`));
      }
      serverProcess.on('exit', (code) => {
        console.log(`[Electron] Server process exited with code ${code}`);
      });
    } catch (e) {
      console.warn('[Electron] utilityProcess failed, falling back to child_process.fork', e);
      serverProcess = fork(serverPath, [], {
        env: {
          ...process.env,
          PORT: String(port),
          CLIENT_DIST_PATH: clientDistPath,
          DAILY_TASK_DATA_DIR: process.env.DAILY_TASK_DATA_DIR
        }
      });
    }
  } else {
    serverProcess = fork(serverPath, [], {
      env: {
        ...process.env,
        PORT: String(port),
        CLIENT_DIST_PATH: clientDistPath,
        DAILY_TASK_DATA_DIR: process.env.DAILY_TASK_DATA_DIR
      }
    });
  }

  await waitForServer(port);
  console.log(`[Electron] Backend verified active at http://127.0.0.1:${port}`);
}

function createMainWindow(port) {
  const iconPath = path.join(__dirname, 'assets/icon.png');

  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 980,
    minHeight: 650,
    backgroundColor: '#0d1117',
    icon: iconPath,
    title: 'DailyTask - Personal Activity Dashboard',
    show: false, // reveal gracefully when ready
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  const devUrl = process.env.ELECTRON_START_URL;
  const targetUrl = devUrl || `http://127.0.0.1:${port}`;

  console.log(`[Electron] Loading UI from: ${targetUrl}`);
  mainWindow.loadURL(targetUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open external links (e.g. GitHub profile, docs) in default system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupApplicationMenu() {
  const isMac = process.platform === 'darwin';

  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        ]
      : []),
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' }
            ]
          : [{ role: 'close' }])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'GitHub Repository',
          click: async () => {
            await shell.openExternal('https://github.com/n0vemberain/DailyTaskApp');
          }
        },
        {
          label: 'Developer Profile',
          click: async () => {
            await shell.openExternal('https://github.com/n0vemberain');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Application Lifecycle
app.whenReady().then(async () => {
  setupUserDataDirectory();
  setupApplicationMenu();

  const port = await getAvailablePort(DEFAULT_PORT);

  try {
    await startBackendServer(port);
  } catch (err) {
    console.error('[Electron] Failed to start backend server:', err);
  }

  createMainWindow(port);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow(port);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    console.log('[Electron] Terminating backend server process...');
    try {
      if (typeof serverProcess.kill === 'function') {
        serverProcess.kill();
      }
    } catch (e) {
      // Ignore
    }
    serverProcess = null;
  }
});
