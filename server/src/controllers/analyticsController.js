import { Task } from '../models/Task.js';

// @desc    Get overview productivity statistics
// @route   GET /api/analytics/overview
// @access  Private
export const getAnalyticsOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().slice(0, 10);

    const [total, completed, overdue] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'completed' }),
      Task.countDocuments({
        userId,
        status: 'pending',
        dueDate: { $lt: today },
      }),
    ]);

    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue,
        completionRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly completion throughput
// @route   GET /api/analytics/weekly
// @access  Private
export const getWeeklyThroughput = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Build the 7-day window ending today
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({
        date: dateStr,
        day: dayNames[d.getDay()],
        completed: 0,
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);

    // Fetch user tasks completed in the last 7 days
    const completedTasks = await Task.find({
      userId,
      status: 'completed',
      updatedAt: { $gte: startDate },
    }).select('updatedAt dueDate');

    completedTasks.forEach((task) => {
      const taskDate = task.updatedAt ? task.updatedAt.toISOString().slice(0, 10) : task.dueDate;
      const dayBucket = days.find((d) => d.date === taskDate);
      if (dayBucket) {
        dayBucket.completed++;
      }
    });

    return res.status(200).json({
      success: true,
      data: days,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get priority distribution breakdown
// @route   GET /api/analytics/priority
// @access  Private
export const getPriorityDistribution = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [high, medium, low] = await Promise.all([
      Task.countDocuments({ userId, priority: 'High' }),
      Task.countDocuments({ userId, priority: 'Medium' }),
      Task.countDocuments({ userId, priority: 'Low' }),
    ]);

    const distribution = [
      { name: 'High', value: high, color: '#f43f5e' },
      { name: 'Medium', value: medium, color: '#f59e0b' },
      { name: 'Low', value: low, color: '#94a3b8' },
    ];

    return res.status(200).json({
      success: true,
      data: distribution,
    });
  } catch (error) {
    next(error);
  }
};
