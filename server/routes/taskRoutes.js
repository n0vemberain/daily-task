import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks or by date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { date } : {};
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Heatmap statistics (grouped by date)
router.get('/heatmap', async (req, res) => {
  try {
    const aggregation = await Task.aggregate([
      { $match: { completed: true } },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 },
          tasks: { $push: '$title' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const heatmapData = {};
    aggregation.forEach(item => {
      heatmapData[item._id] = {
        count: item.count,
        tasks: item.tasks
      };
    });

    res.json({ success: true, data: heatmapData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, category, priority, date, estimatedMinutes } = req.body;
    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'Title and date are required' });
    }

    const task = await Task.create({
      title,
      category: category || 'General',
      priority: priority || 'Medium',
      date,
      estimatedMinutes: estimatedMinutes || 30,
      completed: false
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { title, category, priority, completed, date, estimatedMinutes } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (category !== undefined) task.category = category;
    if (priority !== undefined) task.priority = priority;
    if (date !== undefined) task.date = date;
    if (estimatedMinutes !== undefined) task.estimatedMinutes = estimatedMinutes;
    if (completed !== undefined) {
      task.completed = completed;
      task.completedAt = completed ? new Date() : null;
    }

    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
