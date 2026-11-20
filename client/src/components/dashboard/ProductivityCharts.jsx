import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useTasks } from '../../context/TaskContext';

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

export function ProductivityCharts() {
  const { weeklyCompletionTrend, priorityDistribution, stats } = useTasks();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Weekly Activity (2 Columns) */}
      <div className="lg:col-span-2 bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Weekly Activity
              </h2>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Last 7 Days
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Task completion throughput across the recent cycle
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span className="font-medium">Completed</span>
          </div>
        </div>

        <div className="h-52 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyCompletionTrend}
              margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
              barGap={6}
            >
              <defs>
                <linearGradient id="electricBar" x1="0" y1="0" x2="0" y2="1">
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
              <Bar
                dataKey="completed"
                fill="url(#electricBar)"
                radius={[5, 5, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Distribution (1 Column) */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Priority Overview
            </h2>
            <span className="text-[11px] font-mono text-slate-500 font-medium">
              {stats.total} total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Active backlog breakdown by urgency
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
                    {item.name}
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

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {stats.completed} resolved
          </span>
          <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
            {stats.completionRate}% completion rate
          </span>
        </div>
      </div>
    </div>
  );
}
