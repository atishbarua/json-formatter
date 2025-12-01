# JSON Formatter & Viewer

## Overview

This is a developer-focused JSON formatting and validation tool with an admin analytics dashboard. The application provides a clean, utility-first interface for formatting, validating, and visualizing JSON data with syntax highlighting and collapsible tree views. It includes analytics tracking for page views and ad clicks, accessible through a password-protected admin panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter is used for lightweight client-side routing with three main routes:
- `/` - JSON formatter/viewer tool
- `/admin` - Admin analytics dashboard
- `*` - 404 not found page

**UI Component Library**: The application uses shadcn/ui (New York style variant) built on Radix UI primitives with Tailwind CSS for styling. This provides a comprehensive set of pre-built, accessible components including forms, dialogs, cards, charts, and data visualization components.

**State Management**: React Query (@tanstack/react-query) handles server state management and data fetching. Local component state is managed with React hooks (useState, useCallback, useEffect).

**Styling Approach**: Tailwind CSS with custom design tokens following Material Design 3 principles. The design system emphasizes:
- Developer-tool aesthetics inspired by VS Code and JSONFormatter.org
- Monospace fonts (JetBrains Mono/Fira Code) for JSON display
- Clean spacing with consistent Tailwind units (2, 4, 6, 8)
- Support for light and dark themes via CSS custom properties

**Key Features**:
- JSON validation and formatting with error handling
- Collapsible tree view for nested JSON structures
- Copy, clear, and prettify/minify operations
- Ad banner placements with click tracking
- Theme toggle (light/dark mode)

### Backend Architecture

**Framework**: Express.js running on Node.js with TypeScript.

**Server Structure**:
- `server/index.ts` - Main application entry point with middleware setup
- `server/routes.ts` - API route definitions
- `server/static.ts` - Static file serving and SPA fallback
- `server/vite.ts` - Development server integration with Vite HMR

**API Endpoints**:
- `POST /api/track` - Event tracking for page views and ad clicks
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/analytics` - Retrieve analytics data (requires authentication)

**Development vs Production**:
- Development: Uses Vite middleware for HMR and hot reloading
- Production: Serves pre-built static assets from `dist/public`

**Request Logging**: Custom middleware logs all API requests with timing information.

### Data Storage

**Current Implementation**: In-memory storage (`MemStorage` class) for rapid prototyping and development. This stores:
- Analytics data (total visitors, daily visitor counts, ad clicks)
- Admin credentials (username/password from environment variables or defaults)

**Storage Interface**: The `IStorage` interface abstracts storage operations, allowing easy migration to persistent storage:
```typescript
- getAnalytics(): Promise<Analytics>
- trackEvent(event: TrackEvent): Promise<void>
- validateAdmin(username, password): Promise<boolean>
```

**Database Ready**: Drizzle ORM is configured with PostgreSQL dialect, indicating the application is prepared for database integration. The configuration points to:
- Schema: `shared/schema.ts`
- Migrations: `./migrations` directory
- Connection: `DATABASE_URL` environment variable

### Authentication & Authorization

**Admin Access**: Simple username/password authentication using environment variables:
- `ADMIN_USERNAME` (defaults to "admin")
- `ADMIN_PASSWORD` (defaults to "admin123")

**Session Management**: The application includes `express-session` and `connect-pg-simple` dependencies, suggesting session-based authentication is planned or available for implementation.

**Security Considerations**: Current implementation uses basic credential validation without session persistence. Production deployment would require:
- Proper password hashing
- Session management
- CSRF protection
- Rate limiting (express-rate-limit is available)

### External Dependencies

**UI & Styling**:
- Radix UI - Accessible component primitives
- Tailwind CSS - Utility-first styling
- class-variance-authority - Component variant management
- Recharts - Data visualization for analytics charts

**Data & Validation**:
- Zod - Schema validation and type inference
- Drizzle ORM - Type-safe database operations
- date-fns - Date formatting and manipulation

**Developer Experience**:
- Vite - Fast build tool and dev server
- TypeScript - Type safety across the stack
- ESBuild - Fast bundling for production

**Planned/Available Integrations** (present in dependencies):
- Neon Database (@neondatabase/serverless) - Serverless PostgreSQL
- Google Fonts - Typography (Inter, Fira Code, JetBrains Mono)
- Replit plugins - Development tooling for Replit environment

### Build & Deployment

**Build Process**:
1. Client: Vite builds React application to `dist/public`
2. Server: ESBuild bundles server code to `dist/index.cjs` with selective dependency bundling (allowlist approach to reduce cold start times)

**Environment Configuration**:
- `NODE_ENV` - development/production mode switching
- `DATABASE_URL` - PostgreSQL connection string (optional currently)
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` - Admin credentials

**Scripts**:
- `dev` - Start development server with Vite HMR
- `build` - Build both client and server for production
- `start` - Run production server
- `db:push` - Push schema changes to database (when configured)