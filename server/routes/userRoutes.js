import express from 'express';
import mongoose from 'mongoose';
import { fileStore } from '../storage/fileStore.js';
import User from '../models/User.js';

const router = express.Router();

const isMongoActive = () => mongoose.connection && mongoose.connection.readyState === 1;

// Get profile
router.get('/profile', async (req, res) => {
  try {
    const user = fileStore.getUser();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const updated = fileStore.updateUser(req.body);

    // Mirror to MongoDB if actively connected
    if (isMongoActive()) {
      try {
        if (User?.findOne) {
          let u = await User.findOne();
          if (u) {
            Object.assign(u, req.body);
            await u.save();
          }
        }
      } catch (e) {}
    }

    res.json({ success: true, data: updated, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
