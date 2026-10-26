import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import syncRoutes from './routes/syncRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/daily_task';

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));

let isMongoConnected = false;

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    isMongoConnected = true;
    console.log(`🚀 MongoDB Connected successfully at ${MONGODB_URI}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB connection warning: ${err.message}`);
    console.info('💡 Server will run in Dual-Persistence mode: client will retain all data in localStorage and retry MongoDB connection.');
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

// Middleware to inject Mongo connection status check
const checkMongoConnection = (req, res, next) => {
  if (!isMongoConnected) {
    return res.status(503).json({
      success: false,
      isMongoConnected: false,
      message: 'MongoDB is currently offline or connecting. Client using localStorage persistence mode.',
    });
  }
  next();
};

// Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    isMongoConnected,
    mongoUri: MONGODB_URI,
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/user', checkMongoConnection, userRoutes);
app.use('/api/tasks', checkMongoConnection, taskRoutes);
app.use('/api/challenges', checkMongoConnection, challengeRoutes);
app.use('/api/sync', checkMongoConnection, syncRoutes);

// Catch-all
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.listen(PORT, async () => {
  console.log(`✨ Server running on http://localhost:${PORT}`);
  await connectDB();
});
