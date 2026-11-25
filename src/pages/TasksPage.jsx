import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, Info } from 'lucide-react';
import TaskCard from '../components/tasks/TaskCard';

export default function TasksPage({
  tasks,
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskDone,
  onScheduleTask,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active'); // all | active | done
  const [courseFilter, setCourseFilter] = useState('ALL');

  const courses = useMemo(() => {
    const set = new Set(tasks.map((t) => t.course).filter(Boolean));
    return ['ALL', ...Array.from(set).sort()];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter === 'active' && task.status === 'done') return false;
      if (statusFilter === 'done' && task.status !== 'done') return false;
      if (courseFilter !== 'ALL' && task.course !== courseFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hit =
          task.title.toLowerCase().includes(q) ||
          task.course.toLowerCase().includes(q) ||
          (task.notes || '').toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [tasks, statusFilter, courseFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Academic Tasks</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Track coursework, deadlines, and priority scores in one organized view.
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Priority Scoring Explainer */}
      <div className="rounded-xl bg-blue-50/70 border border-blue-200/80 px-4 py-2.5 flex items-center gap-2.5 text-xs text-blue-950">
        <Info className="h-4 w-4 text-blue-700 shrink-0" />
        <span>
          <strong className="font-semibold">Automatic Priority Score (0–100):</strong> Urgency (50
          pts) + Importance (35 pts) + Effort (15 pts). High-priority tasks stay pinned at the top.
        </span>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl bg-white border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(15,23,42,0.05)] flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments, courses, or notes..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter Tabs */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            {[
              { id: 'active', label: 'Active' },
              { id: 'done', label: 'Completed' },
              { id: 'all', label: 'All' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-white text-blue-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Course Filter */}
          <div className="inline-flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-700"
            >
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Courses' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-10 text-center">
            <p className="text-sm font-medium text-slate-600">
              No matching tasks found for the current filters.
            </p>
            <button
              onClick={onOpenNewTask}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Create New Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleDone={onToggleTaskDone}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onSchedule={onScheduleTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
