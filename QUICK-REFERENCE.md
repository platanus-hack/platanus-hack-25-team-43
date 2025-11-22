# ⚡ Quick Reference Guide

## 🔥 Most Important Files

### 🎯 Main Entry Points
| File | Purpose | When to Edit |
|------|---------|--------------|
| `app/page.tsx` | Main app entry & routing | Add new top-level features |
| `app/layout.tsx` | Root layout & metadata | Change app-wide settings |
| `.env.local` | Environment variables | Configure API keys |

### 🤖 AI-Powered Features
| File | AI Feature | Model Used |
|------|-----------|------------|
| `app/api/analyze-responses/route.ts` | Pathway recommendations | Claude 3 Haiku |
| `app/api/generate-action-plan/route.ts` | 12-week action plans | Claude 3 Haiku |

### 🎨 Main UI Components
| Component | Location | Purpose |
|-----------|----------|---------|
| **Auth** | `components/auth/auth-page.tsx` | Login & registration |
| **Onboarding** | `components/onboarding/onboarding-modal.tsx` | 7-step onboarding flow |
| **Dashboard** | `components/dashboard/dashboard.tsx` | Main student dashboard |
| **Plan Generator** | `components/dashboard/action-plan-generator.tsx` | AI plan creation UI |

### 📡 API Clients
| Client | Location | Purpose |
|--------|----------|---------|
| Auth | `lib/auth-client.ts` | Login, register, logout |
| AI Analysis | `lib/llm-client.ts` | Pathway recommendations |
| Action Plans | `lib/action-plan-client.ts` | Plan generation |
| Reminders | `lib/reminders-client.ts` | Reminder management |

---

## 🚀 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 🔑 Environment Setup

Create `.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 Data Flow Diagrams

### User Journey
```
Register/Login → Onboarding (7 steps) → AI Analysis → 
  → Pathway Selection → Dashboard → Generate Action Plan → 
  → Explore Opportunities → Set Reminders
```

### AI Pathway Analysis
```
User Input (school, grades, goals) → 
  → /api/analyze-responses → 
  → Claude 3 Haiku → 
  → 3 Recommended Pathways → 
  → User Selection → 
  → Saved to localStorage
```

### Action Plan Generation
```
User Profile + Selected Pathways → 
  → /api/generate-action-plan → 
  → Claude 3 Haiku → 
  → 12-Week Plan (weeks, opportunities, resources, reminders) → 
  → Displayed in 4 tabs → 
  → Saved to localStorage
```

---

## 🗂️ File Organization Rules

### API Routes (`app/api/`)
- One route per folder
- Use `route.ts` filename
- Export async `POST`, `GET`, etc.
- Always return `Response.json()`

### Components (`components/`)
```
components/
├── auth/           # Authentication screens
├── dashboard/      # Post-onboarding features
├── onboarding/     # Onboarding flow
└── ui/            # Reusable UI primitives
```

### Libraries (`lib/`)
- Client-side API wrappers
- Utility functions
- NO React components here

---

## 🎯 Common Tasks

### Add a New API Endpoint
1. Create `app/api/your-endpoint/route.ts`
2. Export async function (POST, GET, etc.)
3. Add error handling
4. Create client function in `lib/`

### Add a New Component
1. Create file in appropriate folder
2. Use TypeScript interfaces for props
3. Export as default
4. Import in parent component

### Modify AI Behavior
1. Edit prompt in API route
2. Adjust temperature (0.0-1.0)
3. Change maxTokens if needed
4. Test with real data

### Add a New Pathway
1. Generated automatically by AI
2. No hardcoded pathways
3. User can add custom pathways

---

## 🐛 Debugging Guide

### Check Logs
```bash
# Terminal output shows API calls
# Look for:
[v0] Error analyzing responses: ...
[v0] API Key present: ...
```

### Common Issues

#### AI Not Working
- ✅ Check `.env.local` has `ANTHROPIC_API_KEY`
- ✅ Restart dev server after adding env vars
- ✅ Check terminal for error messages

#### Auth Not Working
- ✅ In-memory storage resets on server restart
- ✅ Check localStorage in browser DevTools
- ✅ Verify `userToken` exists

#### Hot Reload Issues
- ✅ Refresh browser manually
- ✅ Check terminal for compilation errors
- ✅ Restart dev server

---

## 📝 Code Style Guide

### TypeScript
```typescript
// ✅ Good: Interfaces for props
interface MyComponentProps {
  name: string
  age: number
}

// ✅ Good: Async/await
const data = await fetchData()

// ❌ Bad: Any types
const data: any = ...
```

### React Components
```typescript
// ✅ Good: Functional components
export default function MyComponent({ name }: Props) {
  return <div>{name}</div>
}

// ✅ Good: useState for state
const [count, setCount] = useState(0)

// ✅ Good: useEffect for side effects
useEffect(() => {
  // Load data
}, [])
```

### API Routes
```typescript
// ✅ Good: Error handling
export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Process...
    return Response.json({ success: true, data })
  } catch (error) {
    console.error("Error:", error)
    return Response.json(
      { success: false, error: "Message" },
      { status: 500 }
    )
  }
}
```

---

## 🔐 Security Checklist

- [x] API keys in `.env.local` (not committed)
- [x] API keys only used server-side
- [ ] TODO: Hash passwords (currently plaintext!)
- [ ] TODO: Add CSRF protection
- [ ] TODO: Add rate limiting
- [ ] TODO: Sanitize user inputs

---

## 📦 Dependencies Quick Ref

### Core
- `next@16.0.3` - Framework
- `react@19.2.0` - UI library
- `typescript@5` - Type safety

### AI
- `@ai-sdk/anthropic` - Claude integration
- `ai@latest` - Vercel AI SDK

### UI
- `tailwindcss@4` - Styling
- `@radix-ui/*` - Component primitives
- `lucide-react` - Icons

### Forms
- `react-hook-form` - Form handling
- `zod` - Validation

---

## 🎓 Learning Resources

### Next.js 16
- [Next.js Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### Claude AI
- [Anthropic Docs](https://docs.anthropic.com/)
- [Model Garden](https://docs.anthropic.com/claude/docs/models-overview)

### Radix UI
- [Radix Docs](https://www.radix-ui.com/)
- [Shadcn/UI](https://ui.shadcn.com/)

---

## 🚨 Emergency Commands

```bash
# Server won't start
rm -rf .next
npm run dev

# Port already in use
lsof -ti:3000 | xargs kill -9

# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Clear all localStorage data
# In browser console:
localStorage.clear()
```

---

## 📞 Need Help?

1. Check `PROJECT-STRUCTURE.md` for detailed docs
2. Check `SETUP.md` for setup instructions
3. Check component files for JSDoc comments
4. Check API routes for request/response examples

---

**Pro Tip:** Keep this file open while coding! 💡

