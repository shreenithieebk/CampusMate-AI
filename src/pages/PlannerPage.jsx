import { Plus, Check, AlertTriangle, Trash2, RefreshCw, Clock } from 'lucide-react';
import { getCurrentWeekDays, formatTime12h } from '../utils/scheduler';

export default function PlannerPage({
  sessions,
  onOpenNewSession,
  onUpdateSessionStatus,
  onDeleteSession,
  onOpenReschedule,
}) {
  const weekDays = getCurrentWeekDays(new Date());

  const plannedCount = sessions.filter((s) => s.status === 'planned').length;
  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const missedCount = sessions.filter((s) => s.status === 'missed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Weekly Study Planner</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Schedule focused study blocks and mark sessions completed or missed to adapt your
            week.
          </p>
        </div>

        <button
          onClick={() => onOpenNewSession(null, weekDays.find((d) => d.isToday)?.dateStr)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Schedule Study Block
        </button>
      </div>

      {/* Status Summary Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200 tabular-nums">
          <span className="h-2 w-2 rounded-full bg-blue-700" />
          {plannedCount} Planned
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 tabular-nums">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          {completedCount} Completed
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border tabular-nums ${
            missedCount > 0
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              missedCount > 0 ? 'bg-rose-600' : 'bg-slate-400'
            }`}
          />
          {missedCount} Missed
        </span>
      </div>

      {/* 7-Day Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {weekDays.map((day) => {
          const daySessions = sessions
            .filter((s) => s.scheduledDate === day.dateStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          const totalMinutes = daySessions
            .filter((s) => s.status !== 'missed')
            .reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);

          return (
            <div
              key={day.dateStr}
              className={`rounded-2xl border bg-white flex flex-col min-h-[280px] shadow-[0_1px_3px_rgba(15,23,42,0.05)] overflow-hidden ${
                day.isToday
                  ? 'border-blue-800 ring-2 ring-blue-800/15'
                  : 'border-slate-200/90'
              }`}
            >
              {/* Day Header */}
              <div
                className={`px-3.5 py-3 border-b flex items-center justify-between ${
                  day.isToday
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50/80 text-slate-900 border-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">{day.dayName}</span>
                    {day.isToday && (
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/40 text-white border border-white/20">
                        Today
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${day.isToday ? 'text-blue-100' : 'text-slate-500'}`}>
                    {day.shortDate}
                  </p>
                </div>

                <button
                  onClick={() => onOpenNewSession(null, day.dateStr)}
                  title={`Add study block on ${day.dayName}`}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    day.isToday
                      ? 'text-blue-100 hover:text-white hover:bg-white/15'
                      : 'text-slate-500 hover:text-blue-900 hover:bg-blue-100/70'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Sessions List */}
              <div className="p-2.5 flex-1 space-y-2.5">
                {daySessions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-10">No study blocks</p>
                ) : (
                  daySessions.map((session) => (
                    <div
                      key={session.id}
                      className={`rounded-xl border border-l-3 p-2.5 text-xs space-y-1.5 ${
                        session.status === 'completed'
                          ? 'bg-emerald-50/60 border-emerald-200 border-l-emerald-600'
                          : session.status === 'missed'
                            ? 'bg-rose-50/80 border-rose-200 border-l-rose-600'
                            : 'bg-slate-50/80 border-slate-200 border-l-blue-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-blue-950 truncate">{session.course}</span>
                        <button
                          onClick={() => onDeleteSession(session.id)}
                          title="Delete session"
                          className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <p className="font-semibold text-slate-900 leading-snug line-clamp-2">
                        {session.title}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 tabular-nums">
                        <Clock className="h-3 w-3" />
                        {formatTime12h(session.startTime)} · {session.durationMinutes}m
                      </div>

                      {/* Controls */}
                      {session.status === 'planned' && (
                        <div className="pt-1 flex gap-1.5">
                          <button
                            onClick={() => onUpdateSessionStatus(session.id, 'completed')}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-1 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                          >
                            <Check className="h-3 w-3" />
                            Done
                          </button>
                          <button
                            onClick={() => onUpdateSessionStatus(session.id, 'missed')}
                            className="flex-1 inline-flex items-center justify-center gap-1 py-1 rounded-lg font-semibold bg-white text-rose-700 border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Miss
                          </button>
                        </div>
                      )}

                      {session.status === 'completed' && (
                        <div className="pt-0.5 flex items-center justify-between">
                          <span className="font-semibold text-emerald-700">✓ Completed</span>
                          <button
                            onClick={() => onUpdateSessionStatus(session.id, 'planned')}
                            className="text-[11px] text-slate-500 hover:underline cursor-pointer"
                          >
                            Undo
                          </button>
                        </div>
                      )}

                      {session.status === 'missed' && (
                        <button
                          onClick={() => onOpenReschedule(session)}
                          className="mt-1 w-full inline-flex items-center justify-center gap-1 py-1.5 rounded-lg font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Adapt Schedule
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Day Footer */}
              <div className="px-3.5 py-2 border-t border-slate-100 bg-slate-50/40 text-[11px] text-slate-500 flex justify-between">
                <span>Study time</span>
                <span className="font-bold text-slate-700 tabular-nums">
                  {(totalMinutes / 60).toFixed(1)}h
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
