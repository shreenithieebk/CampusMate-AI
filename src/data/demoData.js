import { toDateString, addDays, getWeekStartDate } from '../utils/scheduler.js';

export const DEMO_STUDENT = {
  name: 'Alex Rivera',
  major: 'B.S. Computer Science (Junior)',
  semester: 'Fall 2026',
  dailyGoalHours: 4,
};

/**
 * Generates fresh demo tasks & study sessions relative to today's date
 * so hackathon judges always see realistic upcoming deadlines and a missed session ready to adapt.
 */
export function createDemoSeed() {
  const today = new Date();
  const todayStr = toDateString(today);
  const weekStart = getWeekStartDate(today);

  // Pick a past day in the current week for a missed session; if today is Monday, use today's morning slot
  const yesterday = addDays(today, -1);
  const missedDateStr =
    yesterday >= weekStart ? toDateString(yesterday) : todayStr;

  const tomorrowStr = toDateString(addDays(today, 1));
  const plus2Str = toDateString(addDays(today, 2));
  const plus3Str = toDateString(addDays(today, 3));
  const plus4Str = toDateString(addDays(today, 4));
  const plus6Str = toDateString(addDays(today, 6));

  const tasks = [
    {
      id: 'task-1',
      title: 'Binary Trees & Graph Traversal Lab',
      course: 'CS 301',
      dueDate: tomorrowStr,
      importance: 5,
      estimatedHours: 3,
      status: 'in_progress',
      notes: 'Implement BFS/DFS shortest-path test cases and submit report.',
      createdAt: todayStr,
    },
    {
      id: 'task-2',
      title: 'Linear Algebra Eigenvalues Problem Set',
      course: 'MATH 240',
      dueDate: plus2Str,
      importance: 4,
      estimatedHours: 2.5,
      status: 'todo',
      notes: 'Problems 4.1 to 4.18, verify diagonalization proofs.',
      createdAt: todayStr,
    },
    {
      id: 'task-3',
      title: 'Technical Ethics Case Study Draft',
      course: 'ENG 205',
      dueDate: plus4Str,
      importance: 3,
      estimatedHours: 2,
      status: 'todo',
      notes: '1,200-word draft covering algorithmic fairness in hiring.',
      createdAt: todayStr,
    },
    {
      id: 'task-4',
      title: 'Wave Optics Lab Analysis & Graphs',
      course: 'PHYS 180',
      dueDate: plus3Str,
      importance: 4,
      estimatedHours: 3,
      status: 'todo',
      notes: 'Plot interference fringe intensity and calculate error bars.',
      createdAt: todayStr,
    },
    {
      id: 'task-5',
      title: 'Database Normalization Quiz Prep',
      course: 'CS 340',
      dueDate: plus6Str,
      importance: 3,
      estimatedHours: 1.5,
      status: 'todo',
      notes: 'Review 3NF and BCNF decomposition examples.',
      createdAt: todayStr,
    },
    {
      id: 'task-6',
      title: 'Discrete Math Induction Worksheet',
      course: 'CS 210',
      dueDate: todayStr,
      importance: 3,
      estimatedHours: 1.5,
      status: 'done',
      notes: 'Completed and uploaded to Canvas.',
      createdAt: todayStr,
    },
  ];

  // Build weekly sessions inside the current Mon-Sun window
  const monStr = toDateString(weekStart);
  const tueStr = toDateString(addDays(weekStart, 1));
  const wedStr = toDateString(addDays(weekStart, 2));
  const thuStr = toDateString(addDays(weekStart, 3));
  const friStr = toDateString(addDays(weekStart, 4));
  const satStr = toDateString(addDays(weekStart, 5));

  const sessions = [
    {
      id: 'sess-1',
      taskId: 'task-6',
      title: 'Discrete Math Induction Review',
      course: 'CS 210',
      scheduledDate: monStr,
      startTime: '14:00',
      durationMinutes: 60,
      status: 'completed',
    },
    {
      id: 'sess-2',
      taskId: 'task-2',
      title: 'Eigenvalues Problem Set Block',
      course: 'MATH 240',
      scheduledDate: missedDateStr,
      startTime: '09:00',
      durationMinutes: 90,
      status: 'missed',
    },
    {
      id: 'sess-3',
      taskId: 'task-1',
      title: 'BFS/DFS Lab Implementation',
      course: 'CS 301',
      scheduledDate: todayStr,
      startTime: '19:00',
      durationMinutes: 90,
      status: 'planned',
    },
    {
      id: 'sess-4',
      taskId: 'task-4',
      title: 'Wave Optics Data Plotting',
      course: 'PHYS 180',
      scheduledDate: todayStr === wedStr ? thuStr : wedStr,
      startTime: '16:00',
      durationMinutes: 60,
      status: 'planned',
    },
    {
      id: 'sess-5',
      taskId: 'task-3',
      title: 'Ethics Essay Outline & Draft',
      course: 'ENG 205',
      scheduledDate: friStr,
      startTime: '11:00',
      durationMinutes: 90,
      status: 'planned',
    },
    {
      id: 'sess-6',
      taskId: 'task-5',
      title: 'Normalization Practice Problems',
      course: 'CS 340',
      scheduledDate: satStr,
      startTime: '14:00',
      durationMinutes: 60,
      status: 'planned',
    },
  ];

  // Deduplicate if two demo dates collide on Monday/Wednesday
  if (tueStr === missedDateStr) {
    // fine
  }

  return { tasks, sessions };
}
