import express from 'express';
import mongoose from 'mongoose';
import { fileStore } from '../storage/fileStore.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Challenge from '../models/Challenge.js';

const router = express.Router();

// GET /api/sync - Fetch full server state
router.get('/', async (req, res) => {
  try {
    const data = fileStore.readStore();
    res.json({
      success: true,
      message: 'Server data retrieved successfully',
      data: {
        user: data.user,
        tasks: data.tasks || [],
        challenges: data.challenges || [],
        timerSessions: data.timerSessions || [],
        lastUpdated: data.lastUpdated
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/sync - Bi-directional intelligent full sync
router.post('/', async (req, res) => {
  try {
    const { user, tasks, challenges, timerSessions } = req.body;

    // 1. Sync into persistent file store (Guarantees cross-device data persistence)
    const syncedData = fileStore.syncAll({ user, tasks, challenges, timerSessions });

    // 2. If MongoDB is actively connected (readyState === 1), mirror to Mongo
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        if (user && User?.findOne) {
          let u = await User.findOne();
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

export default router;
