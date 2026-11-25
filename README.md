# CampusMate AI

An intelligent student life assistant built for college students to manage assignments, prioritize deadlines, plan weekly study sessions, and adapt when a session is missed.

## Features
- **Student Dashboard**: Live workload stats, top priority deadlines, today's study plan, and missed session alerts.
- **Task Management & Deterministic Priority Engine**: Add, edit, delete, and complete tasks with automatic scoring (Urgency 50% · Importance 35% · Effort 15%).
- **Weekly Study Planner**: 7-day study grid with Completed / Missed session tracking.
- **Adaptive Rescheduling**: Uses Gemini (`POST /api/reschedule`) to propose a new open slot when you miss a session, with an automatic local smart-scheduler fallback if the AI endpoint is unavailable.
- **Context-Aware AI Assistant**: Chats with Gemini (`POST /api/chat`) grounded in your live tasks, priorities, and weekly sessions.

## Setup & Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional, for Gemini AI features) Copy `.env.example` to `.env` and add your server-side key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > Never prefix `GEMINI_API_KEY` with `VITE_`—it stays strictly on the server.
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Deploying to Vercel
1. Push this repo to GitHub and import it in Vercel (Framework Preset: **Vite**).
2. In **Vercel Project Settings → Environment Variables**, add `GEMINI_API_KEY`.
3. Deploy! Vercel automatically serves the React app and maps `/api/chat.js` and `/api/reschedule.js` as serverless functions.
