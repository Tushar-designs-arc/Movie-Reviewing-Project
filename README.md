# OTTVerse Streaming Platform

Full-stack OTT / entertainment streaming website for Movies, Web Series, TV Shows, and Serials.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Context API
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT and bcryptjs
- Data: MongoDB with automatic seed data, plus an in-memory fallback for quick demos

## Folder Structure

```text
Frontend/                 # Vite React client
Backend/                  # Express + Mongoose server
Backend/src/config        # Database setup
Backend/src/data          # Seed data and memory fallback
Backend/src/middleware    # Auth and error middleware
Backend/src/models        # User, Content, Category, Watchlist, Favorite, ContinueWatching
Backend/src/routes        # Auth, content, categories, library, admin APIs
```

The existing project already used `Frontend/` and `Backend/`; those folders map directly to the requested `client/` and `server/` roles.

## Setup

Install dependencies:

```bash
cd Backend
npm install
cd ../Frontend
npm install
```

Create env files:

```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

Run MongoDB locally, or set `USE_IN_MEMORY_DB=true` in `Backend/.env` to run without MongoDB.

Start the backend:

```bash
cd Backend
npm run dev
```

Start the frontend:

```bash
cd Frontend
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://127.0.0.1:5000`

## Demo Accounts

- User: `demo@ott.local` / `password123`
- Admin: `admin@ott.local` / `admin123`

## Key Pages

- Home with hero banner slider
- Movies, Web Series, TV Shows, Serials category pages
- Search
- Details
- Watch player
- Login and Signup
- Profile
- Watchlist
- Favorites
- Admin Dashboard

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/storefront`
- `GET /api/content`
- `GET /api/content/search?q=...`
- `GET /api/content/:id`
- `POST /api/content` admin
- `PUT /api/content/:id` admin
- `DELETE /api/content/:id` admin
- `GET /api/categories`
- `POST /api/categories` admin
- `GET /api/user/watchlist`
- `POST /api/user/watchlist`
- `DELETE /api/user/watchlist/:contentId`
- `GET /api/user/favorites`
- `POST /api/user/favorites`
- `DELETE /api/user/favorites/:contentId`
- `GET /api/user/continue-watching`
- `POST /api/user/continue-watching`
- `GET /api/admin/dashboard` admin

## Notes

The backend serves a sample MP4 through range requests for the player page. Replace `Frontend/public/Lookism_Fly_Up_Full_Song_Hindi_Cover.mp4` and the seeded `videoUrl` values with licensed media for production use.
