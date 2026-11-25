import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toDateString } from '../../utils/scheduler';

const TIME_OPTIONS = ['09:00', '11:00', '14:00', '16:00', '19:00', '21:00'];

export default function SessionModal({
  isOpen,
  onClose,
  onSave,
  tasks,
  defaultTask,
  defaultDate,
}) {
  const activeTasks = tasks.filter((t) => t.status !== 'done');
  const [taskId, setTaskId] = useState('');
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('STUDY');
  const [scheduledDate, setScheduledDate] = useState(toDateString(new Date()));
  const [startTime, setStartTime] = useState('16:00');
  const [durationMinutes, setDurationMinutes] = useState(60);

  useEffect(() => {
    if (!isOpen) return;
    if (defaultTask) {
      setTaskId(defaultTask.id);
      setTitle(defaultTask.title);
      setCourse(defaultTask.course);
    } else if (activeTasks.length > 0) {
      setTaskId(activeTasks[0].id);
      setTitle(activeTasks[0].title);
      setCourse(activeTasks[0].course);
    } else {
      setTaskId('');
      setTitle('');
      setCourse('GENERAL');
    }
    setScheduledDate(defaultDate || toDateString(new Date()));
    setStartTime('16:00');
    setDurationMinutes(60);
  }, [isOpen, defaultTask, defaultDate]);

  if (!isOpen) return null;

  const handleTaskChange = (selectedId) => {
    setTaskId(selectedId);
    const found = tasks.find((t) => t.id === selectedId);
    if (found) {
      setTitle(found.title);
      setCourse(found.course);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !scheduledDate) return;

    onSave({
      id: `sess-${Date.now()}`,
      taskId: taskId || null,
      title: title.trim(),
      course: course.trim() || 'STUDY',
      scheduledDate,
      startTime,
      durationMinutes: Number(durationMinutes),
      status: 'planned',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-lg font-bold text-slate-900">Schedule Study Block</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTasks.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Link to Academic Task
              </label>
              <select
                value={taskId}
                onChange={(e) => handleTaskChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="">Custom Study Block</option>
                {activeTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.course}] {t.title} (Due {t.dueDate})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Session Focus *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Practice Graph Traversal Problems"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                    durationMinutes === mins
                      ? 'bg-blue-900 text-white border-blue-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-xs cursor-pointer"
            >
              Add to Planner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
