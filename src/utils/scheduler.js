/**
 * Date helpers, open-slot finder, and deterministic local fallback rescheduler.
 */

const CANDIDATE_TIMES = ['09:00', '11:00', '14:00', '16:00', '19:00', '21:00'];

export function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date, days) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function getWeekStartDate(baseDate = new Date()) {
  const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const day = d.getDay(); // 0 = Sun, 1 = Mon ...
  const diffToMon = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMon);
  return d;
}

export function getCurrentWeekDays(baseDate = new Date()) {
  const monday = getWeekStartDate(baseDate);
  const todayStr = toDateString(baseDate);

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i);
    const dateStr = toDateString(date);
    return {
      dateStr,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      shortDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
    };
  });
}

export function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/**
 * Finds available study slots from today through the end of the current week (or next 7 days if weekend).
 */
export function findOpenStudySlots(sessions, baseDate = new Date()) {
  const todayStr = toDateString(baseDate);
  const weekDays = getCurrentWeekDays(baseDate);
  let candidateDays = weekDays.filter((d) => d.dateStr >= todayStr);

  // If it's Sunday evening or few days left, also include early next week
  if (candidateDays.length < 3) {
    const extraDays = Array.from({ length: 4 }, (_, i) => {
      const date = addDays(baseDate, i + 1);
      return {
        dateStr: toDateString(date),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        shortDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    });
    const seen = new Set(candidateDays.map((d) => d.dateStr));
    for (const d of extraDays) {
      if (!seen.has(d.dateStr)) candidateDays.push(d);
    }
  }

  const openSlots = [];

  for (const day of candidateDays) {
    const daySessions = sessions.filter(
      (s) => s.scheduledDate === day.dateStr && s.status !== 'missed'
    );
    const takenTimes = new Set(daySessions.map((s) => s.startTime));
    const dayPlannedMinutes = daySessions.reduce(
      (sum, s) => sum + (Number(s.durationMinutes) || 0),
      0
    );

    for (const time of CANDIDATE_TIMES) {
      if (!takenTimes.has(time)) {
        openSlots.push({
          date: day.dateStr,
          dayLabel: `${day.dayName}, ${day.shortDate}`,
          startTime: time,
          dayPlannedMinutes,
        });
      }
    }
  }

  return openSlots;
}

/**
 * Deterministic local fallback if Gemini API is unavailable or key is not set.
 */
export function buildLocalReschedulePlan(missedSession, tasks, sessions, baseDate = new Date()) {
  const openSlots = findOpenStudySlots(sessions, baseDate);
  const linkedTask = tasks.find((t) => t.id === missedSession.taskId);

  // Prefer slots on or before the task's due date, and prefer days with lighter workload (< 180 min)
  const beforeDue = linkedTask?.dueDate
    ? openSlots.filter((s) => s.date <= linkedTask.dueDate)
    : openSlots;

  const pool = beforeDue.length > 0 ? beforeDue : openSlots;
  const sortedPool = [...pool].sort((a, b) => {
    // Prefer days with under 3 hours scheduled, then earliest date/time
    const aHeavy = a.dayPlannedMinutes >= 180 ? 1 : 0;
    const bHeavy = b.dayPlannedMinutes >= 180 ? 1 : 0;
    if (aHeavy !== bHeavy) return aHeavy - bHeavy;
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  const best = sortedPool[0] || {
    date: toDateString(addDays(baseDate, 1)),
    startTime: '16:00',
    dayPlannedMinutes: 0,
  };

  return {
    source: 'local-fallback',
    newDate: best.date,
    newStartTime: best.startTime,
    newDurationMinutes: missedSession.durationMinutes || 60,
    summary: `Reschedule "${missedSession.title}" to ${best.date} at ${formatTime12h(best.startTime)}.`,
    reason: linkedTask
      ? `Selected the earliest balanced open slot before your ${linkedTask.course} deadline (${linkedTask.dueDate}).`
      : 'Selected the earliest open study block with balanced daily workload.',
  };
}
