import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [160, 'Title cannot exceed 160 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
    category: {
      type: String,
      default: 'Work',
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: String,
      required: [true, 'Due date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Keep status and completed in sync
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.completed = this.status === 'completed';
  } else if (this.isModified('completed')) {
    this.status = this.completed ? 'completed' : 'pending';
  }
  next();
});

// Compound index for efficient user-specific queries (filtered by user and sorted by dueDate/status)
taskSchema.index({ userId: 1, dueDate: 1, status: 1 });
taskSchema.index({ userId: 1, createdAt: -1 });

export const Task = mongoose.model('Task', taskSchema);
