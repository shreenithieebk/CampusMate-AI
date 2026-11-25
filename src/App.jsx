import { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import PlannerPage from './pages/PlannerPage';
import AssistantPage from './pages/AssistantPage';
import TaskFormModal from './components/tasks/TaskFormModal';
import SessionModal from './components/planner/SessionModal';
import RescheduleModal from './components/planner/RescheduleModal';
import { sortTasksByPriority } from './utils/priority';
import {
  loadInitialData,
  saveTasks,
  saveSessions,
  loadChatHistory,
  saveChatHistory,
  resetDemoData,
} from './utils/storage';

export default function App() {
  const initialData = useMemo(() => loadInitialData(), []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState(initialData.tasks);
  const [sessions, setSessions] = useState(initialData.sessions);
  const [chatMessages, setChatMessages] = useState(() => loadChatHistory());

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [sessionDefaultTask, setSessionDefaultTask] = useState(null);
  const [sessionDefaultDate, setSessionDefaultDate] = useState(null);

  const [reschedulingSession, setReschedulingSession] = useState(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveChatHistory(chatMessages);
  }, [chatMessages]);

  const prioritizedTasks = useMemo(() => sortTasksByPriority(tasks), [tasks]);
  const activeTaskCount = tasks.filter((t) => t.status !== 'done').length;
  const missedSessionCount = sessions.filter((s) => s.status === 'missed').length;

  // Task CRUD handlers
  const handleSaveTask = (taskData) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === taskData.id);
      if (exists) {
        return prev.map((t) => (t.id === taskData.id ? taskData : t));
      }
      return [taskData, ...prev];
    });
  };

  const handleToggleTaskDone = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      )
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Study Session handlers
  const handleAddSession = (newSession) => {
    setSessions((prev) => [...prev, newSession]);
  };

  const handleUpdateSessionStatus = (sessionId, newStatus) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s))
    );
  };

  const handleDeleteSession = (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleApplyReschedule = (sessionId, updates) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              scheduledDate: updates.scheduledDate,
              startTime: updates.startTime,
              durationMinutes: updates.durationMinutes,
              status: 'planned',
            }
          : s
      )
    );
  };

  // Modal openers
  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const openNewSessionModal = (task = null, dateStr = null) => {
    setSessionDefaultTask(task);
    setSessionDefaultDate(dateStr);
    setIsSessionModalOpen(true);
  };

  const handleResetDemo = () => {
    const fresh = resetDemoData();
    setTasks(fresh.tasks);
    setSessions(fresh.sessions);
    setChatMessages([]);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeTaskCount={activeTaskCount}
        missedSessionCount={missedSessionCount}
        onResetDemo={handleResetDemo}
      />

      <main className="md:pl-68 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <DashboardPage
              tasks={prioritizedTasks}
              sessions={sessions}
              onNavigate={setActiveTab}
              onOpenNewTask={openNewTaskModal}
              onToggleTaskDone={handleToggleTaskDone}
              onUpdateSessionStatus={handleUpdateSessionStatus}
              onOpenReschedule={setReschedulingSession}
              onOpenNewSession={openNewSessionModal}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksPage
              tasks={prioritizedTasks}
              onOpenNewTask={openNewTaskModal}
              onEditTask={openEditTaskModal}
              onDeleteTask={handleDeleteTask}
              onToggleTaskDone={handleToggleTaskDone}
              onScheduleTask={(task) => openNewSessionModal(task, null)}
            />
          )}

          {activeTab === 'planner' && (
            <PlannerPage
              sessions={sessions}
              onOpenNewSession={openNewSessionModal}
              onUpdateSessionStatus={handleUpdateSessionStatus}
              onDeleteSession={handleDeleteSession}
              onOpenReschedule={setReschedulingSession}
            />
          )}

          {activeTab === 'assistant' && (
            <AssistantPage
              tasks={prioritizedTasks}
              sessions={sessions}
              messages={chatMessages}
              onUpdateMessages={setChatMessages}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onSave={handleAddSession}
        tasks={prioritizedTasks}
        defaultTask={sessionDefaultTask}
        defaultDate={sessionDefaultDate}
      />

      <RescheduleModal
        missedSession={reschedulingSession}
        tasks={prioritizedTasks}
        sessions={sessions}
        onClose={() => setReschedulingSession(null)}
        onApply={handleApplyReschedule}
      />
    </div>
  );
}
