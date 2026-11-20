import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { getTodayString } from '../../utils/dateUtils';
import { cn } from '../../utils/helpers';
import { Calendar, Tag, AlertTriangle, Sparkles } from 'lucide-react';

export function TaskModal() {
  const {
    isModalOpen,
    modalMode,
    editingTask,
    closeModal,
    addTask,
    updateTask,
    categories,
  } = useTasks();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Work',
    dueDate: getTodayString(),
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask && modalMode === 'edit') {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'Medium',
        category: editingTask.category || 'Work',
        dueDate: editingTask.dueDate || getTodayString(),
      });
    } else if (editingTask && modalMode === 'create') {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: editingTask.category || 'Work',
        dueDate: editingTask.dueDate || getTodayString(),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'Work',
        dueDate: getTodayString(),
      });
    }
    setErrors({});
  }, [editingTask, modalMode, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const todayStr = getTodayString();
  const dTomorrow = new Date();
  dTomorrow.setDate(dTomorrow.getDate() + 1);
  const tomorrowStr = `${dTomorrow.getFullYear()}-${String(dTomorrow.getMonth() + 1).padStart(2, '0')}-${String(dTomorrow.getDate()).padStart(2, '0')}`;
  const dNextWeek = new Date();
  dNextWeek.setDate(dNextWeek.getDate() + 7);
  const nextWeekStr = `${dNextWeek.getFullYear()}-${String(dNextWeek.getMonth() + 1).padStart(2, '0')}-${String(dNextWeek.getDate()).padStart(2, '0')}`;

  const setQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setFormData((prev) => ({ ...prev, dueDate: dateStr }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    if (modalMode === 'edit' && editingTask?.id) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={modalMode === 'edit' ? 'Edit task' : 'Create new task'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            autoFocus
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Finalize quarterly performance metrics"
            className={cn(
              'w-full px-3.5 py-2.5 text-sm sm:text-base font-medium rounded-lg border bg-white focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-normal',
              errors.title
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs'
            )}
          />
          {errors.title && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Description / Context
          </label>
          <textarea
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add notes, specifications, or subtask reminders..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none text-slate-800 placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        {/* Quick Date Chips */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Schedule Target
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className={cn(
                  'text-[11px] font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer',
                  formData.dueDate === todayStr
                    ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50'
                )}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className={cn(
                  'text-[11px] font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer',
                  formData.dueDate === tomorrowStr
                    ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50'
                )}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(7)}
                className={cn(
                  'text-[11px] font-medium px-2.5 py-1 rounded-md transition-all cursor-pointer',
                  formData.dueDate === nextWeekStr
                    ? 'bg-indigo-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50'
                )}
              >
                Next week
              </button>
            </div>
          </div>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 shadow-2xs transition-all"
          />
        </div>

        {/* Property Row: Segmented Priority & Category Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Priority Segmented Control */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
              {[
                { id: 'Low', label: 'Low', activeClass: 'bg-white text-slate-700 font-semibold shadow-2xs' },
                { id: 'Medium', label: 'Medium', activeClass: 'bg-amber-500 text-white font-semibold shadow-2xs' },
                { id: 'High', label: 'High', activeClass: 'bg-rose-600 text-white font-semibold shadow-2xs' },
              ].map((p) => {
                const isActive = formData.priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p.id })}
                    className={cn(
                      'py-1.5 text-xs rounded-md text-center transition-all cursor-pointer font-medium',
                      isActive ? p.activeClass : 'text-slate-500 hover:text-slate-900'
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-700 shadow-2xs transition-all cursor-pointer font-medium"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons & Shortcut hint */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-600 shadow-2xs">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] text-slate-600 shadow-2xs">Enter</kbd> to save
          </span>
          <div className="flex items-center gap-2.5 ml-auto">
            <Button variant="secondary" size="sm" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" className="font-semibold shadow-md shadow-indigo-600/25">
              {modalMode === 'edit' ? 'Save changes' : 'Create task'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
