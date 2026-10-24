# MyLife OS — Premium Personal Productivity & Life Management PWA

A private, unified personal operating system for daily routines, deep work sessions, prayer timings, core abdominal training, home gardening, personal growth, and weekly life balancing.

---

## Architecture & Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with sleek Dark & Light modes, safe-area inset support for iPhone Safari (`viewport-fit=cover`, `pb-safe`, `pt-safe`), and refined typography (`Plus Jakarta Sans`).
- **Icons**: Lucide React
- **Persistence**: Type-safe LocalStorage engine with automatic schema migrations, data export (JSON backup), data import, and demo reset.
- **PWA Ready**: Web App Manifest (`manifest.webmanifest`), Service Worker offline shell caching (`sw.js`), standalone display mode, and step-by-step iPhone installation modal.
- **Performance**: Zero external bloat, custom SVG chart rendering, sub-second HMR and production bundle optimization.

---

## Core Systems & Features

### 1. Unified Dashboard
- Dynamic greeting based on live time (`Good morning, Abdul`).
- Live digital clock with 12h/24h toggle support.
- Circular completion ring showing today's finished schedule items.
- "Next Up" card with live countdown to the next scheduled routine.
- Daily prayer tracker strip with 1-tap completion checkoff for Fajr, Dhuhr, Asr, Maghrib, and Isha.
- Quick Deep Work focus widget with target hours comparison.
- Core fitness & home gardening hydration status pills.
- Daily habits checklist with interactive flame streaks.
- Weekly key outcomes snippet.

### 2. Daily Schedule Manager
- Visual schedule timeline interleaved with automatic **Free Time Windows** (with 1-click "Add Here" buttons to fill open slots).
- Full activity management: title, description, start/end time, duration, category badge, fixed/flexible commitment lock, priority level, reminder alerts, and daily recurrence.
- Duplicate and delete activities with safe confirmation dialogs.
- Real-time overlap collision detection flagging clashing time blocks with amber warning badges.

### 3. Smart Time Balancer (Rule-Based Schedule Assistant)
- Automated collision analysis engine across the day's timeline.
- **Rule 1**: Absolute preservation of locked (Fixed) activities (e.g. Prayer times, hard client meetings).
- **Rule 2**: Intelligent discovery of available free time slots in the day.
- **Rule 3**: Proposes non-overlapping alternative windows for flexible activities.
- **Rule 4**: Transparent conflict explanation and preview diff (Current Time vs Proposed Time) before applying changes.
- Never silently modifies your schedule without user confirmation.

### 4. Deep Work Management
- Focused digital timer with Start, Pause, Resume, and Log controls.
- Daily target tracking (e.g., 3.0 hours baseline, default 9:00 AM – 11:30 AM window).
- Configurable break alerts (e.g., restorative prompt after 45 mins of deep focus).
- Work sprint checklist with estimated minutes.
- Verified session history log with timestamps and notes.
- Scheduled versus actual tracked duration metrics.

### 5. Fitness & Core Training
- Tailored for abdominal endurance, core posture, and functional stamina.
- Structured routines: Abdominal Core & Stability Focus, Full Body Mobility, and Active Recovery.
- Guided Interactive Workout Player: exercise timer, set-by-set progression, rest countdown timer, and technique guidance.
- Sound scientific principles (no exaggerated false 6-pack promises; emphasis on progressive overload and neutral spine).
- Workout log and consistency history.

### 6. Gardening Manager
- Plant inventory directory with photos/icons, location, and sunlight requirements.
- Smart watering schedule: computes whether water is due today based on individual watering cycle frequency (not assuming all plants need daily water).
- Quick 1-tap "Water Now" and "Water All Due" batch buttons.
- Care and maintenance checklist (pruning, fertilizing, compost, weeding).

### 7. Prayer Schedule
- 5 Daily Prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.
- Initial timezone: `Asia/Colombo` (GMT+5:30), fully customizable in Settings.
- Editable prayer times and mosque travel/preparation buffer in minutes.
- "Sync into Schedule Blocks" action to automatically generate fixed routine blocks in your daily timeline.
- Reminder alert toggles.

### 8. Personal Growth & Learning
- Curriculum tracking for:
  - Fullstack React & TypeScript architecture
  - HNDIT Diploma coursework
  - Spoken English & pronunciation fluency
  - Book reading & technical articles
- Weekly hour targets with visual progress rings.
- Integrated practice session timer with topic notes logger.

### 9. Weekly Planner & Analytics
- 7-day schedule matrix from Monday to Sunday.
- "Copy Previous Week Routine" action with duplicate prevention and conflict protection.
- Weekly consistency metrics: Work hours, Study hours, Workout frequency, and Routine completion rate.
- Weekly reflection notes (Highlights & Wins, Obstacles, Action Items for Next Week).
- Real data analytics charts: Scheduled vs Actual work comparison, learning hours distribution, and daily completion trends.

### 10. Settings & Data Portability
- Profile configuration (Display name, bio).
- Dark mode, Light mode, and System theme toggle.
- 12-hour and 24-hour clock formats.
- Week starts on Monday or Sunday.
- Timezone selector.
- Daily work target & preferred work window sliders.
- Instant JSON backup export and validated JSON file restore.
- Reset application data with confirmation dialog.

---

## Getting Started

### Prerequisites
Node.js (v18+) and npm.

### Installation
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### PWA Installation on iPhone Safari
1. Open the app in Safari.
2. Tap the **Share** button (box with upward arrow).
3. Tap **Add to Home Screen**.
4. Tap **Add**. The app will run in full-screen standalone mode with offline shell caching.
