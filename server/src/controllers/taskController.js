import mongoose from 'mongoose';
import { Task } from '../models/Task.js';

// @desc    Get all user-specific tasks with optional filters
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, priority, category, search, sortBy } = req.query;

    const query = { userId };

    if (status && status !== 'all') {
      if (status === 'overdue') {
        const today = new Date().toISOString().slice(0, 10);
        query.status = 'pending';
        query.dueDate = { $lt: today };
      } else {
        query.status = status;
      }
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }, { category: regex }];
    }

    let sortOption = { dueDate: 1 };
    if (sortBy === 'priority') {
      sortOption = { priority: -1, dueDate: 1 };
    } else if (sortBy === 'title') {
      sortOption = { title: 1 };
    } else if (sortBy === 'createdAt') {
      sortOption = { createdAt: -1 };
    }

    const tasks = await Task.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    if (!dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Due date is required (YYYY-MM-DD)',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: (description || '').trim(),
      priority: priority || 'Medium',
      category: category || 'Work',
      dueDate,
      status: status || 'pending',
      completed: status === 'completed',
      userId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Enforce task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, priority, category, dueDate, status, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Enforce task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) {
      task.status = status;
      task.completed = status === 'completed';
    } else if (completed !== undefined) {
      task.completed = Boolean(completed);
      task.status = completed ? 'completed' : 'pending';
    }

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Enforce task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await Task.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task completion status
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, completed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Enforce task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    // Toggle if no status/completed explicitly passed, or set given status
    if (status !== undefined) {
      task.status = status;
      task.completed = status === 'completed';
    } else if (completed !== undefined) {
      task.completed = Boolean(completed);
      task.status = completed ? 'completed' : 'pending';
    } else {
      task.completed = !task.completed;
      task.status = task.completed ? 'completed' : 'pending';
    }

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: `Task marked as ${task.status}`,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};
