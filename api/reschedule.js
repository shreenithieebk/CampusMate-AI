import { GoogleGenAI } from '@google/genai';

const MODEL = 'gemini-3.8-flash';

/**
 * Vercel Serverless Function: POST /api/reschedule
 * Proposes an adaptive study slot for a missed session using Gemini structured JSON output.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server.',
      code: 'NO_API_KEY',
    });
  }

  try {
    const { missedSession, linkedTask, openSlots = [], tasks = [], today } = req.body || {};

    if (!missedSession || !Array.isArray(openSlots) || openSlots.length === 0) {
      return res.status(400).json({
        error: 'missedSession and non-empty openSlots are required.',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an adaptive academic scheduler. A college student missed a planned study session and needs to reschedule it this week.

Today's date: ${today}
Missed Session:
- Title: ${missedSession.title}
- Originally Scheduled: ${missedSession.scheduledDate} at ${missedSession.startTime}
- Duration: ${missedSession.durationMinutes} minutes
${
  linkedTask
    ? `- Linked Assignment: "${linkedTask.title}" (${linkedTask.course}), Due: ${linkedTask.dueDate}, Importance: ${linkedTask.importance}/5`
    : '- Linked Assignment: General study block'
}

Other Active Tasks:
${tasks
  .filter((t) => t.status !== 'done')
  .map((t) => `- "${t.title}" (${t.course}) due ${t.dueDate}`)
  .join('\n')}

Available Open Study Slots (MUST choose one of these exact date + startTime pairs):
${openSlots
  .map(
    (slot) =>
      `- date: ${slot.date}, startTime: ${slot.startTime}, existingPlannedMinutesOnDay: ${slot.dayPlannedMinutes}`
  )
  .join('\n')}

Pick the best open slot (preferably before the assignment due date and on a less crowded day). You may keep the original duration or adjust slightly (30-120 minutes) to fit nicely. Respond ONLY with JSON matching the schema.`;

    const interaction = await ai.interactions.create({
      model: MODEL,
      input: prompt,
      store: false,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: {
          type: 'object',
          properties: {
            newDate: {
              type: 'string',
              description: 'Exact YYYY-MM-DD date from the provided openSlots list.',
            },
            newStartTime: {
              type: 'string',
              description: 'Exact HH:MM 24h startTime from the provided openSlots list.',
            },
            newDurationMinutes: {
              type: 'integer',
              description: 'Recommended duration in minutes (between 30 and 120).',
            },
            summary: {
              type: 'string',
              description: 'Short 1-sentence headline explaining the new plan.',
            },
            reason: {
              type: 'string',
              description: 'Concise 1-2 sentence rationale considering deadline and workload balance.',
            },
          },
          required: ['newDate', 'newStartTime', 'newDurationMinutes', 'summary', 'reason'],
        },
      },
    });

    const rawText = interaction?.output_text;
    if (!rawText) {
      return res.status(502).json({ error: 'Gemini returned an empty reschedule proposal.' });
    }

    const parsed = JSON.parse(rawText);

    // Ensure the proposed slot matches one of our open slots; otherwise snap to closest open slot
    const matchedSlot = openSlots.find(
      (s) => s.date === parsed.newDate && s.startTime === parsed.newStartTime
    );
    const chosenSlot = matchedSlot || openSlots.find((s) => s.date === parsed.newDate) || openSlots[0];

    return res.status(200).json({
      source: 'gemini',
      model: MODEL,
      newDate: chosenSlot.date,
      newStartTime: chosenSlot.startTime,
      newDurationMinutes: Math.min(120, Math.max(30, Number(parsed.newDurationMinutes) || missedSession.durationMinutes)),
      summary: parsed.summary || `Moved "${missedSession.title}" to ${chosenSlot.date} at ${chosenSlot.startTime}.`,
      reason: parsed.reason || 'Balanced against upcoming deadlines and open study blocks.',
    });
  } catch (error) {
    console.error('[/api/reschedule] Gemini error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate adaptive schedule with Gemini.',
    });
  }
}
