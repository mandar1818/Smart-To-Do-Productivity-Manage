export function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFriendlyDate(dateStr) {
  if (!dateStr) return 'No due date';
  const todayStr = getTodayString();
  
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  if (dateStr === todayStr) {
    return 'Today';
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  
  if (dateStr === tomorrowStr) {
    return 'Tomorrow';
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (dateStr === yesterdayStr) {
    return 'Yesterday';
  }

  return targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: targetDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

export function isTaskOverdue(dateStr, isCompleted) {
  if (!dateStr || isCompleted) return false;
  const todayStr = getTodayString();
  return dateStr < todayStr;
}

export function isTaskToday(dateStr) {
  if (!dateStr) return false;
  return dateStr === getTodayString();
}

export function isTaskUpcoming(dateStr) {
  if (!dateStr) return false;
  const todayStr = getTodayString();
  return dateStr > todayStr;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function getFormattedTodayDisplay() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
