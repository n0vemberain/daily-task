import express from 'express';
import mongoose from 'mongoose';
import { fileStore } from '../storage/fileStore.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Challenge from '../models/Challenge.js';

const router = express.Router();

// GET /api/sync - Fetch full server state (with Multi-User Isolation & Session Validation)
router.get('/', async (req, res) => {
  try {
    const username = req.query.username ? req.query.username.trim().toLowerCase() : null;
    const sessionVersion = req.query.sessionVersion ? parseInt(req.query.sessionVersion, 10) : null;

    if (username) {
      const dbUser = fileStore.getUserByUsername(username);
      if (dbUser) {
        const isAdmin = dbUser.role === 'admin' || dbUser.username.toLowerCase() === 'n0vemberain';
        if (!isAdmin) {
          if (dbUser.isActive === false) {
            return res.status(403).json({
              success: false,
              sessionRevoked: true,
              message: 'This account has been deactivated by the administrator.'
            });
          }
          if (sessionVersion !== null && sessionVersion < (dbUser.sessionVersion || 1)) {
            return res.status(401).json({
              success: false,
              sessionRevoked: true,
              message: 'Your active session has been terminated by the administrator.'
            });
          }
        }
      }
    }

    const data = fileStore.readStore();
    const targetUser = username ? fileStore.getUser(username) : data.user;
    const userTasks = fileStore.getTasks(null, username);
    const userChallenges = fileStore.getChallenges(username);
    const userSessions = fileStore.getTimerSessions(username);
    const isAdmin = targetUser?.role === 'admin' || (!username) || (username === 'n0vemberain');

    res.json({
      success: true,
      message: 'Server data retrieved successfully',
      data: {
        user: targetUser,
        users: isAdmin ? (data.users || []) : undefined,
        tasks: userTasks,
        challenges: userChallenges,
        timerSessions: userSessions,
        heatmapHistory: data.heatmapHistory || {},
        lastUpdated: data.lastUpdated
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/sync - Bi-directional intelligent full sync with User Isolation
router.post('/', async (req, res) => {
  try {
    const { user, tasks, challenges, timerSessions, heatmapHistory, overwrite, username, sessionVersion } = req.body;
    const targetUsername = username || user?.username;

    // 1. Sync into persistent file store (Guarantees cross-device data persistence)
    const syncedData = fileStore.syncAll({
      user,
      tasks,
      challenges,
      timerSessions,
      heatmapHistory,
      username: targetUsername,
      sessionVersion,
      overwrite
    });

    if (syncedData.sessionRevoked) {
      return res.status(401).json({
        success: false,
        sessionRevoked: true,
        message: syncedData.message
      });
    }

    // 2. If MongoDB is actively connected (readyState === 1), mirror to Mongo
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        if (user && User?.findOne) {
          let u = await User.findOne({ username: syncedData.user?.username });
          if (!u) {
            await User.create(syncedData.user);
          } else {
            Object.assign(u, syncedData.user);
            await u.save();
          }
        }
      } catch (mErr) {
        // Ignore Mongo mirror error
      }
    }

    res.json({
      success: true,
      message: 'Data synchronized across all devices successfully',
      data: syncedData
    });
  } catch (error) {
    console.error('[Sync Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/sync/reset - Complete Factory Reset
router.post('/reset', async (req, res) => {
  try {
    const freshData = fileStore.factoryReset();
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        if (Task?.deleteMany) await Task.deleteMany({});
        if (Challenge?.deleteMany) await Challenge.deleteMany({});
      } catch (mErr) {
        // Ignore Mongo mirror error
      }
    }
    res.json({
      success: true,
      message: 'Factory reset completed successfully',
      data: freshData
    });
  } catch (error) {
    console.error('[Reset Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
