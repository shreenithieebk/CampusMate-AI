import { useState, useEffect } from 'react';
import { X, Sparkles, Cpu, CalendarCheck, Loader2, AlertCircle } from 'lucide-react';
import {
  findOpenStudySlots,
  buildLocalReschedulePlan,
  toDateString,
  formatTime12h,
} from '../../utils/scheduler';

export default function RescheduleModal({
  missedSession,
  tasks,
  sessions,
  onClose,
  onApply,
}) {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [fallbackNotice, setFallbackNotice] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('16:00');
  const [newDurationMinutes, setNewDurationMinutes] = useState(60);

  useEffect(() => {
    if (!missedSession) return;

    let cancelled = false;
    async function fetchAdaptivePlan() {
      setLoading(true);
      setFallbackNotice('');
      const today = toDateString(new Date());
      const openSlots = findOpenStudySlots(sessions);
      const linkedTask = tasks.find((t) => t.id === missedSession.taskId) || null;

      try {
        const res = await fetch('/api/reschedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            missedSession,
            linkedTask,
            openSlots,
            tasks,
            today,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Gemini endpoint unavailable');
        }

        if (!cancelled) {
          setProposal(data);
          setNewDate(data.newDate);
          setNewStartTime(data.newStartTime);
          setNewDurationMinutes(data.newDurationMinutes);
        }
      } catch (err) {
        // Honest fallback to deterministic local scheduler
        const localPlan = buildLocalReschedulePlan(missedSession, tasks, sessions);
        if (!cancelled) {
          setFallbackNotice(
            err.message.includes('GEMINI_API_KEY')
              ? 'Gemini API key is not configured on the server — using local smart scheduler fallback.'
              : `Gemini server unavailable (${err.message}) — using local smart scheduler fallback.`
          );
          setProposal(localPlan);
          setNewDate(localPlan.newDate);
          setNewStartTime(localPlan.newStartTime);
          setNewDurationMinutes(localPlan.newDurationMinutes);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAdaptivePlan();
    return () => {
      cancelled = true;
    };
  }, [missedSession, tasks, sessions]);

  if (!missedSession) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    onApply(missedSession.id, {
      scheduledDate: newDate,
      startTime: newStartTime,
      durationMinutes: Number(newDurationMinutes),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Adaptive Rescheduling</h2>
            <p className="text-xs text-slate-500">
              Recover missed study time before upcoming deadlines
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Missed Session Info */}
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
              Missed Study Session
            </p>
            <p className="mt-0.5 text-sm font-bold text-slate-900">
              [{missedSession.course}] {missedSession.title}
            </p>
            <p className="text-xs text-slate-600">
              Originally planned: {missedSession.scheduledDate} at{' '}
              {formatTime12h(missedSession.startTime)} ({missedSession.durationMinutes} min)
            </p>
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center text-center gap-2.5">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-700">
                Finding the best open study slot for your deadlines...
              </p>
            </div>
          ) : (
            proposal && (
              <form onSubmit={handleConfirm} className="space-y-4">
                {fallbackNotice && (
                  <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>{fallbackNotice}</span>
                  </div>
                )}

                <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white border border-blue-200 text-blue-700">
                      {proposal.source === 'gemini' ? (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          Suggested by Gemini 4 Hydrogen
                        </>
                      ) : (
                        <>
                          <Cpu className="h-3.5 w-3.5" />
                          Local Smart Fallback
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{proposal.summary}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{proposal.reason}</p>
                </div>

                {/* Editable confirmation fields */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      New Date
                    </label>
                    <input
                      type="date"
                      required
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Minutes
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="180"
                      step="15"
                      required
                      value={newDurationMinutes}
                      onChange={(e) => setNewDurationMinutes(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 outline-none"
                    />
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
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 shadow-xs cursor-pointer"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    Confirm &amp; Reschedule
                  </button>
                </div>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
}
