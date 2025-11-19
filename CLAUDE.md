# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a PBL team project featuring an X-RAY inspection monitoring system for detecting foreign objects in manufacturing. The application provides real-time inspection monitoring, defect analysis, and administrative controls.

**Technology Stack:**
- Frontend: React 19 + TypeScript + Vite
- Styling: TailwindCSS
- Authentication & Database: Supabase
- Charts: Recharts
- Routing: React Router v7
- Internationalization: i18next

## Development Commands

### Setup
```bash
# Install all dependencies (root + frontend workspace)
npm install

# Setup environment variables
# Copy fe/.env.local and add Supabase credentials:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Frontend Development (fe/ directory)
```bash
# Start development server (from root)
npm run start:fe

# Or directly in fe/ directory
cd fe
npm run dev        # Starts on http://0.0.0.0:3000
npm run build      # Build for production (outputs to fe/out/)
npm run preview    # Preview production build
```

The frontend uses Vite with SWC for fast compilation and HMR.

## Architecture

### Application Structure

```
fe/src/
├── components/          # Shared components (ProtectedRoute)
├── context/            # React contexts (AuthContext)
├── i18n/               # Internationalization setup
├── lib/                # Utilities (supabaseClient)
├── mocks/              # Mock data (inspectionData, adminData)
├── pages/              # Page components with co-located components
│   ├── home/           # Main monitoring dashboard
│   ├── admin/          # Admin management panel
│   ├── auth/           # Authentication page
│   └── alert-detail/   # Alert detail view
└── router/             # Route configuration
```

### Authentication & Authorization Flow

**Authentication Provider:**
- `AuthContext` (src/context/AuthContext.tsx) wraps the entire app
- Manages Supabase session state and user profile from `user_info` table
- Provides: `session`, `profile`, `loading`, `refreshProfile()`

**User Profile Schema:**
```typescript
interface UserProfile {
  id: string
  email: string
  name: string | null
  role: 'admin' | 'user'
  status: 'pending' | 'approved' | 'blocked'
  department: string | null
}
```

**Protected Routes:**
- `ProtectedRoute` component (src/components/ProtectedRoute.tsx) guards routes
- Checks authentication status and user approval
- Supports role-based access (admin vs user)
- Users with `status: 'pending'` or `status: 'blocked'` see informational screens

**Route Configuration:**
- `/` - Auth page (login/signup)
- `/auth` - Auth page
- `/home` - Main dashboard (requires approved user)
- `/admin` - Admin panel (requires approved admin role)
- `/alert/:id` - Alert detail page

### Supabase Integration

**Client Setup:**
- Configured in `src/lib/supabaseClient.ts`
- Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from environment

**Database Tables:**
- `user_info` - Stores user profiles with role/status
  - Admin can approve/block users and change roles via admin panel

**Authentication:**
- Uses Supabase Auth with email/password
- Role stored in user_info table (not in auth.users metadata)
- Sign up creates user but requires admin approval (status: 'pending')

### Auto-Import Configuration

The project uses `unplugin-auto-import` to avoid explicit imports for common React and router hooks. The following are auto-imported:

**React:** useState, useEffect, useContext, useCallback, useMemo, useRef, etc.
**React Router:** useNavigate, useLocation, useParams, Link, Navigate, etc.
**i18next:** useTranslation, Trans

You'll see these used without imports in component files.

### Vite Configuration Notes

**Global Constants:**
- `__BASE_PATH__` - Configurable base path (default: '/')
- `__IS_PREVIEW__` - Preview mode flag

**Build Output:** `fe/out/` directory

**Path Alias:** `@` resolves to `fe/src/`

## Key Features

### Home Page (Monitoring Dashboard)
- Real-time inspection monitoring with live time updates
- Production summary cards (operating time, defect rates, efficiency)
- Zone-based defect tracking (Zones A, B, C, D) with danger indicators
- Charts: donut chart (normal/defect ratio), hourly production, defect types
- Recent alerts list
- Calendar for date selection
- Role-based admin panel access button

### Admin Page
- **System Overview:** System statistics and health metrics
- **User Management:** Approve pending users, change roles (admin/user), block users
- **Active Users Monitor:** Real-time user connection tracking
- **Data Export:** Export inspection data in various formats

### Mock Data
Located in `src/mocks/`:
- `inspectionData.ts` - Inspection summaries, time-series data, alerts
- `adminData.ts` - Active users, system stats

These are used for development/demo purposes. Replace with real API calls for production.

## Styling & UI

**TailwindCSS:** Primary styling framework
**Icons:** Remix Icons (CDN loaded in index.html)
- Pattern: `<i className="ri-{icon-name}"></i>`
**Color Schemes:**
- Home dashboard: Orange accents (orange-500, orange-600)
- Admin panel: Blue accents (blue-600)
- Status indicators: Green (normal), Red (danger/defects)

## Important Notes

1. **Environment Variables:** The `.env.local` file in `fe/` directory contains Supabase credentials. Never commit this file.

2. **Workspace Structure:** This is an npm workspace project. The root `package.json` defines `fe` as a workspace. Always install dependencies at the appropriate level.

3. **User Approval Flow:** New users sign up with `status: 'pending'`. Admins must approve them via the admin panel before they can access the home dashboard.

4. **Role Protection:** The admin panel checks user role from Supabase in real-time before granting access (see home/page.tsx admin button handler).

5. **Date Formatting:** Uses `date-fns` with Korean locale (`ko`) for date display.

6. **i18n:** Internationalization is configured but currently defaults to English. Korean translations are in use for UI labels directly in components.

