import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  category: {
    type: String,
    enum: ['health', 'productivity', 'mindfulness', 'learning', 'fitness', 'social', 'creative', 'other'],
    default: 'other'
  },
  color: {
    type: String,
    default: '#3B82F6', // Blue-500
    validate: {
      validator: function(v) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Color must be a valid hex color'
    }
  },
  targetDays: {
    type: [Number], // [0,1,2,3,4,5,6] for Sun-Sat, empty array means daily
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
habitSchema.index({ userId: 1, createdAt: -1 });
habitSchema.index({ userId: 1, isActive: 1 });
habitSchema.index({ category: 1 });

// Virtual for habit logs (populated when needed)
habitSchema.virtual('logs', {
  ref: 'Log',
  localField: '_id',
  foreignField: 'habitId'
});

// Pre-save middleware to update updatedAt
habitSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Habit', habitSchema);