import express from 'express';
import mongoose from 'mongoose';
import { fileStore } from '../storage/fileStore.js';
import Task from '../models/Task.js';

const router = express.Router();

const isMongoActive = () => mongoose.connection && mongoose.connection.readyState === 1;

// Get all tasks or by date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const tasks = fileStore.getTasks(date);
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Heatmap statistics (grouped by date)
router.get('/heatmap', async (req, res) => {
  try {
    const tasks = fileStore.getTasks();
    const heatmapData = {};

    tasks.filter(t => t.completed && t.date).forEach(t => {
      if (!heatmapData[t.date]) {
        heatmapData[t.date] = { count: 0, tasks: [] };
      }
      heatmapData[t.date].count += 1;
      heatmapData[t.date].tasks.push(t.title);
    });

    res.json({ success: true, data: heatmapData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, category, priority, date, estimatedMinutes, id } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const task = fileStore.createTask({
      id,
      title,
      category,
      priority,
      date,
      estimatedMinutes
    });

    // Mirror to MongoDB if actively connected
    if (isMongoActive()) {
      try {
        if (Task?.create) await Task.create(task);
      } catch (e) {}
    }

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = fileStore.updateTask(taskId, req.body);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Mirror to MongoDB if actively connected
    if (isMongoActive()) {
      try {
        if (Task?.findByIdAndUpdate) await Task.findByIdAndUpdate(taskId, req.body);
      } catch (e) {}
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    fileStore.deleteTask(taskId);

    // Mirror to MongoDB if actively connected
    if (isMongoActive()) {
      try {
        if (Task?.findByIdAndDelete) await Task.findByIdAndDelete(taskId);
      } catch (e) {}
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
