import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Challenge from '../models/Challenge.js';

const router = express.Router();

// Bi-directional full sync
router.post('/', async (req, res) => {
  try {
    const { user, tasks, challenges } = req.body;

    // 1. Sync User Profile
    let syncedUser = null;
    if (user) {
      syncedUser = await User.findOne();
      if (!syncedUser) {
        syncedUser = new User(user);
      } else {
        if (user.name) syncedUser.name = user.name;
        if (user.username) syncedUser.username = user.username;
        if (user.password) syncedUser.password = user.password;
        if (user.fieldOfStudy) syncedUser.fieldOfStudy = user.fieldOfStudy;
        if (user.skills) syncedUser.skills = user.skills;
        if (user.avatarUrl) syncedUser.avatarUrl = user.avatarUrl;
      }
      await syncedUser.save();
    } else {
      syncedUser = await User.findOne();
    }

    // 2. Sync Tasks
    if (Array.isArray(tasks) && tasks.length > 0) {
      for (const t of tasks) {
        if (t._id && t._id.length === 24) {
          await Task.findByIdAndUpdate(t._id, t, { upsert: true, new: true });
        } else {
          // create if doesn't exist by title and date
          const existing = await Task.findOne({ title: t.title, date: t.date });
          if (!existing) {
            await Task.create(t);
          }
        }
      }
    }

    // 3. Sync Challenges
    if (Array.isArray(challenges) && challenges.length > 0) {
      for (const c of challenges) {
        if (c._id && c._id.length === 24) {
          await Challenge.findByIdAndUpdate(c._id, c, { upsert: true, new: true });
        } else {
          const existing = await Challenge.findOne({ title: c.title, startDate: c.startDate });
          if (!existing) {
            await Challenge.create(c);
          }
        }
      }
    }

    // Fetch the freshest unified database state
    const allUsers = await User.find();
    const allTasks = await Task.find().sort({ createdAt: -1 });
    const allChallenges = await Challenge.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'MongoDB synchronized successfully',
      data: {
        user: allUsers[0] || syncedUser,
        tasks: allTasks,
        challenges: allChallenges
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
