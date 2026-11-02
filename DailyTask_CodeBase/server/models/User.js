import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Fatin Ishraque',
      trim: true
    },
    username: {
      type: String,
      default: 'n0vemberain',
      trim: true
    },
    password: {
      type: String,
      default: '••••••••'
    },
    fieldOfStudy: {
      type: String,
      default: 'Computer Science & Engineering',
      trim: true
    },
    skills: {
      type: [String],
      default: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Git & GitHub', 'Tailwind CSS']
    },
    avatarUrl: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
