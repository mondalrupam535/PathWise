# PathWise AI — Frontend Build Plan

A modern, animated career guidance app. Frontend only, mock data, no backend yet.

## Design direction

- **Aesthetic**: Minimal professional with glassmorphism cards (backdrop-blur, subtle borders) over soft aurora gradients (indigo → violet → cyan).
- **Typography**: Space Grotesk for headings, Inter for body.
- **Theme**: Dark/light toggle via `class="dark"` on root; tokens in `src/styles.css` (oklch).
- **Motion**: Framer Motion for page transitions, staggered card reveals, hover lifts.
- **Components**: Rounded-2xl cards, gradient accent buttons, soft shadows.

## Routes (TanStack Start, file-based)

```
src/routes/
  __root.tsx              theme provider + outlet
  index.tsx               Landing
  login.tsx               Login/Signup (tabs)
  onboarding.tsx          3-step wizard
  app.tsx                 Dashboard layout (sidebar + outlet)
  app.index.tsx           Dashboard home
  app.pathway.tsx
  app.guide.tsx           AI chat (mock)
  app.resume.tsx          Resume layout w/ tabs
  app.resume.builder.tsx
  app.resume.analyzer.tsx
  app.jobs.tsx            Job match
  app.progress.tsx
```

Auth/onboarding are mocked via `localStorage` flags; no real backend.

## Shared components

- `ThemeToggle`, `Logo`, `GradientButton`, `GlassCard`, `SectionHeading`
- `AppSidebar` (shadcn Sidebar) with nav: Dashboard, Pathway, AI Guide, Resume, Job Match, Progress
- `PageTransition` wrapper using Framer Motion
- `StatCard`, `ProgressRing`, `SkillBadge`, `ChatBubble`, `JobCard`, `RoadmapStep`

## Page contents

1. **Landing** — Hero with gradient + animated blobs, feature grid (6 cards), how-it-works (3 steps), testimonials, CTA, footer.
2. **Login/Signup** — Glass card, tabbed form, social buttons (mock), redirects to onboarding.
3. **Onboarding** — 3 steps: goal selection → current skills (chips) → target role. Progress bar. Saves to localStorage, redirects to `/app`.
4. **Dashboard home** — Welcome header, 4 stat cards (Pathway progress, Skills, Applications, AI chats), recent activity, quick actions.
5. **Pathway** — Vertical roadmap timeline with milestones (locked/active/done states), recommended courses.
6. **AI Guide** — Chat interface with mock canned responses, suggested prompts.
7. **Resume Builder** — Left form (personal/experience/education/skills), right live preview.
8. **Resume Analyzer** — Upload dropzone (mock), score gauge, strengths/weaknesses list, suggestions.
9. **Job Match** — Filter sidebar, job cards with match % badge, save/apply buttons (mock).
10. **Progress** — Charts (recharts): weekly activity, skill growth radar, achievements grid.

## Technical notes

- Add `framer-motion` and `recharts` via bun.
- Extend `src/styles.css` with brand tokens (`--brand`, `--brand-glow`, gradients) and dark variants.
- Use shadcn primitives already in repo (button, card, input, tabs, sidebar, dialog, progress, badge).
- All data static/mocked in `src/lib/mock/*.ts`.
- Replace `src/routes/index.tsx` placeholder.

## Out of scope (later)

- Real auth, database, AI calls, file parsing, job APIs. Hooks/stubs left ready to swap in.

Ready to build on approval.