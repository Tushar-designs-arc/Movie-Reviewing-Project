# MovieVerse Administration

This document outlines a secure React application for a management console that focuses on effective administration of movies, users, reviews, reports, analytics, and application settings.

## Technical Stack and Commands

The application is built with React and Vite, using React Router for navigation, Axios for data fetching, Tailwind CSS for styling, and Lucide for icons.

```bash
npm install           # Install dependencies
npm run dev           # Start development server
npm run lint          # Lint the codebase
npm run build         # Build for production
npm run preview       # Preview the production build
```

## System Architecture

The `AdminRoute` component is critical for session authorization before rendering the `AdminLayout`. API modules encapsulate request-handling logic separate from UI table and page components. The `context` provider manages authentication state, theme preferences, and toast notifications, while the `components/common` directory establishes standard practices for dialogs, loading indicators, and error handling.
