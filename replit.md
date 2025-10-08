# ChatLure - Viral Story Platform

## Overview
ChatLure is a full-stack React application that converts viral Reddit posts into engaging chat-based stories. The platform provides a phone interface mockup where users can experience realistic conversations and dramatic storylines sourced from popular subreddits.

**Current State:** Production-ready application with SQLite database, Reddit integration capabilities, and a comprehensive admin dashboard.

**Last Updated:** October 8, 2025

## Recent Changes
- **Oct 8, 2025**: Configured for Replit environment
  - Updated Vite config to use port 5000 with 0.0.0.0 host
  - Configured HMR (Hot Module Reload) with WebSocket for Replit proxy
  - Fixed TypeScript configuration for proper module resolution
  - Installed all dependencies
  - Fixed Dashboard component null-safety issues
  - Verified all routes and functionality working correctly

## Project Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite 6** - Build tool and dev server
- **React Router 6** - Client-side routing (SPA mode)
- **TailwindCSS 3** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animations
- **Three.js / React Three Fiber** - 3D graphics

### Backend & Data
- **SQLite (better-sqlite3)** - Local database
- **Custom API Middleware** - Vite plugin serving `/api` endpoints
- **Database Tables:**
  - `stories` - Story content and metadata
  - `users` - User profiles and subscriptions
  - `credentials` - API credentials (Reddit, Clerk, PayPal)
  - `analytics` - Engagement metrics

### Key Features
1. **Reddit Integration** - Scan and convert viral posts to stories
2. **Content Importer** - Manual text/CSV/JSON import options
3. **Story Library** - Manage and preview converted stories
4. **Phone Interface** - Realistic mobile UI mockup
5. **Admin Dashboard** - Analytics and content management
6. **Premium Features** - PayPal integration for subscriptions

## File Structure
```
├── api/                    # API endpoint handlers
│   ├── stories.js         # Story CRUD operations
│   ├── users.js           # User management
│   ├── credentials.js     # API credentials
│   └── analytics.js       # Analytics tracking
├── src/
│   ├── components/
│   │   ├── admin/         # Admin dashboard components
│   │   ├── apps/          # Phone app simulations
│   │   ├── phone/         # Phone UI components
│   │   └── ui/            # Reusable UI components (Radix)
│   ├── pages/             # Route components
│   ├── contexts/          # React context providers
│   ├── lib/               # Utilities and API client
│   └── utils/             # Helper functions
├── vite-api-middleware.js # Custom API routing
└── chatlure.db            # SQLite database file
```

## Development

### Running Locally
The application runs on port 5000 with the `npm run dev` command. The dev server is configured to:
- Listen on 0.0.0.0 to accept connections from Replit's proxy
- Use WebSocket Secure (WSS) protocol for Hot Module Reload
- Automatically detect Replit environment via REPLIT_DEV_DOMAIN

### Available Routes
- `/` - Main phone interface
- `/emulator` - Phone emulator view
- `/admin` - Admin dashboard
- `/database` - Database manager

### API Endpoints
- `GET/POST /api/stories` - Story management
- `GET/POST /api/users` - User operations
- `GET/PUT /api/credentials` - API credentials
- `GET /api/analytics` - Analytics data
- `GET /api/health` - Health check

### Environment Variables
The application uses stored credentials for:
- Reddit API (client ID, secret, user agent)
- Clerk Auth (publishable key, secret key, webhook secret)
- PayPal (client ID, secret, plan ID, environment)

All credentials are stored in the SQLite database `credentials` table.

## User Preferences
None set yet - add preferences as they are discovered during usage.

## Production Notes
- Database file (`chatlure.db`) is committed for demo/development
- In production, ensure proper database backups
- Reddit API credentials required for content scanning
- PayPal credentials needed for subscription features
- Clerk credentials needed for authentication

## Technologies Used
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite 6** - Build tool
- **TailwindCSS 3** - Styling
- **SQLite** - Database
- **React Router 6** - Routing
- **Radix UI** - UI components
- **Clerk** - Authentication (optional)
- **PayPal** - Payments (optional)
