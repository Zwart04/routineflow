# RoutineFlow

AI-powered daily routine orchestrator with smart scheduling, real-time collaboration, calendar sync, and background analytics.

## Features (MVP — 8 Complex Features)

1. **AI LLM Schedule Generator** — Client-side intelligent algorithm generates optimal daily routines based on user goals, energy levels, chronotype, and habit priority scoring. Includes morning/evening routine templates with adaptive time allocation.

2. **Real-time Collaborative Dashboard** — Cross-tab synchronization using BroadcastChannel API for live habit check-in across multiple browser tabs. Shows real-time completion status, shared routine progress, and collaborative streak tracking.

3. **Calendar Sync (iCal Export)** — Full client-side .ics file generation for routines and scheduled habits. Download button creates importable calendar files compatible with Google Calendar, Apple Calendar, and Outlook.

4. **Background Streak Analytics** — Web Worker computes streaks, completion rates, trend analysis, and habit consistency scores off the main thread. Includes 7/30/90-day rolling statistics with visual indicators.

5. **Smart Time Blocking** — Interactive drag-and-drop time block scheduler with conflict detection, automatic buffer time insertion, and optimal break placement based on ultradian rhythm research.

6. **Habit Correlation Engine** — Statistical analysis (Pearson correlation) discovers which habit combinations produce the best outcomes. Scatter plots and correlation matrices visualize relationships between habits.

7. **Progress Heatmap Dashboard** — GitHub-style contribution heatmap built with Recharts showing daily routine completion intensity. Includes streak flames, consistency rings, and period comparison charts.

8. **Productivity Finance Journal** — Auto-journal system tags routine completion as productivity metrics. Tracks time invested vs. outcomes, hourly productivity rates, and exports financial summaries to PDF/Excel.

## Tech Stack
- Next.js 16 App Router + TypeScript
- Tailwind v4 + shadcn/ui components
- Recharts for data visualization
- lucide-react for icons
- Web Workers for background computation
- BroadcastChannel API for real-time sync
- Client-side iCal (.ics) generation
- localStorage for data persistence
- Static export (`output: 'export'`) for Cloudflare Pages

## Routes (13 routes)
- `/` — Landing page
- `/login` — Authentication
- `/register` — Registration
- `/dashboard` — Main dashboard with overview
- `/schedule` — AI schedule generator
- `/routines` — Routine list and management
- `/routines/[id]` — Routine detail view
- `/analytics` — Streak analytics and statistics
- `/heatmap` — Progress heatmap visualization
- `/correlations` — Habit correlation analysis
- `/calendar` — Calendar sync and export
- `/journal` — Productivity finance journal
- `/settings` — User settings

## Notification & Attribution
- **Notification**: In-app toast (shadcn Toast) + email mock + wa.me share link
- **Attribution**: UTM/URL-param reader → localStorage.source → Recharts bar chart in analytics
- **NO /waha/, NO Pixel/GA, NO external tracking scripts**

## Design Rules
- No emoji anywhere
- Bilingual EN/ID toggle
- Light/dark mode support
- Clean SaaS aesthetic