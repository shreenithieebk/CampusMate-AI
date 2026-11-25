import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Sparkles,
  GraduationCap,
  RotateCcw,
} from 'lucide-react';
import { DEMO_STUDENT } from '../../data/demoData';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'planner', label: 'Weekly Planner', icon: CalendarDays },
  { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
];

export default function Sidebar({
  activeTab,
  onSelectTab,
  activeTaskCount,
  missedSessionCount,
  onResetDemo,
}) {
  const initials = DEMO_STUDENT.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <>
      {/* Desktop Navy Sidebar */}
      <aside className="hidden md:flex md:w-68 md:flex-col md:fixed md:inset-y-0 bg-[#0B1736] text-slate-100 border-r border-slate-800/80 z-20">
        {/* Brand */}
        <div className="flex items-center gap-3.5 px-6 py-5 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-950/50">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-none">
              CampusMate AI
            </h1>
            <p className="mt-1 text-[11px] font-medium text-blue-200/75">
              Academic Planner &amp; Copilot
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-widest text-blue-200/50">
            Workspace
          </p>
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-950/40'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-blue-300/75'
                      }`}
                    />
                    {item.label}
                  </span>

                  {item.id === 'tasks' && activeTaskCount > 0 && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold tabular-nums ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-blue-100'
                      }`}
                    >
                      {activeTaskCount}
                    </span>
                  )}

                  {item.id === 'planner' && missedSessionCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-rose-500 text-white shadow-xs">
                      {missedSessionCount} missed
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Demo Student Profile Footer */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#08122B]/60">
          <div className="rounded-xl bg-white/6 border border-white/10 p-3.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Demo Student
              </span>
              <span className="text-[11px] text-slate-400">{DEMO_STUDENT.semester}</span>
            </div>

            <div className="mt-2.5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-600/30 border border-blue-400/30 text-blue-100 flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{DEMO_STUDENT.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{DEMO_STUDENT.major}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onResetDemo}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Demo Data
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-20 bg-[#0B1736] text-white px-4 py-3 flex items-center justify-between shadow-sm border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm block leading-tight">CampusMate AI</span>
            <span className="text-[11px] text-blue-200/75">{DEMO_STUDENT.name} · Demo</span>
          </div>
        </div>
        <button
          onClick={onResetDemo}
          title="Reset Demo Data"
          className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/15 text-slate-100 px-2.5 py-1.5 rounded-lg border border-white/15 cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-around py-1.5 px-2 shadow-[0_-4px_12px_rgba(15,23,42,0.06)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                isActive ? 'text-blue-800 bg-blue-50' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label.replace('Weekly ', '')}</span>
              {item.id === 'planner' && missedSessionCount > 0 && (
                <span className="absolute top-1 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
