/**
 * Deterministic task prioritisation engine (0-100 score).
 * Combines Urgency (50 pts), Importance (35 pts), and Estimated Effort (15 pts).
 */

export function getDaysUntilDue(dueDateStr) {
  if (!dueDateStr) return 14;
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [y, m, d] = dueDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  return Math.round((target - startToday) / (1000 * 60 * 60 * 24));
}

export function calculatePriority(task) {
  if (task.status === 'done') {
    return {
      score: 0,
      level: 'Completed',
      breakdown: { urgency: 0, importance: 0, effort: 0 },
    };
  }

  const daysLeft = getDaysUntilDue(task.dueDate);

  // 1. Urgency (0 - 50 pts)
  let urgency = 5;
  if (daysLeft <= 0) urgency = 50;
  else if (daysLeft === 1) urgency = 44;
  else if (daysLeft === 2) urgency = 38;
  else if (daysLeft <= 4) urgency = 30;
  else if (daysLeft <= 7) urgency = 20;
  else if (daysLeft <= 14) urgency = 12;

  // 2. Importance (0 - 35 pts), based on 1..5 scale
  const importanceVal = Math.min(5, Math.max(1, Number(task.importance) || 3));
  const importance = Math.round((importanceVal / 5) * 35);

  // 3. Estimated Effort (0 - 15 pts) — larger tasks need earlier momentum
  const hours = Math.max(0.5, Number(task.estimatedHours) || 1);
  const effort = Math.min(15, Math.round((hours / 5) * 15));

  const score = Math.min(100, urgency + importance + effort);

  let level = 'Low';
  if (score >= 75) level = 'High';
  else if (score >= 50) level = 'Medium';

  return {
    score,
    level,
    daysLeft,
    breakdown: { urgency, importance, effort },
  };
}

export function sortTasksByPriority(tasks) {
  return [...tasks]
    .map((task) => {
      const priority = calculatePriority(task);
      return {
        ...task,
        priorityScore: priority.score,
        priorityLevel: priority.level,
        daysLeft: priority.daysLeft,
        priorityBreakdown: priority.breakdown,
      };
    })
    .sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    });
}

export function getPriorityBadgeClasses(level) {
  switch (level) {
    case 'High':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Medium':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Low':
      return 'bg-sky-50 text-sky-700 border-sky-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
}

export function formatRelativeDue(dueDateStr) {
  const days = getDaysUntilDue(dueDateStr);
  if (days < 0) return `Overdue by ${Math.abs(days)}d`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 7) return `Due in ${days}d`;
  return `Due ${dueDateStr}`;
}
