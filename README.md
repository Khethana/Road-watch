# 🛣️ Road Watch

> **Better roads through radical transparency.**

Road Watch is a civic-tech web application that empowers citizens to report road damage, track repair statuses in real time, and monitor municipal budget spending all on an interactive map. It also ships with a native Android app via Capacitor.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-6-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Firebase Setup](#-firebase-setup)
- [Android / Capacitor Build](#-android--capacitor-build)
- [Deployment](#-deployment)
  - [Web (Vercel)](#web---vercel)
  - [Web (Netlify)](#web---netlify)
- [Application Routes](#-application-routes)
- [State Management](#-state-management)
- [Key Design Decisions](#-key-design-decisions)
- [Environment Variables Reference](#-environment-variables-reference)
- [Scripts Reference](#-scripts-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

Road Watch bridges the gap between citizens and municipal authorities. Users can:

- **Report** potholes, damaged roads, and infrastructure issues with a photo, GPS pin, and severity level.
- **Track** the status of every reported issue — from `pending` → `in_progress` → `resolved`.
- **Visualize** all reports on an interactive Leaflet map with clustered markers.
- **Analyse** city-wide trends through charts covering complaint volumes, resolution rates, area-wise damage, and government spending.
- **Vote** on critical issues to help authorities prioritize repairs.

Admins get a dedicated panel to manage all reports, update statuses, sort and search issues, and view contractor data.

---

## ✨ Features

### For Citizens
| Feature | Description |
|---|---|
| 🗺️ Geotagged Reports | Pin exact damage locations on an interactive map |
| 📸 Photo Upload | Attach compressed images to reports (stored as Base64 in Firestore) |
| 📊 Live Status Tracking | Follow your report from submission to resolution |
| 👍 Community Upvoting | Upvote issues to raise priority |
| 🔍 Filtered Dashboard | Filter reports by severity, status, area, and date range |
| 🌗 Dark / Light Mode | Full theme support, persisted to localStorage |

### For Admins
| Feature | Description |
|---|---|
| 🛡️ Admin Panel | Dedicated route, guarded by role-based access control |
| ✏️ Status Management | Change report status with a single click |
| 🔃 Sortable Table | Sort reports by any field (date, severity, status, area…) |
| 🔎 Search & Filter | Full-text search across all reports |

### Analytics
| Chart | Description |
|---|---|
| Complaint Trend | Monthly complaint vs. resolution volume (area chart) |
| Budget Utilization | Allocated vs. spent budget per month (bar chart) |
| Resolution Rate | Resolved/Pending/In-Progress breakdown (pie chart) |
| Area Damage Index | Damage density per city area (bar chart) |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 (with `StrictMode`) |
| **Language** | TypeScript 5.2 |
| **Build Tool** | Vite 5 (with manual chunk splitting) |
| **Styling** | Tailwind CSS 3 + PostCSS + custom CSS variables |
| **Routing** | React Router DOM v6 (HashRouter) |
| **State** | Redux Toolkit (auth, reports, filters, UI slices) |
| **Backend / Auth** | Firebase v10 — Auth, Firestore, Storage |
| **Maps** | Leaflet + React-Leaflet + react-leaflet-cluster |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Forms** | React Hook Form + Zod validation |
| **HTTP** | Axios |
| **Notifications** | React Hot Toast |
| **Mobile** | Capacitor v6 (Android) |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
road-watch/
├── android/                    # Capacitor Android project
│   └── app/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images & static files
│   ├── components/
│   │   ├── charts/             # Recharts chart components
│   │   │   ├── AreaDamageChart.tsx
│   │   │   ├── BudgetChart.tsx
│   │   │   ├── ComplaintTrendChart.tsx
│   │   │   └── ResolutionRateChart.tsx
│   │   ├── map/
│   │   │   ├── MapMarker.tsx   # Custom Leaflet marker
│   │   │   └── MapView.tsx     # Full interactive map
│   │   ├── ui/                 # Reusable UI primitives
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── SkeletonLoader.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── StatsWidget.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── ReportCard.tsx
│   │   └── Sidebar.tsx
│   ├── config/
│   │   ├── env.ts              # Typed environment variable access
│   │   └── firebase.ts         # Firebase app initialisation
│   ├── context/
│   │   └── ThemeContext.tsx    # Dark/light mode context
│   ├── data/
│   │   └── mockData.ts         # Mock data for analytics charts
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useTheme.ts
│   ├── layouts/
│   │   ├── DashboardLayout.tsx # Authenticated layout with sidebar
│   │   └── MainLayout.tsx      # Public layout with navbar + footer
│   ├── pages/
│   │   ├── AdminPanel.tsx      # Admin-only report management
│   │   ├── Analytics.tsx       # City-wide charts & spending
│   │   ├── Dashboard.tsx       # Map + report list + stats
│   │   ├── Home.tsx            # Public landing page
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Register.tsx
│   │   └── ReportIssue.tsx     # Geotagged report submission form
│   ├── routes/
│   │   ├── AdminRoute.tsx      # Role-based route guard (admin)
│   │   ├── AppRoutes.tsx       # Central route definitions
│   │   └── ProtectedRoute.tsx  # Auth route guard
│   ├── scripts/
│   │   └── seedFirestore.ts    # One-time DB seeding script
│   ├── services/
│   │   ├── api.ts              # Axios base client
│   │   ├── authService.ts      # Firebase Auth CRUD
│   │   ├── reportService.ts    # Firestore reports CRUD
│   │   └── spendingService.ts  # Firestore spending CRUD
│   ├── store/
│   │   ├── hooks.ts            # Typed useAppDispatch / useAppSelector
│   │   ├── index.ts            # Redux store + auth middleware
│   │   └── slices/
│   │       ├── authSlice.ts    # Auth state + thunks
│   │       ├── filterSlice.ts  # Report filter state
│   │       ├── reportSlice.ts  # Report state + thunks
│   │       └── uiSlice.ts      # Modal / UI state
│   ├── styles/
│   │   └── index.css           # Tailwind directives + CSS variables
│   ├── types/
│   │   └── index.ts            # All shared TypeScript interfaces
│   └── utils/
│       ├── animations.ts       # Framer Motion variants
│       ├── formatters.ts       # Date & number formatters
│       ├── helpers.ts          # Utility functions
│       ├── imageCompressor.ts  # Client-side Base64 image compression
│       └── validators.ts       # Zod schemas
├── .env.example                # Environment variable template
├── .gitignore
├── capacitor.config.ts         # Capacitor app config
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- **Node.js** v18 or later — [nodejs.org](https://nodejs.org)
- **npm** v9 or later (bundled with Node)
- **Git**
- **Android Studio** *(only if building the Android app)*

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/road-watch.git
cd road-watch

# 2. Install dependencies
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Then open `.env` and populate every variable. See the [full reference below](#-environment-variables-reference).

> ⚠️ **Never commit `.env` to version control.** It is already excluded by `.gitignore`.

### Running Locally

```bash
# Start the development server (hot reload enabled)
npm run dev
```

The app will be available at **http://localhost:5173**

To preview a production build locally:

```bash
npm run build
npm run preview
```

---

## 🔥 Firebase Setup

Road Watch uses three Firebase services: **Authentication**, **Firestore**, and **Storage**.

### 1. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** and follow the wizard
3. Register a **Web app** inside the project

### 2. Enable Authentication

1. In the Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password**

### 3. Set Up Firestore

1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Apply the following security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: readable by owner; writable on create (registration)
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }

    // Reports: any authenticated user can read/create;
    // only admins can update status
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Spending: read-only for authenticated users
    match /spending/{doc} {
      allow read: if request.auth != null;
    }
  }
}
```
```

### 5. Get Your Config Keys

Go to **Project Settings** → **Your apps** → select your web app → copy the `firebaseConfig` object values into your `.env` file.

### 6. Seed the Database (Optional)

A seeding script is included to pre-populate Firestore with sample reports and spending records:

```bash
npx ts-node src/scripts/seedFirestore.ts
```

### Creating an Admin User

After registering a user through the app, manually set their role to `admin` in Firestore:

1. Open Firestore → **users** collection
2. Find the user's document
3. Change the `role` field from `"citizen"` to `"admin"`

---

## 📱 Android / Capacitor Build

Road Watch compiles to a native Android app using [Capacitor](https://capacitorjs.com).

### First-time Setup

1. Install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → **SDK Manager** → install the latest Android SDK

### Build & Sync

```bash
# Build web assets and sync them into the Android project
npm run android:build

# Then open Android Studio to run on device/emulator
npm run android:open
```

Or, to only sync after a web build:

```bash
npm run android:sync
```

### App Details

| Property | Value |
|---|---|
| App ID | `com.roadwatch.app` |
| App Name | `Road Watch` |
| Web Directory | `dist` |
| Android Scheme | `https` |

### Generating App Icons & Splash Screen

Place source images in the `assets/` folder, then run:

```bash
npm run generate-assets
```

This uses `@capacitor/assets` to auto-generate all required icon and splash screen sizes.

---

## ☁️ Deployment

### Web — Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Vercel auto-detects Vite. Confirm these settings:

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. Go to **Settings → Environment Variables** and add all variables from `.env.example` with your real values
5. Click **Deploy**

> The redirect rule is important because Road Watch uses **HashRouter** — Netlify/Vercel must serve `index.html` for all paths.

---

## 🗺️ Application Routes

| Path | Access | Component | Description |
|---|---|---|---|
| `/` | Public | `Home` | Landing page with stats & features |
| `/login` | Public | `Login` | Email/password login |
| `/register` | Public | `Register` | New user registration |
| `/dashboard` | Authenticated | `Dashboard` | Map + reports + filter sidebar |
| `/report` | Authenticated | `ReportIssue` | Submit a new road damage report |
| `/analytics` | Authenticated | `Analytics` | Charts: trends, budget, resolution |
| `/admin` | Admin only | `AdminPanel` | Manage all reports, update statuses |
| `*` | Public | `NotFound` | 404 page |

Routes are **lazy-loaded** via `React.lazy` and `Suspense` for optimal performance.

---

## 🗄️ State Management

The Redux store has four slices:

| Slice | Responsibility |
|---|---|
| `auth` | Current user, token, login/register/logout thunks. Persisted to `localStorage` via a custom middleware. |
| `reports` | All fetched reports, loading/error state, fetch/create/update status thunks. |
| `filters` | Active filter values (severity, status, area, date range). |
| `ui` | Active modal name and modal payload data. |

Typed hooks `useAppDispatch` and `useAppSelector` are exported from `src/store/hooks.ts` for type-safe usage throughout the app.

---

## 🏗️ Key Design Decisions

**Image Compression**
Photos attached to reports are compressed client-side to a low-resolution Base64 string using `src/utils/imageCompressor.ts`. This avoids Firebase Storage egress costs and keeps each Firestore document under the 1 MB limit.

**HashRouter**
React Router uses `HashRouter` (URLs like `/#/dashboard`) to ensure compatibility with static hosting services (Vercel, Netlify, GitHub Pages) without needing server-side redirects for every route.

**Manual Chunk Splitting**
Vite is configured with `manualChunks` to split the bundle into logical vendor groups (`react-vendor`, `redux-vendor`, `chart-vendor`, `map-vendor`, `animation-vendor`), keeping initial load small.

**Role-Based Access Control**
Two route guard components — `ProtectedRoute` (requires authentication) and `AdminRoute` (requires `role === 'admin'`) — wrap layouts in `AppRoutes.tsx` to prevent unauthorized access.

**Mock API Mode**
Setting `VITE_ENABLE_MOCK_API=true` in `.env` activates mock data with configurable response delays, allowing frontend development without a live Firebase project.

**Theme Persistence**
Dark/light preference is stored in `localStorage` under the key defined by `VITE_THEME_STORAGE_KEY`, so the user's choice survives page refreshes.

---

## 🔧 Environment Variables Reference

Create a `.env` file in the project root using `.env.example` as your template.

| Variable | Description | Example |
|---|---|---|
| `VITE_APP_NAME` | Display name of the app | `Road Watch` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_API_BASE_URL` | Base URL for the REST API | `http://localhost:3001/api` |
| `VITE_MAP_DEFAULT_LAT` | Default map center latitude | `19.0760` |
| `VITE_MAP_DEFAULT_LNG` | Default map center longitude | `72.8777` |
| `VITE_MAP_DEFAULT_ZOOM` | Default map zoom level | `12` |
| `VITE_MAP_TILE_URL` | Dark map tile URL (CartoCDN) | *(see `.env.example`)* |
| `VITE_MAP_TILE_URL_LIGHT` | Light map tile URL (CartoCDN) | *(see `.env.example`)* |
| `VITE_MOCK_API_DELAY_MIN` | Min mock response delay (ms) | `300` |
| `VITE_MOCK_API_DELAY_MAX` | Max mock response delay (ms) | `800` |
| `VITE_ENABLE_MOCK_API` | Toggle mock API mode | `false` |
| `VITE_TOAST_DURATION` | Toast notification duration (ms) | `4000` |
| `VITE_DEFAULT_PAGE_SIZE` | Pagination page size | `10` |
| `VITE_AUTH_STORAGE_KEY` | localStorage key for auth state | `roadwatch_auth` |
| `VITE_THEME_STORAGE_KEY` | localStorage key for theme | `roadwatch_theme` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | *(from Firebase Console)* |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain | `your-app.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket | `your-app.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging sender ID | *(numeric)* |
| `VITE_FIREBASE_APP_ID` | Firebase App ID | `1:xxx:web:xxx` |

---

## 📜 Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Type-check with `tsc` then build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm run android:build` | Build web assets and sync to Android project |
| `npm run android:open` | Build, sync, and open in Android Studio |
| `npm run android:sync` | Sync latest web build to Android without rebuilding |
| `npm run generate-assets` | Generate Android icons & splash screens from source images |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please ensure:
- All TypeScript errors are resolved (`npm run build`)
- ESLint passes (`npm run lint`)
- New environment variables are documented in `.env.example`

---

## 📄 License

This project is private. All rights reserved.

---

<div align="center">
  <sub>Built with ❤️ for safer, more transparent cities.</sub>
</div>
