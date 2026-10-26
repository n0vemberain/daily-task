import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'skipped'],
    default: 'pending'
  },
  note: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date,
    default: null
  }
});

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'Habit',
      trim: true
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1
    },
    startDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    endDate: {
      type: String // YYYY-MM-DD
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active'
    },
    checkIns: [checkInSchema]
  },
  { timestamps: true }
);

export default mongoose.models.Challenge || mongoose.model('Challenge', challengeSchema);
