import { Check, Pencil, Trash2, CalendarPlus, Clock, Flag } from 'lucide-react';
import { getPriorityBadgeClasses, formatRelativeDue } from '../../utils/priority';

export default function TaskCard({ task, onToggleDone, onEdit, onDelete, onSchedule }) {
  const isDone = task.status === 'done';

  const statusLabel =
    task.status === 'done'
      ? 'Completed'
      : task.status === 'in_progress'
        ? 'In Progress'
        : 'To Do';

  const statusClasses =
    task.status === 'done'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : task.status === 'in_progress'
        ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
        : 'bg-slate-100 text-slate-600 border-slate-200';

  const urgencyTextClass = isDone
    ? 'text-slate-400'
    : task.daysLeft <= 1
      ? 'text-rose-700 bg-rose-50 border-rose-200'
      : task.daysLeft <= 3
        ? 'text-amber-700 bg-amber-50 border-amber-200'
        : 'text-slate-600 bg-slate-50 border-slate-200';

  return (
    <div
      className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all hover:shadow-md ${
        isDone ? 'border-slate-200/80 opacity-80' : 'border-slate-200/90 hover:border-blue-200'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Completion Checkbox */}
        <button
          onClick={() => onToggleDone(task.id)}
          title={isDone ? 'Mark as active' : 'Mark as completed'}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
            isDone
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 bg-white hover:border-blue-700 hover:bg-blue-50'
          }`}
        >
          {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
        </button>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide bg-blue-50 text-blue-950 border border-blue-200/80">
              {task.course}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border tabular-nums ${getPriorityBadgeClasses(
                task.priorityLevel
              )}`}
            >
              {task.priorityLevel}
              {!isDone && <span className="opacity-80">· {task.priorityScore}/100</span>}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusClasses}`}
            >
              {statusLabel}
            </span>
          </div>

          <h3
            className={`text-base font-semibold text-slate-900 ${
              isDone ? 'line-through text-slate-500' : ''
            }`}
          >
            {task.title}
          </h3>

          {task.notes && (
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">{task.notes}</p>
          )}

          {/* Meta Row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-semibold border ${urgencyTextClass}`}
            >
              {formatRelativeDue(task.dueDate)}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {task.estimatedHours}h effort
            </span>
            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
              <Flag className="h-3.5 w-3.5 text-slate-400" />
              Importance {task.importance}/5
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {!isDone && (
            <button
              onClick={() => onSchedule(task)}
              title="Add study block to Weekly Planner"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Plan
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            title="Edit task"
            className="p-2 rounded-xl text-slate-400 hover:text-blue-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Plan Button */}
      {!isDone && (
        <div className="mt-3 pt-3 border-t border-slate-100 sm:hidden">
          <button
            onClick={() => onSchedule(task)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            Schedule Study Block
          </button>
        </div>
      )}
    </div>
  );
}
