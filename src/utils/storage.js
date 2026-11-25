import { createDemoSeed } from '../data/demoData';

const KEYS = {
  TASKS: 'campusmate_tasks_v1',
  SESSIONS: 'campusmate_sessions_v1',
  CHAT: 'campusmate_chat_v1',
};

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function loadInitialData() {
  const existingTasks = safeRead(KEYS.TASKS, null);
  const existingSessions = safeRead(KEYS.SESSIONS, null);

  if (Array.isArray(existingTasks) && Array.isArray(existingSessions)) {
    return { tasks: existingTasks, sessions: existingSessions };
  }

  const seed = createDemoSeed();
  saveTasks(seed.tasks);
  saveSessions(seed.sessions);
  return seed;
}

export function saveTasks(tasks) {
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
}

export function saveSessions(sessions) {
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
}

export function loadChatHistory() {
  return safeRead(KEYS.CHAT, []);
}

export function saveChatHistory(messages) {
  localStorage.setItem(KEYS.CHAT, JSON.stringify(messages));
}

export function resetDemoData() {
  const seed = createDemoSeed();
  saveTasks(seed.tasks);
  saveSessions(seed.sessions);
  localStorage.removeItem(KEYS.CHAT);
  return seed;
}
