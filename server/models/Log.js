import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
logSchema.index({ userId: 1, habitId: 1, date: -1 });
logSchema.index({ userId: 1, date: -1 });
logSchema.index({ habitId: 1, completed: 1, date: -1 });

// Ensure one log per habit per day per user
logSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });

// Static method to get date without time for consistent daily logging
logSchema.statics.getDateOnly = function(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Static method to toggle habit completion for a specific date
logSchema.statics.toggleHabitCompletion = async function(habitId, userId, date = new Date()) {
  const dateOnly = this.getDateOnly(date);
  
  try {
    // Try to find existing log
    const existingLog = await this.findOne({ habitId, userId, date: dateOnly });
    
    if (existingLog) {
      // Toggle completion status
      existingLog.completed = !existingLog.completed;
      existingLog.completedAt = existingLog.completed ? new Date() : null;
      return await existingLog.save();
    } else {
      // Create new log
      return await this.create({
        habitId,
        userId,
        date: dateOnly,
        completed: true,
        completedAt: new Date()
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error (race condition)
      const existingLog = await this.findOne({ habitId, userId, date: dateOnly });
      if (existingLog) {
        existingLog.completed = !existingLog.completed;
        existingLog.completedAt = existingLog.completed ? new Date() : null;
        return await existingLog.save();
      }
    }
    throw error;
  }
};

// Static method to calculate streak for a habit
logSchema.statics.calculateStreak = async function(habitId, userId, endDate = new Date()) {
  const dateOnly = this.getDateOnly(endDate);
  
  // Get all completed logs for this habit, sorted by date descending
  const logs = await this.find({
    habitId,
    userId,
    completed: true,
    date: { $lte: dateOnly }
  }).sort({ date: -1 }).lean();
  
  if (logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let expectedDate = new Date(dateOnly);
  
  // Calculate current streak (from today backwards)
  for (const log of logs) {
    const logDate = new Date(log.date);
    
    if (logDate.getTime() === expectedDate.getTime()) {
      if (currentStreak === tempStreak) {
        currentStreak++;
      }
      tempStreak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      // Gap found, current streak ends
      if (currentStreak === tempStreak) {
        currentStreak = tempStreak;
      }
      break;
    }
  }
  
  // Calculate longest streak
  tempStreak = 1;
  let previousDate = logs[0].date;
  
  for (let i = 1; i < logs.length; i++) {
    const currentDate = new Date(logs[i].date);
    const expectedPrevious = new Date(previousDate);
    expectedPrevious.setDate(expectedPrevious.getDate() - 1);
    
    if (currentDate.getTime() === expectedPrevious.getTime()) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
    previousDate = logs[i].date;
  }
  
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return { currentStreak, longestStreak };
};

export default mongoose.model('Log', logSchema);