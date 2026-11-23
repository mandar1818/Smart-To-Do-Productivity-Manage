import React from 'react';
import { useTasks } from '../context/TaskContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ProgressBar } from '../components/common/ProgressBar';
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, CheckSquare, Layers } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-3 py-2 rounded-lg text-xs shadow-xl border border-slate-800">
        <p className="font-medium text-slate-400">{label}</p>
        <p className="text-white mt-1 flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
          Completed: {payload[0]?.value}
        </p>
      </div>
    );
  }
  return null;
}

export function AnalyticsPage() {
  const { stats, weeklyCompletionTrend, priorityDistribution, categories, tasks } = useTasks();

  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.category === cat.name);
    const completed = catTasks.filter((t) => t.completed).length;
    const rate = catTasks.length > 0 ? Math.round((completed / catTasks.length) * 100) : 0;
    return {
      name: cat.name,
      total: catTasks.length,
      completed,
      pending: catTasks.length - completed,
      rate,
      color: cat.color,
    };
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Your productivity
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Overview of completed tasks, active queue, and priority distribution
          </p>
        </div>
      </div>

      {/* Metric Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">Completion rate</p>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {stats.completionRate}%
            </p>
            <div className="mt-2">
              <ProgressBar value={stats.completionRate} height="h-1.5" barColor="bg-indigo-600" />
            </div>
            <span className="text-[11px] text-slate-400 mt-1.5 block">Completed of total tasks</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">Completed tasks</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-emerald-600 tracking-tight font-mono">
              {stats.completed}
            </p>
            <span className="text-[11px] text-slate-400 mt-2 block">Tasks marked complete</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">Pending tasks</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
              {stats.pending}
            </p>
            <span className="text-[11px] text-slate-400 mt-2 block">Tasks waiting to be done</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600">Overdue tasks</p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats.overdue > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className={`text-3xl font-bold tracking-tight font-mono ${stats.overdue > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {stats.overdue}
            </p>
            <span className="text-[11px] text-slate-400 mt-2 block">Tasks past target due date</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Completion Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  Tasks completed this week
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Daily task completions over the past 7 days
              </p>
            </div>
            <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60 font-medium">
              Last 7 days
            </span>
          </div>

          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyCompletionTrend}
                margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
                barGap={6}
              >
                <defs>
                  <linearGradient id="analyticsElectricBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5e6ad2" />
                    <stop offset="100%" stopColor="#4338ca" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9', radius: 4 }} />
                <Bar dataKey="completed" fill="url(#analyticsElectricBar)" radius={[5, 5, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Tasks by priority
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Distribution of active tasks by urgency
            </p>
          </div>

          <div className="space-y-4 my-auto py-3">
            {priorityDistribution.map((item) => {
              const percentage = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0;
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name} Priority
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{item.value}</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>{stats.total} total items</span>
            <span className="text-indigo-600 font-medium">{stats.completed} resolved</span>
          </div>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Tasks by category
            </h2>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {categoryStats.length} Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Completion rate and total tasks across each category
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {categoryStats.map((item) => (
            <div
              key={item.name}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-40">
                <span
                  className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-2xs"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-bold text-slate-800 text-sm">{item.name}</span>
              </div>

              <div className="flex items-center gap-3.5 flex-1 max-w-md">
                <div className="flex-1">
                  <ProgressBar value={item.rate} height="h-2" color={item.color} />
                </div>
                <span className="text-slate-800 font-mono font-bold w-12 text-right">
                  {item.rate}%
                </span>
              </div>

              <div className="text-slate-500 text-xs sm:text-right min-w-36 font-medium">
                <span className="text-emerald-600 font-semibold">{item.completed}</span> of {item.total} tasks completed
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
