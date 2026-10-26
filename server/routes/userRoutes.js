import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get profile
router.get('/profile', async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({});
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const { name, username, password, fieldOfStudy, skills, avatarUrl } = req.body;
    let user = await User.findOne();

    if (!user) {
      user = new User({ name, username, password, fieldOfStudy, skills, avatarUrl });
    } else {
      if (name !== undefined) user.name = name;
      if (username !== undefined) user.username = username;
      if (password !== undefined) user.password = password;
      if (fieldOfStudy !== undefined) user.fieldOfStudy = fieldOfStudy;
      if (skills !== undefined) user.skills = skills;
      if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    }

    await user.save();
    res.json({ success: true, data: user, message: 'Profile updated in MongoDB' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
