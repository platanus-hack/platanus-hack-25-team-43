# 🎓 Student Onboarding App

> Plataforma impulsada por IA para ayudar a estudiantes de LATAM a descubrir y planificar sus caminos profesionales

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Claude AI](https://img.shields.io/badge/Claude-3%20Haiku-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

---

## ✨ Features

- 🤖 **AI-Powered Pathway Recommendations** - Claude analyzes student profiles to suggest personalized career paths
- 📅 **12-Week Action Plans** - Detailed weekly tasks, milestones, and checkpoints
- 💼 **Curated Opportunities** - Internships, scholarships, courses, and summer camps for LATAM students
- 📚 **Resource Library** - Books, platforms, communities, and tools
- ⏰ **Smart Reminders** - Deadline tracking and WhatsApp integration
- 🎯 **Progress Tracking** - Monitor achievements and goals
- 🌙 **Dark Mode** - Beautiful UI with dark/light theme support
- 🔒 **Secure & Private** - Data stored locally, AI analysis is confidential

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd student-onboarding-app

# 2. Install dependencies
npm install

# 3. Create environment file
cat > .env.local << EOF
ANTHROPIC_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Detailed installation and configuration
- **[Project Structure](./PROJECT-STRUCTURE.md)** - Complete codebase organization and file purposes
- **[Quick Reference](./QUICK-REFERENCE.md)** - Cheat sheet for common tasks and debugging

---

## 🎯 How It Works

### 1️⃣ **Student Registration & Onboarding**
Students complete a 7-step onboarding process:
- School information
- Career motivations
- Goals and aspirations
- Academic performance
- AI analyzes their profile

### 2️⃣ **AI Pathway Recommendations**
Claude 3 Haiku analyzes the student's:
- Education level and performance
- Career motivations
- Long-term goals
- Interests and strengths

Then recommends 3 personalized career pathways with:
- Rationale for each recommendation
- Action steps to get started
- Timeline to proficiency

### 3️⃣ **Personalized Action Plan**
Once pathways are selected, students can generate a comprehensive 12-week action plan including:
- **Weekly Tasks** - Specific, actionable items with priorities
- **Opportunities** - Real internships, scholarships, courses (10+ options)
- **Resources** - Books, platforms, communities (15+ resources)
- **Reminders** - Key deadlines and checkpoints (20+ reminders)

### 4️⃣ **Dashboard & Tracking**
Students access their personalized dashboard with:
- Selected pathways prominently displayed
- Weekly task tracking
- Opportunity applications
- Progress monitoring
- Reminder management

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React
- **State:** React hooks + localStorage

### Backend
- **API Routes:** Next.js serverless functions
- **AI:** Claude 3 Haiku (Anthropic)
- **Authentication:** In-memory (development) / PostgreSQL (production)
- **Database:** PostgreSQL (optional, schema provided)

### Key Libraries
- `@ai-sdk/anthropic` - Claude AI integration
- `ai` - Vercel AI SDK
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `date-fns` - Date utilities
- `sonner` - Toast notifications

---

## 📂 Project Structure

```
student-onboarding-app/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints (AI, auth, etc.)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── auth/             # Authentication
│   ├── dashboard/        # Dashboard features
│   ├── onboarding/       # Onboarding flow
│   └── ui/              # Reusable UI components
├── lib/                   # Utility libraries
│   ├── llm-client.ts     # AI API client
│   ├── auth-client.ts    # Auth client
│   └── utils.ts          # Helper functions
├── scripts/              # Database scripts
└── [Config files]        # Next.js, TS, Tailwind configs
```

👉 **See [PROJECT-STRUCTURE.md](./PROJECT-STRUCTURE.md) for detailed documentation**

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required - Anthropic API Key for Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-...

# Optional - Database (for production)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Optional - App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 🎨 Features Overview

### AI-Powered Analysis
- **Model:** Claude 3 Haiku (fast, cost-effective)
- **Response Time:** 5-10 seconds for pathway analysis
- **Response Time:** 8-15 seconds for action plan generation
- **Accuracy:** Tailored for LATAM students

### Onboarding Flow
1. **School Info** - Type, name, year
2. **Motivation** - Career drivers
3. **Goals** - 3-5 year objectives
4. **Grades** - Academic performance
5. **Pathways** - AI recommendations
6. **Selection** - Choose pathways
7. **Summary** - Confirm choices

### Action Plan Components

#### 📅 Weekly Plan
- 12 weeks of structured tasks
- Priority levels (high/medium/low)
- Daily habit indicators
- Time estimates
- Weekly milestones

#### 💼 Opportunities
- Internships
- Scholarships
- Online courses
- Summer camps
- Competitions
- Deadlines and application periods

#### 📚 Resources
- Books
- Online platforms
- Communities
- Tools
- Cost indicators (free/paid/freemium)

#### ⏰ Reminders
- Application deadlines
- Checkpoints
- Progress reviews
- Custom reminders

---

## 🔐 Security Notes

**Current Setup (Development):**
- Authentication uses in-memory storage
- Passwords are **NOT hashed**
- Data resets on server restart
- Suitable for development only

**For Production:**
- Implement PostgreSQL database
- Hash passwords with bcrypt
- Add JWT token authentication
- Implement CSRF protection
- Add rate limiting
- Use HTTPS

---

## 🌍 LATAM Focus

This app is specifically designed for students in Latin America:

- 🌎 **Spanish Language** - UI and content in Spanish
- 💰 **Accessible Opportunities** - Focus on free and scholarship-based options
- 🎓 **Regional Context** - Considers LATAM education system
- 🚀 **International Preparation** - Helps prepare for global opportunities
- 💻 **Remote-Friendly** - Emphasizes online and remote options

---

## 📊 Database Schema

PostgreSQL schema available in `scripts/01-init-schema.sql`

**Tables:**
- `users` - User accounts
- `onboarding_responses` - Saved onboarding data
- `pathways` - Career pathway selections
- `opportunities` - Curated opportunities
- `action_plans` - Generated action plans
- `reminders` - Scheduled reminders

**Note:** Currently optional - app works with localStorage

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Known Issues & TODOs

- [ ] Replace in-memory auth with database
- [ ] Add password hashing
- [ ] Implement email verification
- [ ] Add unit tests
- [ ] Complete WhatsApp integration
- [ ] Add analytics
- [ ] Improve error handling
- [ ] Add loading skeletons

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Claude AI** by Anthropic - Powering intelligent recommendations
- **Next.js** - Amazing React framework
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - AI SDK and hosting

---

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** Open a GitHub issue
- **Questions:** Check [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)

---

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Student onboarding flow
- [x] AI pathway recommendations
- [x] Action plan generation
- [x] Basic dashboard

### Phase 2 (Next)
- [ ] Database integration
- [ ] Proper authentication
- [ ] WhatsApp reminders
- [ ] Progress tracking

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Mentor matching
- [ ] Community features
- [ ] Analytics dashboard

---

**Made with ❤️ for LATAM students**

Start your journey today! 🚀

