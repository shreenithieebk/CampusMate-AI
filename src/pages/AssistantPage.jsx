import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Trash2, AlertCircle, Loader2, Database } from 'lucide-react';
import { DEMO_STUDENT } from '../data/demoData';
import { toDateString } from '../utils/scheduler';

const QUICK_PROMPTS = [
  'What should I prioritize studying today?',
  'How can I recover my missed study session?',
  'Break my highest priority assignment into smaller steps',
  'Am I overloaded before my upcoming deadlines?',
];

export default function AssistantPage({ tasks, sessions, messages, onUpdateMessages }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const bottomRef = useRef(null);

  const activeCount = tasks.filter((t) => t.status !== 'done').length;
  const missedCount = sessions.filter((s) => s.status === 'missed').length;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textToSend) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setErrorMsg('');
    const userMsg = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    onUpdateMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          studentContext: {
            student: DEMO_STUDENT,
            today: toDateString(new Date()),
            tasks,
            sessions,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reach Gemini API endpoint.');
      }

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        text: data.reply,
        model: data.model || 'gemini-4-hydrogen',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onUpdateMessages([...nextMessages, aiMsg]);
    } catch (err) {
      setErrorMsg(err.message || 'Could not reach /api/chat.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9.5rem)] md:h-[calc(100vh-4.5rem)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">AI Study Assistant</h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Grounded in your live coursework, deadlines, and weekly planner via Gemini API.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200">
            <Database className="h-3.5 w-3.5 text-blue-700" />
            Live Context: {activeCount} active tasks · {missedCount} missed
          </span>
          {messages.length > 0 && (
            <button
              onClick={() => onUpdateMessages([])}
              title="Clear conversation"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 bg-white transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.05)] flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-5">
              <div className="h-12 w-12 rounded-2xl bg-blue-900 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Ask CampusMate AI anything about your week
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your current tasks, priority scores, deadlines, and missed study blocks are
                  automatically included as context.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50 hover:border-blue-300 text-xs font-medium text-slate-700 hover:text-blue-950 transition-all cursor-pointer"
                  >
                    &ldquo;{prompt}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-900 text-white rounded-br-sm shadow-xs'
                      : 'bg-slate-50 text-slate-800 rounded-bl-sm border border-slate-200'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`mt-1.5 text-[10px] flex items-center justify-between gap-3 ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.role === 'user' ? 'You' : `Gemini (${msg.model || 'AI'})`}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
                Analyzing your schedule &amp; deadlines...
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-semibold">Gemini API Request Failed</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/70 flex items-center gap-2.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your deadlines, study strategy, or missed tasks..."
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
