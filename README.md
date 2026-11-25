# CampusMate AI 🎓

**Your AI-powered campus productivity companion.**

CampusMate AI helps college students stay organised by managing assignments, prioritising deadlines, planning weekly study sessions, and adapting when study sessions are missed.

## 🎯 Chosen Vertical

**Education – Student Productivity & Academic Planning**

CampusMate AI addresses a common student challenge: balancing multiple assignments, deadlines, and study commitments without losing track of priorities.

## ✨ Key Features

- **Student Dashboard:** Displays workload statistics, upcoming deadlines, today's study plan, and missed-session alerts.
- **Smart Task Management:** Create, edit, delete, and complete assignments with an automatic priority score.
- **Deterministic Priority Engine:** Calculates task priority using urgency (50%), importance (35%), and effort (15%).
- **Weekly Study Planner:** Organises study sessions across a seven-day schedule and tracks completed or missed sessions.
- **Adaptive Rescheduling:** Uses Gemini AI to suggest alternative study slots when a student misses a planned session, with a local smart-scheduler fallback.
- **Context-Aware AI Assistant:** Answers student questions using their current tasks, priorities, and weekly study sessions.

## 🧠 Approach and Logic

CampusMate AI combines deterministic scheduling logic with generative AI.

### 1. Task Prioritisation

Each task receives a priority score based on three factors:

- Urgency – 50%
- Importance – 35%
- Effort – 15%

This ensures that approaching deadlines and important assignments receive appropriate attention.

### 2. Weekly Study Planning

The planner organises study sessions across the week and tracks their status, helping students understand their progress.

### 3. Adaptive Rescheduling

When a student misses a study session, the application sends the session details and available time slots to the Gemini-powered backend. The AI proposes an alternative slot. If the AI service is unavailable, a local scheduling fallback is used.

### 4. Context-Aware Assistance

The AI assistant receives relevant task and schedule information so its responses can reflect the student's current workload rather than relying only on generic advice.

## ⚙️ How the Solution Works

1. Students add assignments and academic tasks.
2. The priority engine calculates task rankings.
3. The dashboard displays workload and upcoming deadlines.
4. Students organise their study sessions using the weekly planner.
5. Missed sessions trigger an adaptive rescheduling workflow.
6. The AI assistant provides context-aware academic planning support.

## 🛠️ Technology Stack

- React 18
- Vite
- JavaScript
- Tailwind CSS
- Google Gemini API
- Vercel Serverless Functions
- Vercel Deployment
- GitHub

## 📌 Assumptions and Limitations

- Students manually enter their assignments, deadlines, and study sessions.
- The priority engine uses predefined weights for urgency, importance, and effort.
- The application uses demonstration data for its initial experience.
- Gemini API access requires a valid server-side API key.
- AI-generated recommendations depend on API availability and may occasionally require a local scheduling fallback.
- The application is a student productivity prototype and does not replace official college academic systems.

## 🚀 Running Locally

### Prerequisites
- Node.js
- npm
- A Google Gemini API key (optional for non-AI features)

### Installation

```bash
git clone https://github.com/shreenithieebk/CampusMate-AI.git
cd CampusMate-AI
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Never commit your actual API key. Keep it server-side and do not use a `VITE_` prefix.

### Start the Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## ☁️ Live Deployment

**Live Application:** https://campusmate-ai-two.vercel.app

The application is deployed using Vercel. Gemini API credentials are configured through Vercel Environment Variables.

## 📂 Repository

[GitHub – CampusMate AI](https://github.com/shreenithieebk/CampusMate-AI)

---

**Built for PromptWars Vibeathon | Hack2Skill**

*Helping students plan smarter, stay organised, and make every study session count.*