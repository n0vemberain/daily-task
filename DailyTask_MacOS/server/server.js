import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = process.env.CLIENT_DIST_PATH || path.join(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/daily_task';

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));
app.use(express.static(clientDistPath));

let isMongoConnected = false;

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB connected successfully at ${MONGODB_URI}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB connection warning: ${err.message}`);
    console.info('[Database] Server will run in Dual-Persistence mode: client will retain all data in localStorage and retry MongoDB connection.');
  }
};

mongoose.connection.on('disconnected', () => {
  isMongoConnected = false;
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  isMongoConnected = true;
  console.log('MongoDB re-connected');
});

// Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    storageEngine: 'Persistent Dual Store (FileStore + MongoDB)',
    isMongoConnected,
    mongoUri: MONGODB_URI,
    timestamp: new Date().toISOString()
  });
});

// Network Access Information (Public Tunnel, LAN IP, and Localhost)
app.get('/api/network-access', (req, res) => {
  try {
    const interfaces = os.networkInterfaces();
    let localIp = '127.0.0.1';
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          localIp = iface.address;
          break;
        }
      }
    }

    let publicUrl = '';
    const tunnelFile = path.join(__dirname, '../tunnel-url.txt');
    if (fs.existsSync(tunnelFile)) {
      publicUrl = fs.readFileSync(tunnelFile, 'utf8').trim();
    }

    const localhostUrl = `http://localhost:${PORT}`;
    const localNetworkUrl = `http://${localIp}:${PORT}`;

    res.json({
      success: true,
      data: {
        publicUrl: publicUrl || localNetworkUrl,
        rawPublicUrl: publicUrl,
        localhostUrl,
        localNetworkUrl,
        isTunnelActive: Boolean(publicUrl)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes - Fully operational with Persistent FileStore & MongoDB auto-fallback
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/sync', syncRoutes);

// SPA fallback for non-API client routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('DailyTask server running. Build client with "npm run build" to serve UI.');
  }
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

export const startServer = (port = PORT) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, async () => {
      console.log(`[Server] Running on http://localhost:${port}`);
      await connectDB();
      if (process.send) {
        process.send({ type: 'server-started', port });
      }
      resolve(server);
    });
    server.on('error', (err) => {
      console.error('[Server] Listen error:', err);
      reject(err);
    });
  });
};

export default app;

// Auto-start when executed directly or as child process
startServer(PORT).catch((err) => {
  console.error('[Server] Failed to start:', err);
});
