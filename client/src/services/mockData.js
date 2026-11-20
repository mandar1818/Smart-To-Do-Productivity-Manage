function offsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Work', color: '#64748b', icon: 'Briefcase', description: 'Core team deliverables, sprint objectives, and reviews' },
  { id: 'cat-2', name: 'Development', color: '#3b82f6', icon: 'Code2', description: 'Frontend components, API routes, and database tuning' },
  { id: 'cat-3', name: 'Design', color: '#a855f7', icon: 'Palette', description: 'UI mockups, design tokens, and user flow reviews' },
  { id: 'cat-4', name: 'Personal', color: '#f59e0b', icon: 'User', description: 'Reading list, home tasks, and personal projects' },
  { id: 'cat-5', name: 'Finance', color: '#10b981', icon: 'TrendingUp', description: 'Tax preparation, budget tracking, and invoices' },
  { id: 'cat-6', name: 'Health', color: '#f43f5e', icon: 'HeartPulse', description: 'Workout routines, meal prep, and recovery' },
];

export const INITIAL_TASKS = [
  {
    id: 'task-101',
    title: 'Implement keyboard shortcut handler for task drawer',
    description: 'Bind Esc to close, Tab to navigate fields, and Enter to submit.',
    priority: 'High',
    category: 'Development',
    dueDate: offsetDate(0), // Today
    completed: false,
    completedAt: null,
    estimatedMinutes: 45,
    tags: ['Frontend', 'Accessibility']
  },
  {
    id: 'task-102',
    title: 'Review weekly sprint backlog with team leads',
    description: 'Ensure priorities are aligned for the upcoming release candidate.',
    priority: 'High',
    category: 'Work',
    dueDate: offsetDate(0), // Today
    completed: true,
    completedAt: offsetDate(0),
    estimatedMinutes: 30,
    tags: ['Planning']
  },
  {
    id: 'task-103',
    title: 'Audit query performance on tasks collection',
    description: 'Add compound index on dueDate and completed flags.',
    priority: 'Medium',
    category: 'Development',
    dueDate: offsetDate(0), // Today
    completed: false,
    completedAt: null,
    estimatedMinutes: 60,
    tags: ['Database', 'MongoDB']
  },
  {
    id: 'task-104',
    title: 'Finalize navigation specs in design file',
    description: 'Export finalized SVG iconography and verify color contrast ratios.',
    priority: 'Medium',
    category: 'Design',
    dueDate: offsetDate(1), // Tomorrow
    completed: false,
    completedAt: null,
    estimatedMinutes: 45,
    tags: ['Figma']
  },
  {
    id: 'task-105',
    title: 'Renew domain registration and SSL certificates',
    description: 'Verify DNS propagation and check automated renewal webhooks.',
    priority: 'High',
    category: 'Work',
    dueDate: offsetDate(-2), // Overdue
    completed: false,
    completedAt: null,
    estimatedMinutes: 20,
    tags: ['DevOps']
  },
  {
    id: 'task-106',
    title: 'Complete 30-minute afternoon walk',
    description: 'Take a break away from screens to recharge focus.',
    priority: 'Low',
    category: 'Health',
    dueDate: offsetDate(0), // Today
    completed: true,
    completedAt: offsetDate(0),
    estimatedMinutes: 30,
    tags: ['Wellness']
  },
  {
    id: 'task-107',
    title: 'Review monthly cloud infrastructure bill',
    description: 'Check unused cache instances and optimize database provisions.',
    priority: 'Medium',
    category: 'Finance',
    dueDate: offsetDate(3), // Upcoming
    completed: false,
    completedAt: null,
    estimatedMinutes: 25,
    tags: ['Finance']
  },
  {
    id: 'task-108',
    title: 'Refactor chart tooltips to match neutral design system',
    description: 'Ensure typography scale and padding match the global token scale.',
    priority: 'Low',
    category: 'Development',
    dueDate: offsetDate(4), // Upcoming
    completed: false,
    completedAt: null,
    estimatedMinutes: 40,
    tags: ['Refactor']
  },
  {
    id: 'task-109',
    title: 'Submit quarterly estimated tax payment receipt',
    description: 'Archive payment confirmation in the accounting folder.',
    priority: 'High',
    category: 'Finance',
    dueDate: offsetDate(-1), // Overdue
    completed: false,
    completedAt: null,
    estimatedMinutes: 15,
    tags: ['Taxes']
  },
  {
    id: 'task-110',
    title: 'Read chapter 4 of System Design Interview',
    description: 'Focus on rate limiter algorithms and distributed token buckets.',
    priority: 'Low',
    category: 'Personal',
    dueDate: offsetDate(2), // Upcoming
    completed: true,
    completedAt: offsetDate(0),
    estimatedMinutes: 45,
    tags: ['Learning']
  }
];
