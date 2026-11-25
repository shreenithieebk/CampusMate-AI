import { AlertCircle, ArrowRight } from 'lucide-react';
import { formatTime12h } from '../../utils/scheduler';

export default function MissedAlert({ missedSessions, onAdaptSession }) {
  if (!missedSessions || missedSessions.length === 0) return null;

  const firstMissed = missedSessions[0];

  return (
    <div className="rounded-2xl bg-white border border-rose-200 border-l-4 border-l-rose-600 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 shrink-0">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              {missedSessions.length === 1
                ? '1 Missed Study Session Detected'
                : `${missedSessions.length} Missed Study Sessions Detected`}
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Action Needed
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            <span className="font-semibold text-slate-900">
              [{firstMissed.course}] {firstMissed.title}
            </span>{' '}
            ({firstMissed.scheduledDate} at {formatTime12h(firstMissed.startTime)}) can be moved to
            an open slot this week.
          </p>
        </div>
      </div>

      <button
        onClick={() => onAdaptSession(firstMissed)}
        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-xs shrink-0 transition-colors cursor-pointer"
      >
        Adapt Schedule
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
