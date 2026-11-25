import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.8-flash';

/**
 * Vercel Serverless Function: POST /api/chat
 * Expects: { message: string, history?: Array<{ role: string, text: string }>, studentContext: object }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(503).json({
      error:
        'GEMINI_API_KEY is not configured on the server. Add GEMINI_API_KEY to your .env file (locally) or Vercel Environment Variables.',
      code: 'NO_API_KEY',
    });
  }

  try {
    const { message, history = [], studentContext = {} } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'A message string is required.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const {
      student = {},
      today = new Date().toISOString().slice(0, 10),
      tasks = [],
      sessions = [],
    } = studentContext;

    const systemInstruction = `You are CampusMate AI, a supportive, practical academic productivity assistant for college students.
Today's date is ${today}.

Student Profile:
- Name: ${student.name || 'Demo Student'}
- Major: ${student.major || 'Computer Science'}
- Daily Study Goal: ${student.dailyGoalHours || 4} hours

Current Academic Tasks (sorted by priority score 0-100):
${
  tasks.length > 0
    ? tasks
        .map(
          (t) =>
            `- [${t.status.toUpperCase()}] "${t.title}" (${t.course}) | Due: ${t.dueDate} | Importance: ${t.importance}/5 | Effort: ${t.estimatedHours}h | Priority Score: ${t.priorityScore}/100 (${t.priorityLevel})`
        )
        .join('\n')
    : '- No tasks added yet.'
}

Current Weekly Study Sessions:
${
  sessions.length > 0
    ? sessions
        .map(
          (s) =>
            `- [${s.status.toUpperCase()}] ${s.scheduledDate} at ${s.startTime} (${s.durationMinutes} min): "${s.title}"`
        )
        .join('\n')
    : '- No study sessions scheduled yet.'
}

Guidelines:
- Always ground your advice in the student's actual tasks, deadlines, priority scores, and missed/planned study blocks above.
- Keep responses concise, structured with clear bullet points, and immediately actionable.
- If the student has missed sessions or high-priority deadlines within 48 hours, proactively highlight them.`;

    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    const formattedPrompt =
      recentHistory.length > 0
        ? `Recent conversation:\n${recentHistory
            .map((m) => `${m.role === 'user' ? 'Student' : 'CampusMate AI'}: ${m.text}`)
            .join('\n')}\n\nStudent's new question: ${message}`
        : message;

    const interaction = await ai.interactions.create({
      model: MODEL,
      system_instruction: systemInstruction,
      input: formattedPrompt,
      store: false,
    });

    const reply = interaction?.output_text?.trim();
    if (!reply) {
      return res.status(502).json({ error: 'Gemini returned an empty response.' });
    }

    return res.status(200).json({
      reply,
      model: MODEL,
    });
  } catch (error) {
    console.error('[/api/chat] Gemini error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to get response from Gemini API.',
    });
  }
}
