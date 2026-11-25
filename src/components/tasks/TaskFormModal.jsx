import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toDateString, addDays } from '../../utils/scheduler';

const IMPORTANCE_LABELS = {
  1: '1 · Low',
  2: '2 · Minor',
  3: '3 · Normal',
  4: '4 · High',
  5: '5 · Critical',
};

export default function TaskFormModal({ isOpen, onClose, onSave, initialTask }) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState(toDateString(addDays(new Date(), 2)));
  const [importance, setImportance] = useState(3);
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [status, setStatus] = useState('todo');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setCourse(initialTask.course || '');
      setDueDate(initialTask.dueDate || toDateString(addDays(new Date(), 2)));
      setImportance(initialTask.importance || 3);
      setEstimatedHours(initialTask.estimatedHours || 2);
      setStatus(initialTask.status || 'todo');
      setNotes(initialTask.notes || '');
    } else {
      setTitle('');
      setCourse('');
      setDueDate(toDateString(addDays(new Date(), 2)));
      setImportance(3);
      setEstimatedHours(2);
      setStatus('todo');
      setNotes('');
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !course.trim() || !dueDate) return;

    onSave({
      id: initialTask?.id || `task-${Date.now()}`,
      title: title.trim(),
      course: course.trim().toUpperCase(),
      dueDate,
      importance: Number(importance),
      estimatedHours: Number(estimatedHours),
      status,
      notes: notes.trim(),
      createdAt: initialTask?.createdAt || toDateString(new Date()),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-lg font-bold text-slate-900">
            {initialTask ? 'Edit Academic Task' : 'Add Academic Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Task / Assignment Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Operating Systems Lab 3"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g., CS 301"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Deadline Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Importance Level ({IMPORTANCE_LABELS[importance]})
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setImportance(val)}
                  className={`py-2 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
                    importance === val
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estimated Effort (Hours)
              </label>
              <input
                type="number"
                min="0.5"
                max="30"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key chapters, rubric details, or deliverables..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
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
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
