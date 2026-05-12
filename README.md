# Hintro Dashboard

A mock dashboard for [Hintro](https://hintro.ai) built as part of the Frontend Developer Internship assignment.

## Live Demo

> https://hintro-dashboard.vercel.app/dashboard

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| CSS Modules | Styling — zero hardcoded colors, all via CSS variables |
| React Context | Global user state (u1/u2 switching) |
| Fetch API | Mock backend integration |
| localStorage | Feedback persistence |

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/ankur-singh-viix/hintro-dashboard
cd hintro-dashboard

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev

# 4. Open in browser
http://localhost:3000
```

## Features

- **Two user states** — toggle between `u1` (empty/new user) and `u2` (active user with data) using the switcher in the header
- **Live API data** — stats cards and recent calls fetched from the mock backend
- **Skeleton loaders** — shown while API data is loading
- **Empty states** — shown for u1 with zero sessions and no call history
- **Logout modal** — confirms logout, switches to u1 state
- **Feedback modal** — star rating, category pills, freetext; stored in localStorage
- **Feedback history** — view and clear all past feedback entries
- **Responsive** — works on mobile, tablet and desktop
- **Consistent theme** — all colors via CSS custom properties, no hardcoded values

## Project Structure

hintro-dashboard/
├── app/
│   ├── layout.js              # Root layout, loads global CSS + UserProvider
│   ├── page.js                # Redirects / → /dashboard
│   └── dashboard/
│       ├── page.js            # Main dashboard page
│       └── page.module.css
├── components/
│   ├── Layout/
│   │   ├── Sidebar.js         # Navigation sidebar
│   │   ├── Header.js          # Top header with user switcher + avatar
│   │   └── DashboardLayout.js # Shell composing sidebar + header
│   ├── Dashboard/
│   │   ├── StatsCards.js     (sessions, duration, AI, last)
│   │   └── RecentCalls.js     # Grouped call history list
│   ├── Modals/
│   │   ├── LogoutModal.js
│   │   ├── FeedbackModal.js
│   │   └── FeedbackHistoryModal.js
│   └── UI/
│       └── UserSwitcher.js    # u1/u2 toggle pill
├── hooks/
│   └── useApiData.js          # Generic data-fetching hook
├── lib/
│   ├── api.js                 # API base URL, apiFetch, time formatters
│   └── UserContext.js         # Global user context + localStorage persist
└── styles/
└── globals.css            # CSS design tokens 


## API

Base URL: `https://mock-backend-hintro.vercel.app`

| Endpoint | Description |
|----------|-------------|
| `GET /api/auth/profile` | User profile |
| `GET /api/auth/dashboard` | Dashboard + subscription data |
| `GET /api/call-sessions/stats` | Total sessions, avg duration, AI usage, last session |
| `GET /api/call-sessions?limit=10` | Call history list |

All requests use `x-user-id: u1` or `x-user-id: u2` header.

## Assumptions

- `u1` represents a new/empty user — all stats show 0, no call history
- `u2` represents an active user — randomized data on each API call (by design)
- Logout switches the active user to `u1` to demonstrate empty state
- Feedback is stored in `localStorage` under key `hintro_feedback_list`
- Time formatting follows the Figma convention: `14m 22sec`, `2 days ago`

