import { Plus, Sparkles, ArrowRight, Check, Clock, CalendarDays } from 'lucide-react';
import StatsCards from '../components/dashboard/StatsCards';
import MissedAlert from '../components/dashboard/MissedAlert';
import { getPriorityBadgeClasses, formatRelativeDue } from '../utils/priority';
import { toDateString, formatTime12h } from '../utils/scheduler';
import { DEMO_STUDENT } from '../data/demoData';

export default function DashboardPage({
  tasks,
  sessions,
  onNavigate,
  onOpenNewTask,
  onToggleTaskDone,
  onUpdateSessionStatus,
  onOpenReschedule,
  onOpenNewSession,
}) {
  const today = new Date();
  const todayStr = toDateString(today);
  const formattedToday = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const topTasks = activeTasks.slice(0, 5);
  const missedSessions = sessions.filter((s) => s.status === 'missed');
  const todaySessions = sessions
    .filter((s) => s.scheduledDate === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950 text-white">
              {DEMO_STUDENT.semester}
            </span>
            <span className="text-xs font-medium text-slate-500">{formattedToday}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back, {DEMO_STUDENT.name.split(' ')[0]}
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Your academic priorities, upcoming deadlines, and study schedule at a glance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('assistant')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-900 bg-white hover:bg-blue-50 border border-blue-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-blue-700" />
            Ask AI Assistant
          </button>
          <button
            onClick={onOpenNewTask}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <StatsCards tasks={tasks} sessions={sessions} />

      {/* Missed Study Session Alert */}
      <MissedAlert missedSessions={missedSessions} onAdaptSession={onOpenReschedule} />

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Priority Tasks */}
        <section className="lg:col-span-2 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Priority Deadlines</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ranked automatically by urgency, importance, and estimated effort
              </p>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topTasks.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <p className="text-sm font-medium text-slate-600">
                  All tasks are completed! Click &ldquo;Add Task&rdquo; to plan your next
                  assignment.
                </p>
                <button
                  onClick={onOpenNewTask}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Task
                </button>
              </div>
            ) : (
              topTasks.map((task) => (
                <div
                  key={task.id}
                  className="px-5 sm:px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => onToggleTaskDone(task.id)}
                      title="Mark completed"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white hover:border-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <Check className="h-3 w-3 text-transparent hover:text-blue-700" />
                    </button>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold tracking-wide text-blue-950 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                          {task.course}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getPriorityBadgeClasses(
                            task.priorityLevel
                          )}`}
                        >
                          {task.priorityLevel} · {task.priorityScore}
                        </span>
                        {task.status === 'in_progress' && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200">
                            In Progress
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm font-semibold text-slate-900 truncate">
                        {task.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`font-semibold ${
                            task.daysLeft <= 1
                              ? 'text-rose-600'
                              : task.daysLeft <= 3
                                ? 'text-amber-700'
                                : 'text-slate-600'
                          }`}
                        >
                          {formatRelativeDue(task.dueDate)}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{task.estimatedHours}h effort</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Priority Score Bar */}
                  <div className="hidden sm:flex flex-col items-end shrink-0 w-24">
                    <span className="text-xs font-bold text-slate-700 tabular-nums">
                      {task.priorityScore}/100
                    </span>
                    <div className="mt-1.5 w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          task.priorityScore >= 75
                            ? 'bg-rose-500'
                            : task.priorityScore >= 50
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                        }`}
                        style={{ width: `${task.priorityScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Today's Study Blocks */}
        <section className="rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <h3 className="text-base font-bold text-slate-900">Today&apos;s Study Plan</h3>
              <p className="text-xs text-slate-500 mt-0.5">{todayStr}</p>
            </div>
            <button
              onClick={() => onNavigate('planner')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Full week
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="p-4 flex-1 space-y-3">
            {todaySessions.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <CalendarDays className="h-9 w-9 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-500">No study blocks planned for today yet.</p>
                <button
                  onClick={() => onOpenNewSession(null, todayStr)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Schedule Today
                </button>
              </div>
            ) : (
              todaySessions.map((session) => (
                <div
                  key={session.id}
                  className={`rounded-xl border border-l-4 p-3.5 transition-colors ${
                    session.status === 'completed'
                      ? 'bg-emerald-50/50 border-emerald-200 border-l-emerald-600'
                      : session.status === 'missed'
                        ? 'bg-rose-50/60 border-rose-200 border-l-rose-600'
                        : 'bg-slate-50/80 border-slate-200 border-l-blue-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-950">{session.course}</span>
                    <span className="inline-flex items-center gap-1 font-medium text-slate-500 tabular-nums">
                      <Clock className="h-3 w-3" />
                      {formatTime12h(session.startTime)} · {session.durationMinutes}m
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-slate-900">{session.title}</p>

                  {session.status === 'planned' && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => onUpdateSessionStatus(session.id, 'completed')}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => onUpdateSessionStatus(session.id, 'missed')}
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        Missed
                      </button>
                    </div>
                  )}

                  {session.status === 'missed' && (
                    <button
                      onClick={() => onOpenReschedule(session)}
                      className="mt-3 w-full py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      Adapt Schedule
                    </button>
                  )}

                  {session.status === 'completed' && (
                    <span className="mt-2 inline-block text-xs font-semibold text-emerald-700">
                      ✓ Completed
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
