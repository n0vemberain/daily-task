import express from 'express';
import mongoose from 'mongoose';
import { fileStore } from '../storage/fileStore.js';
import User from '../models/User.js';

const router = express.Router();

const isMongoActive = () => mongoose.connection && mongoose.connection.readyState === 1;

// Get profile (supports optional ?username=...)
router.get('/profile', async (req, res) => {
  try {
    const username = req.query.username;
    const user = fileStore.getUser(username);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const username = req.query.username || req.body.username;
    const updated = fileStore.updateUser(req.body, username);

    // Mirror to MongoDB if actively connected
    if (isMongoActive()) {
      try {
        if (User?.findOne) {
          let u = await User.findOne({ username: updated.username });
          if (!u) u = await User.findOne();
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

// GET /api/user/all - Get all registered users (Admin access)
router.get('/all', async (req, res) => {
  try {
    const users = fileStore.getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/user/create - Create new user / guest account (Admin access)
router.post('/create', async (req, res) => {
  try {
    const newUser = fileStore.createUser(req.body);
    res.status(201).json({
      success: true,
      message: `User ${newUser.username} created successfully`,
      data: newUser
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/user/:id/credentials - Update user credentials (ID, password, name, role)
router.put('/:id/credentials', async (req, res) => {
  try {
    const updated = fileStore.updateUserCredentials(req.params.id, req.body);
    res.json({
      success: true,
      message: `Credentials updated for ${updated.username}`,
      data: updated
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// POST /api/user/:id/logout - Force-logout user session
router.post('/:id/logout', async (req, res) => {
  try {
    const result = fileStore.forceLogoutUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PATCH /api/user/:id/toggle-status - Activate or Suspend user account
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const updated = fileStore.toggleUserStatus(req.params.id);
    res.json({
      success: true,
      message: `Account status for ${updated.username} updated to ${updated.isActive ? 'Active' : 'Suspended'}`,
      data: updated
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/user/:id - Delete user account and associated isolated data
router.delete('/:id', async (req, res) => {
  try {
    fileStore.deleteUser(req.params.id);
    res.json({ success: true, message: 'User account and associated data deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
