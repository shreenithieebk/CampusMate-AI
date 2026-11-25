import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';

export default function StatsCards({ tasks, sessions }) {
  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const completedTasks = tasks.filter((t) => t.status === 'done');
  const urgentTasks = activeTasks.filter((t) => t.daysLeft <= 2);

  const plannedOrDoneMinutes = sessions
    .filter((s) => s.status !== 'missed')
    .reduce((sum, s) => sum + (Number(s.durationMinutes) || 0), 0);
  const studyHours = (plannedOrDoneMinutes / 60).toFixed(1);

  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const cards = [
    {
      label: 'Active Tasks',
      value: activeTasks.length,
      sub: `${completedTasks.length} completed`,
      icon: ListTodo,
      accent: 'bg-blue-50 text-blue-800 border-blue-100',
      barColor: 'bg-blue-700',
    },
    {
      label: 'Due in 48 Hours',
      value: urgentTasks.length,
      sub: urgentTasks.length > 0 ? 'Needs immediate focus' : 'No urgent crunch',
      icon: AlertTriangle,
      accent:
        urgentTasks.length > 0
          ? 'bg-rose-50 text-rose-700 border-rose-100'
          : 'bg-slate-100 text-slate-600 border-slate-200',
    },
    {
      label: 'Weekly Study Plan',
      value: `${studyHours}h`,
      sub: `${sessions.filter((s) => s.status === 'planned').length} blocks remaining`,
      icon: Clock,
      accent: 'bg-indigo-50 text-indigo-800 border-indigo-100',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      sub: `${tasks.length} total assignments`,
      icon: CheckCircle2,
      accent: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      progress: completionRate,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:shadow-md hover:border-slate-300/80 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums leading-none">
                  {card.value}
                </p>
                <p className="mt-2 text-xs font-medium text-slate-500">{card.sub}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${card.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {typeof card.progress === 'number' && (
              <div className="mt-3.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
