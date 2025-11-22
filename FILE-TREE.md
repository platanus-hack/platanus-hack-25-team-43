# 🌳 File Tree - Visual Reference

## Legend
- 🎯 = Entry point / Main file
- 🤖 = AI-powered feature
- 🔐 = Authentication
- 📊 = Dashboard component
- 🎨 = UI component
- 📡 = API endpoint
- 🛠️ = Utility / Helper
- ⚙️ = Configuration
- 📝 = Documentation

---

## Complete File Tree

```
student-onboarding-app/
│
├── 📝 README.md                           # Main project documentation
├── 📝 SETUP.md                            # Installation guide
├── 📝 PROJECT-STRUCTURE.md                # Detailed file documentation
├── 📝 QUICK-REFERENCE.md                  # Developer cheat sheet
├── 📝 FILE-TREE.md                        # This file
│
├── ⚙️ package.json                        # Dependencies & scripts
├── ⚙️ tsconfig.json                       # TypeScript config
├── ⚙️ next.config.mjs                     # Next.js config
├── ⚙️ components.json                     # Shadcn/UI config
├── ⚙️ postcss.config.mjs                  # PostCSS config
│
├── 🔒 .env.local                          # Environment variables (GITIGNORED!)
│
├── 📂 app/                                # Next.js App Router
│   ├── 🎯 page.tsx                        # Main entry point
│   ├── 🎯 layout.tsx                      # Root layout
│   ├── 🎨 globals.css                     # Global styles
│   │
│   └── 📂 api/                            # Backend API Routes
│       │
│       ├── 📂 analyze-responses/
│       │   └── 🤖 route.ts                # AI pathway analysis endpoint
│       │
│       ├── 📂 auth/
│       │   ├── 📂 login/
│       │   │   └── 🔐 route.ts            # Login endpoint
│       │   └── 📂 register/
│       │       └── 🔐 route.ts            # Registration endpoint
│       │
│       ├── 📂 generate-action-plan/
│       │   └── 🤖 route.ts                # AI action plan generation
│       │
│       ├── 📂 get-opportunities/
│       │   └── 📡 route.ts                # Opportunities endpoint
│       │
│       └── 📂 reminders/
│           ├── 📂 create/
│           │   └── 📡 route.ts            # Create reminder
│           ├── 📂 list/
│           │   └── 📡 route.ts            # List reminders
│           └── 📂 schedule/
│               └── 📡 route.ts            # Schedule reminder
│
├── 📂 components/                         # React Components
│   │
│   ├── 📂 auth/
│   │   └── 🔐 auth-page.tsx              # Login/Register UI
│   │
│   ├── 📂 onboarding/
│   │   ├── 🎯 onboarding-modal.tsx       # Main onboarding flow (7 steps)
│   │   ├── 🎨 multiple-choice.tsx        # MC questions component
│   │   ├── 🎨 open-ended.tsx             # Text input component
│   │   ├── 🎨 pathway-recommendations.tsx # Pathway selection UI
│   │   └── 🎨 report-upload.tsx          # File upload (unused)
│   │
│   ├── 📂 dashboard/
│   │   ├── 📊 dashboard.tsx              # Main dashboard container
│   │   ├── 🤖 action-plan-generator.tsx  # AI plan generation UI
│   │   ├── 📊 action-plan-display.tsx    # Full plan view
│   │   ├── 📊 action-plan-view.tsx       # Simplified plan view
│   │   ├── 📊 pathway-cards.tsx          # Pathway cards display
│   │   ├── 📊 opportunities-by-pathway.tsx # Grouped opportunities
│   │   ├── 📊 opportunities-list.tsx     # List of opportunities
│   │   └── 📊 reminders-section.tsx      # Reminders management
│   │
│   ├── 🎨 theme-provider.tsx             # Dark/Light mode provider
│   │
│   └── 📂 ui/                            # Reusable UI Components (50+)
│       ├── 🎨 button.tsx                 # Button component
│       ├── 🎨 card.tsx                   # Card container
│       ├── 🎨 input.tsx                  # Text input
│       ├── 🎨 dialog.tsx                 # Modal dialogs
│       ├── 🎨 tabs.tsx                   # Tab interface
│       ├── 🎨 select.tsx                 # Dropdown selector
│       ├── 🎨 toast.tsx                  # Toast notifications
│       ├── 🎨 toaster.tsx                # Toast container
│       ├── 🎨 accordion.tsx              # Collapsible sections
│       ├── 🎨 alert.tsx                  # Alert messages
│       ├── 🎨 alert-dialog.tsx           # Alert modals
│       ├── 🎨 avatar.tsx                 # User avatars
│       ├── 🎨 badge.tsx                  # Badges/pills
│       ├── 🎨 calendar.tsx               # Date picker
│       ├── 🎨 checkbox.tsx               # Checkboxes
│       ├── 🎨 progress.tsx               # Progress bars
│       ├── 🎨 skeleton.tsx               # Loading skeletons
│       ├── 🎨 spinner.tsx                # Loading spinners
│       ├── 🎨 table.tsx                  # Data tables
│       └── 🎨 [40+ more components...]
│
├── 📂 lib/                               # Utility Libraries
│   ├── 🤖 llm-client.ts                  # AI API client
│   ├── 🤖 action-plan-client.ts          # Action plan API client
│   ├── 🔐 auth-client.ts                 # Auth API client
│   ├── 📡 reminders-client.ts            # Reminders API client
│   └── 🛠️ utils.ts                       # Helper functions
│
├── 📂 hooks/                             # Custom React Hooks
│   ├── 🛠️ use-mobile.ts                  # Mobile detection
│   └── 🛠️ use-toast.ts                   # Toast hook
│
├── 📂 scripts/                           # Database Scripts
│   └── 🗄️ 01-init-schema.sql            # PostgreSQL schema
│
├── 📂 styles/                            # Additional Styles
│   └── 🎨 globals.css                    # Global CSS
│
└── 📂 public/                            # Static Assets
    ├── 🖼️ apple-icon.png                 # App icons
    ├── 🖼️ icon-dark-32x32.png
    ├── 🖼️ icon-light-32x32.png
    ├── 🖼️ icon.svg
    ├── 🖼️ placeholder-logo.png           # Logo placeholder
    ├── 🖼️ placeholder-logo.svg
    ├── 🖼️ placeholder-user.jpg           # User placeholder
    ├── 🖼️ placeholder.jpg                # General placeholder
    └── 🖼️ placeholder.svg
```

---

## 🚀 Key Files by Feature

### Authentication Flow
```
1. components/auth/auth-page.tsx          [UI]
2. lib/auth-client.ts                     [Client]
3. app/api/auth/login/route.ts            [API]
4. app/api/auth/register/route.ts         [API]
```

### Onboarding Flow
```
1. components/onboarding/onboarding-modal.tsx   [Main UI]
2. lib/llm-client.ts                            [Client]
3. app/api/analyze-responses/route.ts           [AI API]
```

### Action Plan Generation
```
1. components/dashboard/action-plan-generator.tsx [UI]
2. lib/action-plan-client.ts                      [Client]
3. app/api/generate-action-plan/route.ts          [AI API]
```

### Dashboard
```
1. components/dashboard/dashboard.tsx             [Main]
2. components/dashboard/pathway-cards.tsx         [Pathways]
3. components/dashboard/opportunities-by-pathway.tsx [Opportunities]
4. components/dashboard/reminders-section.tsx     [Reminders]
```

---

## 📊 File Counts

| Category | Count | Description |
|----------|-------|-------------|
| API Routes | 7 | Backend endpoints |
| Components | 70+ | React components (including UI) |
| UI Components | 50+ | Reusable Radix UI components |
| Libraries | 5 | Client-side utilities |
| Hooks | 2 | Custom React hooks |
| Config Files | 5 | Project configuration |
| Doc Files | 5 | Documentation |

---

## 🎯 File Importance Levels

### 🔥 Critical (Must understand)
- `app/page.tsx` - Main entry
- `app/api/analyze-responses/route.ts` - AI pathway analysis
- `app/api/generate-action-plan/route.ts` - AI plan generation
- `components/onboarding/onboarding-modal.tsx` - Onboarding
- `components/dashboard/dashboard.tsx` - Dashboard
- `components/dashboard/action-plan-generator.tsx` - Plan UI

### ⚡ Important (Frequently modified)
- `components/auth/auth-page.tsx` - Auth UI
- `lib/llm-client.ts` - AI client
- `lib/action-plan-client.ts` - Plan client
- `lib/auth-client.ts` - Auth client

### ✨ Supporting (UI & Utilities)
- `components/ui/*` - Reusable components
- `lib/utils.ts` - Helper functions
- `hooks/*` - Custom hooks

### ⚙️ Configuration (Rarely changed)
- `*.config.*` - Configuration files
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies

---

## 🗂️ Folders at a Glance

| Folder | Files | Purpose |
|--------|-------|---------|
| `app/` | 3 | Next.js App Router & API |
| `app/api/` | 7 | Backend API endpoints |
| `components/auth/` | 1 | Authentication UI |
| `components/onboarding/` | 5 | Onboarding flow |
| `components/dashboard/` | 8 | Dashboard features |
| `components/ui/` | 50+ | Reusable UI components |
| `lib/` | 5 | API clients & utilities |
| `hooks/` | 2 | Custom React hooks |
| `public/` | 8 | Static assets |
| `scripts/` | 1 | Database schema |

---

## 📝 Finding What You Need

### "I want to change the AI behavior"
→ `app/api/analyze-responses/route.ts` (pathways)
→ `app/api/generate-action-plan/route.ts` (action plans)

### "I want to modify the onboarding flow"
→ `components/onboarding/onboarding-modal.tsx`

### "I want to add a new API endpoint"
→ Create `app/api/your-endpoint/route.ts`

### "I want to create a new component"
→ Add to appropriate folder in `components/`

### "I want to change styling"
→ Tailwind classes inline or `app/globals.css`

### "I want to add authentication"
→ `app/api/auth/*/route.ts` & `lib/auth-client.ts`

### "I need to understand a component"
→ Check JSDoc comment at top of file
→ See `PROJECT-STRUCTURE.md` for details

---

## 🎓 Best Practices

✅ **DO:**
- Add JSDoc comments to new files
- Follow existing file naming conventions
- Put reusable UI in `components/ui/`
- Put API wrappers in `lib/`
- Keep components small and focused

❌ **DON'T:**
- Mix business logic in UI components
- Put React components in `lib/`
- Hardcode API keys (use .env.local)
- Skip error handling
- Ignore TypeScript errors

---

**Quick Tip:** Use `Cmd/Ctrl + P` in VSCode to quickly jump to any file! 🚀

