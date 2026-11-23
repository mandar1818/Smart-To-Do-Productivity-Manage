import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { Plus, ArrowRight, Trash2, Folder, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRESET_COLORS = [
  '#4f46e5', // Indigo
  '#7c3aed', // Violet
  '#0284c7', // Sky
  '#059669', // Emerald
  '#d97706', // Amber
  '#e11d48', // Rose
  '#0d9488', // Teal
];

export function CategoriesPage() {
  const { categories, tasks, addCategory, deleteCategory, setFilterCategory } = useTasks();
  const navigate = useNavigate();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCat, setNewCat] = useState({
    name: '',
    color: '#4f46e5',
    description: '',
  });

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    addCategory(newCat);
    setNewCat({ name: '', color: '#4f46e5', description: '' });
    setIsAddOpen(false);
  };

  const handleSelectCategory = (categoryName) => {
    setFilterCategory(categoryName);
    navigate('/tasks');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Categories
            </h1>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {categories.length} active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organize your tasks by project, area, or context
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          variant="primary"
          size="sm"
          leftIcon={Plus}
          className="self-start sm:self-center font-semibold shadow-sm shadow-indigo-500/20"
        >
          Add category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const categoryTasks = tasks.filter((t) => t.category === cat.name);
          const completedCount = categoryTasks.filter((t) => t.completed).length;
          const pendingCount = categoryTasks.length - completedCount;
          const rate =
            categoryTasks.length > 0
              ? Math.round((completedCount / categoryTasks.length) * 100)
              : 0;

          return (
            <div
              key={cat.id}
              className="relative overflow-hidden bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-200 group-hover:h-2"
                style={{ backgroundColor: cat.color }}
              />

              <div className="pt-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full ring-2 ring-white shadow-2xs shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                  </div>

                  {categories.length > 2 && (
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                      title="Remove category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] mb-4">
                  {cat.description || 'Functional task group and focus domain.'}
                </p>

                {/* Progress Meter */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                    <span>Resolution</span>
                    <span className="font-mono text-slate-900">{rate}%</span>
                  </div>
                  <ProgressBar value={rate} height="h-2" color={cat.color} />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {pendingCount} pending
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {completedCount} completed
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSelectCategory(cat.name)}
                className="mt-4 pt-3 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors border-t border-slate-100 group/btn cursor-pointer"
              >
                <span>Filter tasks by {cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create new category"
        subtitle="Define a workspace domain to group tasks and measure progress"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              placeholder="e.g., Marketing, Infrastructure, Architecture"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 shadow-2xs transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description / Objective
            </label>
            <input
              type="text"
              value={newCat.description}
              onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
              placeholder="Brief description of this domain..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 shadow-2xs transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2 mb-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewCat({ ...newCat, color: c })}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    newCat.color === c ? 'scale-110 ring-2 ring-indigo-600 ring-offset-2' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={newCat.color}
                onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
              />
              <span className="text-xs font-mono font-semibold text-slate-600 uppercase">
                {newCat.color}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
