import express from 'express';
import Challenge from '../models/Challenge.js';

const router = express.Router();

// Helper to format date YYYY-MM-DD
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to add days to date
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json({ success: true, data: challenges });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create challenge
router.post('/', async (req, res) => {
  try {
    const { title, description, category, durationDays, startDate } = req.body;
    if (!title || !durationDays || !startDate) {
      return res.status(400).json({ success: false, message: 'Title, durationDays and startDate are required' });
    }

    const duration = parseInt(durationDays, 10);
    const endDate = addDays(startDate, duration - 1);

    // Build the check-in days
    const checkIns = [];
    for (let i = 0; i < duration; i++) {
      checkIns.push({
        dayNumber: i + 1,
        date: addDays(startDate, i),
        status: 'pending',
        note: '',
        completedAt: null
      });
    }

    const challenge = await Challenge.create({
      title,
      description: description || '',
      category: category || 'Habit',
      durationDays: duration,
      startDate,
      endDate,
      status: 'active',
      checkIns
    });

    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check-in on a specific day of a challenge
router.post('/:id/checkin', async (req, res) => {
  try {
    const { dayNumber, status, note } = req.body;
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const checkIn = challenge.checkIns.find(c => c.dayNumber === parseInt(dayNumber, 10));
    if (!checkIn) {
      return res.status(404).json({ success: false, message: 'Day not found in challenge' });
    }

    if (status) checkIn.status = status;
    if (note !== undefined) checkIn.note = note;
    checkIn.completedAt = status === 'completed' ? new Date() : null;

    // Check if entire challenge is completed
    const allChecked = challenge.checkIns.every(c => c.status === 'completed' || c.status === 'skipped');
    if (allChecked) {
      challenge.status = 'completed';
    }

    await challenge.save();
    res.json({ success: true, data: challenge, message: 'Check-in recorded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete challenge
router.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }
    res.json({ success: true, message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
