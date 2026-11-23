import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { INITIAL_CATEGORIES, INITIAL_TASKS } from '../services/mockData';
import { getTodayString, isTaskOverdue, isTaskToday, isTaskUpcoming } from '../utils/dateUtils';
import { taskAPI, analyticsAPI } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState(new Set());

  // Global Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed, overdue
  const [filterPriority, setFilterPriority] = useState('all'); // all, High, Medium, Low
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate'); // dueDate, priority, title

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingTask, setEditingTask] = useState(null);

  // Backend Analytics data states
  const [apiOverview, setApiOverview] = useState(null);
  const [apiWeekly, setApiWeekly] = useState(null);
  const [apiPriority, setApiPriority] = useState(null);

  // Toast Notification System
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Fetch user tasks & analytics from backend
  const fetchTasksAndAnalytics = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsTasksLoading(true);
    try {
      const [tasksRes, overviewRes, weeklyRes, priorityRes] = await Promise.allSettled([
        taskAPI.getTasks(),
        analyticsAPI.getOverview(),
        analyticsAPI.getWeekly(),
        analyticsAPI.getPriority(),
      ]);

      if (tasksRes.status === 'fulfilled' && tasksRes.value?.data) {
        const backendTasks = tasksRes.value.data.map((t) => ({
          id: t._id,
          _id: t._id,
          title: t.title,
          description: t.description,
          priority: t.priority,
          category: t.category,
          dueDate: t.dueDate,
          status: t.status,
          completed: t.completed ?? t.status === 'completed',
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        }));
        setTasks(backendTasks);
      }

      if (overviewRes.status === 'fulfilled' && overviewRes.value?.data) {
        setApiOverview(overviewRes.value.data);
      }
      if (weeklyRes.status === 'fulfilled' && weeklyRes.value?.data) {
        setApiWeekly(weeklyRes.value.data);
      }
      if (priorityRes.status === 'fulfilled' && priorityRes.value?.data) {
        setApiPriority(priorityRes.value.data);
      }
    } catch {
      // Retain optimistic state if offline
    } finally {
      setIsTasksLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasksAndAnalytics();
    } else {
      // Restore initial demonstration tasks when logged out
      setTasks(INITIAL_TASKS);
      setApiOverview(null);
      setApiWeekly(null);
      setApiPriority(null);
    }
  }, [isAuthenticated, fetchTasksAndAnalytics]);

  const openCreateModal = (defaults = {}) => {
    setModalMode('create');
    setEditingTask(defaults);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setModalMode('edit');
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Task Mutations
  const addTask = async (taskData) => {
    const payload = {
      title: taskData.title.trim(),
      description: taskData.description || '',
      priority: taskData.priority || 'Medium',
      category: taskData.category || 'Work',
      dueDate: taskData.dueDate || getTodayString(),
      status: taskData.status || 'pending',
    };

    if (isAuthenticated) {
      try {
        const res = await taskAPI.createTask(payload);
        const created = res.data;
        const normalized = {
          id: created._id,
          _id: created._id,
          ...created,
          completed: created.completed ?? created.status === 'completed',
        };
        setTasks((prev) => [normalized, ...prev]);
        showToast(`Task "${normalized.title}" created`, 'success');
        closeModal();
        fetchTasksAndAnalytics(); // Sync live analytics
        return;
      } catch (err) {
        showToast(err.message || 'Failed to create task on server', 'error');
        return;
      }
    }

    // Fallback local creation
    const localTask = {
      id: `task-${Date.now()}`,
      ...payload,
      completed: payload.status === 'completed',
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [localTask, ...prev]);
    showToast(`Task "${localTask.title}" created`, 'success');
    closeModal();
  };

  const updateTask = async (id, updatedFields) => {
    if (isAuthenticated && (id.length === 24 || !id.startsWith('task-'))) {
      try {
        const res = await taskAPI.updateTask(id, updatedFields);
        const updated = res.data;
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id || t._id === id
              ? {
                  ...t,
                  ...updated,
                  id: updated._id,
                  completed: updated.completed ?? updated.status === 'completed',
                }
              : t
          )
        );
        showToast('Task updated', 'success');
        closeModal();
        fetchTasksAndAnalytics();
        return;
      } catch (err) {
        showToast(err.message || 'Failed to update task', 'error');
        return;
      }
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    );
    showToast('Task updated', 'success');
    closeModal();
  };

  const deleteTask = async (id) => {
    const taskToDelete = tasks.find((t) => t.id === id || t._id === id);
    // Optimistic removal
    setTasks((prev) => prev.filter((t) => t.id !== id && t._id !== id));
    showToast(`Deleted "${taskToDelete?.title || 'Task'}"`, 'info');

    if (isAuthenticated && (id.length === 24 || !id.startsWith('task-'))) {
      try {
        await taskAPI.deleteTask(id);
        fetchTasksAndAnalytics();
      } catch (err) {
        showToast('Failed to delete task from server', 'error');
        // Restore if failed
        if (taskToDelete) setTasks((prev) => [taskToDelete, ...prev]);
      }
    }
  };

  const toggleTask = async (id) => {
    const target = tasks.find((t) => t.id === id || t._id === id);
    if (!target) return;

    const nextCompleted = !target.completed;
    const nextStatus = nextCompleted ? 'completed' : 'pending';

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id || t._id === id) {
          return {
            ...t,
            completed: nextCompleted,
            status: nextStatus,
          };
        }
        return t;
      })
    );

    if (nextCompleted) {
      showToast(`Marked "${target.title}" as completed`, 'success');
    }

    if (isAuthenticated && (id.length === 24 || !id.startsWith('task-'))) {
      try {
        await taskAPI.updateTaskStatus(id, { status: nextStatus, completed: nextCompleted });
        fetchTasksAndAnalytics();
      } catch {
        // Optimistic UI state already applied
      }
    }
  };

  // Category Actions
  const addCategory = (categoryData) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: categoryData.name.trim(),
      color: categoryData.color || '#4f46e5',
      icon: categoryData.icon || 'Folder',
      description: categoryData.description || 'Custom category',
    };
    setCategories((prev) => [...prev, newCategory]);
    showToast(`Category "${newCategory.name}" added`, 'success');
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category removed', 'info');
  };

  // Real notifications derived dynamically from user's current tasks
  const notifications = useMemo(() => {
    if (!isAuthenticated) return [];
    const list = [];
    const overdue = tasks.filter((t) => isTaskOverdue(t.dueDate, t.completed));
    const todayPending = tasks.filter((t) => isTaskToday(t.dueDate) && !t.completed);

    if (overdue.length > 0) {
      const id = `overdue-${overdue.length}`;
      list.push({
        id,
        title: `${overdue.length} ${overdue.length === 1 ? 'task is' : 'tasks are'} overdue`,
        message: overdue.slice(0, 2).map((t) => t.title).join(', ') + (overdue.length > 2 ? ` and ${overdue.length - 2} more` : ''),
        time: 'Action needed',
        unread: !readNotificationIds.has(id),
        type: 'warning',
      });
    }

    if (todayPending.length > 0) {
      const id = `today-${todayPending.length}`;
      list.push({
        id,
        title: `${todayPending.length} ${todayPending.length === 1 ? 'task' : 'tasks'} scheduled for today`,
        message: todayPending.slice(0, 2).map((t) => t.title).join(', ') + (todayPending.length > 2 ? ` and ${todayPending.length - 2} more` : ''),
        time: 'Today',
        unread: !readNotificationIds.has(id),
        type: 'info',
      });
    }

    return list;
  }, [tasks, readNotificationIds, isAuthenticated]);

  const markAllNotificationsRead = () => {
    setReadNotificationIds(new Set(notifications.map((n) => n.id)));
    showToast('Notifications marked as read', 'info');
  };

  // Computed Statistics
  const stats = useMemo(() => {
    if (apiOverview && isAuthenticated) {
      return apiOverview;
    }

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter((t) => isTaskOverdue(t.dueDate, t.completed)).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
    };
  }, [tasks, apiOverview, isAuthenticated]);

  // Priority distribution for charts
  const priorityDistribution = useMemo(() => {
    if (apiPriority && isAuthenticated) {
      return apiPriority;
    }

    const counts = { High: 0, Medium: 0, Low: 0 };
    tasks.forEach((t) => {
      if (counts[t.priority] !== undefined) {
        counts[t.priority]++;
      }
    });

    return [
      { name: 'High', value: counts.High, color: '#f43f5e' },
      { name: 'Medium', value: counts.Medium, color: '#f59e0b' },
      { name: 'Low', value: counts.Low, color: '#94a3b8' },
    ];
  }, [tasks, apiPriority, isAuthenticated]);

  // Weekly completion throughput (computed from real task completion history)
  const weeklyCompletionTrend = useMemo(() => {
    if (apiWeekly && isAuthenticated) {
      return apiWeekly;
    }

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

    tasks.filter((t) => t.completed).forEach((t) => {
      const taskDate = t.completedAt ? t.completedAt.slice(0, 10) : t.dueDate;
      const bucket = days.find((d) => d.date === taskDate);
      if (bucket) {
        bucket.completed++;
      }
    });

    return days;
  }, [tasks, apiWeekly, isAuthenticated]);

  // Filtered & Sorted Tasks list
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = (task.title || '').toLowerCase().includes(query);
          const matchesDesc = (task.description || '').toLowerCase().includes(query);
          const matchesCategory = (task.category || '').toLowerCase().includes(query);
          if (!matchesTitle && !matchesDesc && !matchesCategory) {
            return false;
          }
        }

        // Status filter
        if (filterStatus === 'completed' && !task.completed) return false;
        if (filterStatus === 'pending' && task.completed) return false;
        if (filterStatus === 'overdue' && !isTaskOverdue(task.dueDate, task.completed)) return false;

        // Priority filter
        if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

        // Category filter
        if (filterCategory !== 'all' && task.category !== filterCategory) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return (a.dueDate || '').localeCompare(b.dueDate || '');
        }
        if (sortBy === 'priority') {
          const weights = { High: 3, Medium: 2, Low: 1 };
          return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        if (sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return 0;
      });
  }, [tasks, searchQuery, filterStatus, filterPriority, filterCategory, sortBy]);

  // Derived Task Subsets
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => isTaskToday(t.dueDate));
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter((t) => isTaskUpcoming(t.dueDate) && !t.completed);
  }, [tasks]);

  const recentlyCompletedTasks = useMemo(() => {
    return tasks.filter((t) => t.completed).slice(0, 5);
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    return tasks.filter((t) => isTaskOverdue(t.dueDate, t.completed));
  }, [tasks]);

  const value = {
    tasks,
    categories,
    user,
    notifications,
    markAllNotificationsRead,
    stats,
    priorityDistribution,
    weeklyCompletionTrend,
    filteredTasks,
    todayTasks,
    upcomingTasks,
    recentlyCompletedTasks,
    overdueTasks,
    isTasksLoading,
    refreshTasks: fetchTasksAndAnalytics,
    // Filter controls
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    // Modal actions
    isModalOpen,
    modalMode,
    editingTask,
    openCreateModal,
    openEditModal,
    closeModal,
    // Toast
    toast,
    showToast,
    // Task mutations
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    // Category mutations
    addCategory,
    deleteCategory,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
