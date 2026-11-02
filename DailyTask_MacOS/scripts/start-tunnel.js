import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const binDir = path.join(rootDir, 'bin');
const cloudflaredPath = path.join(binDir, 'cloudflared');

const PORT = process.env.PORT || 5001;

console.log('[DailyTask Tunnel] Initializing Cloudflare Tunnel service...');

// 1. Verify cloudflared binary
if (!fs.existsSync(cloudflaredPath)) {
  console.error(`[DailyTask Tunnel] Error: cloudflared binary not found at ${cloudflaredPath}`);
  process.exit(1);
}

// 2. Start the Node.js Express server
console.log(`[DailyTask Tunnel] Starting application server on port ${PORT}...`);
const serverProc = spawn('node', ['server/server.js'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: { ...process.env, PORT: String(PORT) }
});

// Helper: poll health endpoint until ready
const waitForServer = () => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      http.get(`http://localhost:${PORT}/api/health`, (res) => {
        if (res.statusCode === 200) {
          clearInterval(interval);
          resolve();
        }
      }).on('error', () => {});
    }, 400);
  });
};

waitForServer().then(() => {
  console.log(`[DailyTask Tunnel] Application server is healthy at http://localhost:${PORT}`);
  console.log('[DailyTask Tunnel] Establishing Cloudflare Tunnel to the internet...');

  const tunnelProc = spawn(cloudflaredPath, ['tunnel', '--url', `http://localhost:${PORT}`], {
    cwd: rootDir
  });

  let tunnelUrlFound = false;

  const handleOutput = (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && !tunnelUrlFound) {
      tunnelUrlFound = true;
      const url = match[0];
      fs.writeFileSync(path.join(rootDir, 'tunnel-url.txt'), url);

      console.log('\n============================================================');
      console.log('   DAILYTASK CLOUDFLARE PUBLIC TUNNEL ACTIVE');
      console.log('============================================================');
      console.log(`  Local Access:   http://localhost:${PORT}`);
      console.log(`  Public Access:  ${url}`);
      console.log('  Share this public HTTPS link to access from any phone,');
      console.log('  tablet, or computer on any internet connection.');
      console.log('============================================================\n');
    }
  };

  tunnelProc.stdout.on('data', handleOutput);
  tunnelProc.stderr.on('data', handleOutput);

  process.on('SIGINT', () => {
    tunnelProc.kill();
    serverProc.kill();
    process.exit();
  });

  process.on('SIGTERM', () => {
    tunnelProc.kill();
    serverProc.kill();
    process.exit();
  });
});
