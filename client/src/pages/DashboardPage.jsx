import React from 'react';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ProductivityCharts } from '../components/dashboard/ProductivityCharts';
import { TaskSections } from '../components/dashboard/TaskSections';

export function DashboardPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Header & Quick Action */}
      <WelcomeSection />

      {/* 2. Compact Statistics */}
      <DashboardStats />

      {/* 3. Productivity & Priority Visualizations */}
      <ProductivityCharts />

      {/* 4. Unified Task Worklist */}
      <TaskSections />
    </div>
  );
}
