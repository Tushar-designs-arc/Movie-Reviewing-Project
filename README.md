# MovieVerse Admin

Protected React operations console for movies, users, reviews, reports, analytics and settings.

## Stack and commands

React, Vite, React Router, Axios, Tailwind CSS and Lucide.

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Architecture

`AdminRoute` authorizes the session before rendering `AdminLayout`. Feature API modules keep request concerns outside table and page components. `context` provides authentication, theme and toast state; `components/common` standardizes dialogs and loading/error states.

## Environment and deployment

Use the API origin configured by `src/config/config.js` (normally `VITE_API_ORIGIN`). Build `dist/` with production variables, deploy it with SPA fallback, and allow the admin origin in server CORS. Use HTTPS and never expose secrets in frontend variables.