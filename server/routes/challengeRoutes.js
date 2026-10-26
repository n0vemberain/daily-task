import express from 'express';
import mongoose from 'mongoose';
import { fileStore } from '../storage/fileStore.js';
import Challenge from '../models/Challenge.js';

const router = express.Router();

const isMongoActive = () => mongoose.connection && mongoose.connection.readyState === 1;

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = fileStore.getChallenges();
    res.json({ success: true, data: challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create challenge
router.post('/', async (req, res) => {
  try {
    const { title, durationDays, startDate } = req.body;
    if (!title || !durationDays || !startDate) {
      return res.status(400).json({ success: false, message: 'Title, durationDays and startDate are required' });
    }

    const challenge = fileStore.createChallenge(req.body);

    if (isMongoActive()) {
      try {
        if (Challenge?.create) await Challenge.create(challenge);
      } catch (e) {}
    }

    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check-in on a challenge day
router.post('/:id/checkin', async (req, res) => {
  try {
    const { dayNumber, status, note } = req.body;
    const updated = fileStore.checkinChallenge(req.params.id, { dayNumber, status, note });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    res.json({ success: true, data: updated, message: 'Check-in recorded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete challenge
router.delete('/:id', async (req, res) => {
  try {
    fileStore.deleteChallenge(req.params.id);
    res.json({ success: true, message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
