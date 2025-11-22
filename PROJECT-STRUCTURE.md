# 📁 Student Onboarding App - Project Structure

## 📋 Table of Contents
- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [API Routes](#api-routes)
- [Components](#components)
- [Libraries](#libraries)
- [Configuration Files](#configuration-files)

---

## 🎯 Overview

This is a Next.js 16 application that provides personalized career pathway recommendations and action plans for students in LATAM, powered by Claude AI.

**Tech Stack:**
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + Custom components
- **AI:** Claude 3 Haiku (Anthropic)
- **State Management:** React hooks + localStorage

---

## 📂 Directory Structure

```
student-onboarding-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── analyze-responses/    # AI pathway analysis
│   │   ├── auth/                 # Authentication
│   │   ├── generate-action-plan/ # AI action plan generation
│   │   ├── get-opportunities/    # Opportunities fetching
│   │   └── reminders/            # Reminder management
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Homepage (main entry)
│
├── components/                   # React Components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── onboarding/              # Onboarding flow components
│   ├── ui/                      # Reusable UI components (Radix)
│   └── theme-provider.tsx       # Dark/Light mode provider
│
├── lib/                         # Utility libraries
│   ├── action-plan-client.ts   # Action plan API client
│   ├── auth-client.ts          # Auth API client
│   ├── llm-client.ts           # AI/LLM API client
│   ├── reminders-client.ts     # Reminders API client
│   └── utils.ts                # Utility functions
│
├── hooks/                       # Custom React hooks
│   ├── use-mobile.ts           # Mobile detection hook
│   └── use-toast.ts            # Toast notifications hook
│
├── public/                      # Static assets
│   ├── *.png, *.svg            # Icons and images
│   └── placeholder-*           # Placeholder images
│
├── scripts/                     # Database & setup scripts
│   └── 01-init-schema.sql      # PostgreSQL schema
│
├── styles/                      # Additional styles
│   └── globals.css             # Global CSS
│
└── [Config Files]              # See Configuration section below
```

---

## 🔌 API Routes

### 📍 `/api/analyze-responses`
**File:** `app/api/analyze-responses/route.ts`

**Purpose:** Analyzes student onboarding responses using Claude AI to recommend personalized career pathways.

**Input:**
```typescript
{
  name: string
  schoolType: "colegio" | "universidad"
  schoolName: string
  currentYear: number
  motivation: string
  goals: string
  grades: Array<{ subject: string; grade: number }>
}
```

**Output:**
```typescript
{
  success: boolean
  pathways: Array<{
    name: string
    rationale: string
    actionSteps: string[]
    timeline: string
  }>
}
```

**AI Model:** Claude 3 Haiku
**Average Response Time:** 5-10 seconds

---

### 📍 `/api/auth/login`
**File:** `app/api/auth/login/route.ts`

**Purpose:** Authenticates users with email and password (in-memory storage for development).

**Input:**
```typescript
{
  email: string
  password: string
}
```

**Output:**
```typescript
{
  success: boolean
  user?: { id: string; email: string; name: string }
  token?: string
  error?: string
}
```

**Storage:** In-memory Map (resets on server restart)

---

### 📍 `/api/auth/register`
**File:** `app/api/auth/register/route.ts`

**Purpose:** Registers new users with name, email, and password.

**Input:**
```typescript
{
  name: string
  email: string
  password: string
}
```

**Output:**
```typescript
{
  success: boolean
  user?: { id: string; email: string; name: string }
  token?: string
  error?: string
}
```

**Note:** Passwords are NOT hashed in development. Use proper hashing in production!

---

### 📍 `/api/generate-action-plan`
**File:** `app/api/generate-action-plan/route.ts`

**Purpose:** Generates a comprehensive 12-week action plan with opportunities, resources, and reminders using Claude AI.

**Input:**
```typescript
{
  name: string
  selectedPathways: string[]
  schoolInfo: {
    schoolType: string
    schoolName: string
    currentYear: number
  }
  motivation: string
  goals: string
}
```

**Output:**
```typescript
{
  success: boolean
  plan: {
    title: string
    overview: string
    weeks: Array<Week>           // 12 weeks of tasks
    opportunities: Array<Opportunity>  // 10+ opportunities
    resources: Array<Resource>   // 15+ resources
    reminders: Array<Reminder>   // 20+ reminders
    checkpoints: Array<Checkpoint>
  }
}
```

**AI Model:** Claude 3 Haiku
**Average Response Time:** 8-15 seconds

---

### 📍 `/api/get-opportunities`
**File:** `app/api/get-opportunities/route.ts`

**Purpose:** Fetches or generates opportunities (internships, courses, scholarships) based on selected pathways.

---

### 📍 `/api/reminders/*`
**Files:** 
- `app/api/reminders/create/route.ts`
- `app/api/reminders/list/route.ts`
- `app/api/reminders/schedule/route.ts`

**Purpose:** Manages reminder creation, listing, and scheduling for WhatsApp integration.

---

## 🧩 Components

### Authentication Components

#### `components/auth/auth-page.tsx`
**Purpose:** Combined login/register page with tab interface
**Features:**
- Toggle between login and register
- Form validation
- Error handling
- Success callbacks

---

### Onboarding Components

#### `components/onboarding/onboarding-modal.tsx`
**Purpose:** Main onboarding flow orchestrator (multi-step modal)

**Steps:**
1. **schoolInfo** - School type, name, and year
2. **motivation** - Career motivation questions
3. **goals** - 3-5 year goals
4. **grades** - Subject grades entry
5. **pathways** - AI-recommended pathways selection
6. **selection** - Custom pathway addition
7. **summary** - Final confirmation with chosen pathways

**Key Functions:**
- `handleNext()` - Navigates to next step, triggers AI analysis after grades
- `handleComplete()` - Saves onboarding data permanently
- `analyzeStudentResponses()` - Calls AI API

---

#### `components/onboarding/multiple-choice.tsx`
**Purpose:** Multiple choice question component
**Use Case:** Career preferences, work style questions

---

#### `components/onboarding/open-ended.tsx`
**Purpose:** Text input for open-ended questions
**Use Case:** Goals, challenges, motivations

---

#### `components/onboarding/pathway-recommendations.tsx`
**Purpose:** Displays and allows selection of recommended career pathways
**Features:**
- Shows AI-recommended pathways with "Recommended" badge
- Expandable details (rationale, action steps, timeline)
- Multi-select functionality

---

#### `components/onboarding/report-upload.tsx`
**Purpose:** File upload component for academic reports
**Status:** Placeholder (not currently used)

---

### Dashboard Components

#### `components/dashboard/dashboard.tsx`
**Purpose:** Main dashboard container after onboarding

**Sections:**
1. Welcome header with user info
2. Selected pathways banner (prominent display)
3. Action plan generator (if no plan exists)
4. Pathway cards
5. Opportunities by pathway
6. Action plan display (if plan exists)
7. Reminders section

**State Management:**
- `actionPlan` - Generated action plan
- `userInfo` - User profile information
- `selectedPathways` - Chosen career pathways
- `onboardingData` - Full onboarding data

---

#### `components/dashboard/action-plan-generator.tsx`
**Purpose:** Interactive UI for generating personalized action plans with Claude AI

**Features:**
- **Introduction Screen:** Shows what the plan includes
- **Generation Button:** Triggers AI plan creation
- **Loading State:** Shows progress animation
- **4-Tab Display:**
  - 📅 Weekly Plan (12 weeks)
  - 💼 Opportunities (internships, scholarships, etc.)
  - 📚 Resources (books, platforms, tools)
  - ⏰ Reminders (deadlines, checkpoints)

**Key Functions:**
- `handleGeneratePlan()` - Calls AI API to generate plan
- Saves plan to localStorage automatically
- Triggers `onPlanGenerated` callback

---

#### `components/dashboard/action-plan-display.tsx`
**Purpose:** Displays generated action plan in detail
**Features:**
- Week-by-week tasks
- Progress tracking
- Milestone markers

---

#### `components/dashboard/action-plan-view.tsx`
**Purpose:** Simplified view of action plan
**Use Case:** Quick overview without full details

---

#### `components/dashboard/pathway-cards.tsx`
**Purpose:** Visual cards showing selected career pathways
**Features:**
- Pathway icons and names
- Quick stats
- Navigation to details

---

#### `components/dashboard/opportunities-by-pathway.tsx`
**Purpose:** Groups and displays opportunities organized by pathway
**Features:**
- Filterable by pathway
- Shows opportunity type (internship, course, etc.)
- Application deadlines

---

#### `components/dashboard/opportunities-list.tsx`
**Purpose:** List view of all opportunities
**Features:**
- Sortable and filterable
- Direct links to applications

---

#### `components/dashboard/reminders-section.tsx`
**Purpose:** Manages and displays reminders
**Features:**
- WhatsApp integration
- Scheduled notifications
- Reminder creation

---

### UI Components (`components/ui/`)

These are reusable, generic UI components based on Radix UI primitives:

| Component | Purpose |
|-----------|---------|
| `accordion.tsx` | Collapsible content sections |
| `alert-dialog.tsx` | Modal confirmation dialogs |
| `alert.tsx` | Notification alerts |
| `button.tsx` | Primary button component |
| `card.tsx` | Container card component |
| `dialog.tsx` | Modal dialogs |
| `input.tsx` | Text input fields |
| `select.tsx` | Dropdown selectors |
| `tabs.tsx` | Tabbed interface |
| `toast.tsx` | Notification toasts |
| `...` | And 40+ more components |

**Note:** All UI components follow consistent design patterns and support dark mode.

---

## 📚 Libraries (`lib/`)

### `lib/llm-client.ts`
**Purpose:** Client-side functions for AI-powered features

**Functions:**
- `analyzeStudentResponses()` - Analyzes onboarding data and returns pathway recommendations
- `getOpportunitiesForPathways()` - Fetches opportunities for specific pathways

---

### `lib/action-plan-client.ts`
**Purpose:** Client-side API calls for action plan generation

**Functions:**
- `generateActionPlan()` - Generates 12-week personalized action plan with Claude AI

---

### `lib/auth-client.ts`
**Purpose:** Client-side authentication functions

**Functions:**
- `loginUser()` - Authenticates user
- `registerUser()` - Creates new user account
- `logoutUser()` - Clears session
- `getCurrentUser()` - Gets logged-in user data

---

### `lib/reminders-client.ts`
**Purpose:** Client-side reminder management

**Functions:**
- `createReminder()` - Creates new reminder
- `listReminders()` - Gets all reminders for user
- `scheduleReminder()` - Schedules WhatsApp notification

---

### `lib/utils.ts`
**Purpose:** General utility functions

**Functions:**
- `cn()` - Class name merger (uses clsx + tailwind-merge)
- Other helper functions

---

## ⚙️ Configuration Files

### `next.config.mjs`
**Purpose:** Next.js configuration
**Contains:** Build settings, environment variables, optimizations

### `tsconfig.json`
**Purpose:** TypeScript configuration
**Contains:** Compiler options, path aliases, type checking rules

### `tailwind.config.js` (generated)
**Purpose:** Tailwind CSS configuration
**Contains:** Theme customization, colors, plugins

### `postcss.config.mjs`
**Purpose:** PostCSS configuration
**Contains:** Tailwind CSS processing

### `components.json`
**Purpose:** Shadcn/UI components configuration
**Contains:** Component import paths, style preferences

### `package.json`
**Purpose:** Project dependencies and scripts

**Scripts:**
- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Key Dependencies:**
- `next@16.0.3` - Next.js framework
- `react@19.2.0` - React library
- `@ai-sdk/anthropic` - Claude AI integration
- `ai@latest` - Vercel AI SDK
- `@radix-ui/*` - UI component primitives
- `tailwindcss@4` - Utility-first CSS

---

## 🗄️ Database Schema

### `scripts/01-init-schema.sql`
**Purpose:** PostgreSQL database initialization script

**Tables:**
1. **users** - User accounts
2. **onboarding_responses** - Saved onboarding data
3. **pathways** - Career pathway selections
4. **opportunities** - Internships, courses, etc.
5. **action_plans** - Generated action plans
6. **reminders** - Scheduled reminders

**Note:** Currently, most data uses localStorage for development. Database integration is optional.

---

## 🔐 Environment Variables

### `.env.local` (not in repo)
**Required Variables:**
```bash
# Required for AI features
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Notes:**
- Never commit `.env.local` to git
- API keys are server-side only (not exposed to client)
- Use `.env.example` as template

---

## 🚀 Data Flow

### Onboarding Flow
```
User Registration
    ↓
Auth Page (login/register)
    ↓
Onboarding Modal (7 steps)
    ↓
AI Analysis (Claude)
    ↓
Pathway Selection
    ↓
Summary Screen
    ↓
Dashboard
```

### Action Plan Generation Flow
```
Dashboard (no plan)
    ↓
Action Plan Generator
    ↓
User clicks "Generate"
    ↓
API Call to /api/generate-action-plan
    ↓
Claude AI generates plan (8-15 seconds)
    ↓
Plan displayed in 4 tabs
    ↓
Saved to localStorage
    ↓
Visible in dashboard
```

---

## 📝 Key Features by File

### AI-Powered Features
- **Pathway Recommendations:** `app/api/analyze-responses/route.ts`
- **Action Plan Generation:** `app/api/generate-action-plan/route.ts`
- **Both use:** Claude 3 Haiku (`claude-3-haiku-20240307`)

### User Interface
- **Main Entry:** `app/page.tsx`
- **Authentication:** `components/auth/auth-page.tsx`
- **Onboarding:** `components/onboarding/onboarding-modal.tsx`
- **Dashboard:** `components/dashboard/dashboard.tsx`
- **Plan Generator:** `components/dashboard/action-plan-generator.tsx`

### State Management
- **Authentication:** In-memory Map + localStorage
- **User Data:** localStorage (`onboardingData`, `userToken`)
- **Action Plan:** localStorage (`actionPlan`)
- **Reminders:** localStorage + API

---

## 🎨 Styling System

- **Global Styles:** `app/globals.css`
- **Utility Classes:** Tailwind CSS 4
- **Components:** Radix UI primitives + custom styling
- **Theme:** Dark/Light mode via `components/theme-provider.tsx`
- **Colors:** CSS variables defined in globals.css

---

## 🧪 Testing & Development

### Local Development
```bash
npm run dev
```
Server runs at: http://localhost:3000

### Key Development Notes
- Hot reload enabled
- TypeScript checking on build
- ESLint configured
- API routes are serverless functions

---

## 📦 Build & Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Requirements
- Node.js 18+
- Anthropic API key
- (Optional) PostgreSQL database

---

## 🔄 Future Improvements

- [ ] Replace in-memory auth with real database
- [ ] Implement password hashing (bcrypt)
- [ ] Add email verification
- [ ] Integrate PostgreSQL fully
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Implement WhatsApp API integration
- [ ] Add analytics tracking

---

## 📞 Support & Documentation

For more information:
- **Setup Guide:** `SETUP.md`
- **API Documentation:** See individual route files
- **Component Docs:** JSDoc comments in files

---

**Last Updated:** November 22, 2025
**Version:** 1.0.0

