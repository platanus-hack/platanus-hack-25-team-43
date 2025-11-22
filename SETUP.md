# Student Onboarding App - Local Setup Guide

## Prerequisites
- Node.js 18+ 
- npm (Node package manager) ✅ Installed
- Claude API key (Anthropic) ✅ **CONFIGURED**

## Quick Start

✅ **Completed:**
- Dependencies installed
- Authentication fixed (using in-memory storage)
- Data structure mismatch between frontend and API fixed
- **Claude (Anthropic) SDK configured** - Using Claude 3.5 Sonnet
- API key configured in `.env.local`

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Required: Anthropic API Key for Claude AI-powered pathway analysis
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Database Configuration
# DATABASE_URL=postgresql://user:password@localhost:5432/student_onboarding

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**To get an Anthropic API key:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Create a new API key
4. Copy and paste it into your `.env.local` file

### 3. Run the Development Server
```bash
pnpm dev
```

The app will be available at **http://localhost:3000**

### 4. (Optional) Set Up Database
If you want to use the full database features:

1. Install PostgreSQL locally or use a service like Supabase
2. Create a database called `student_onboarding`
3. Run the initialization script:
   ```bash
   psql -d student_onboarding -f scripts/01-init-schema.sql
   ```
4. Add your `DATABASE_URL` to `.env.local`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Features

- **Student Onboarding**: Multi-step questionnaire with AI analysis
- **Pathway Recommendations**: AI-powered career path suggestions using Claude
- **Action Plans**: Personalized steps based on student profile
- **Opportunities**: Curated internships, courses, and summer camps
- **Reminders**: WhatsApp integration for follow-ups

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI Components
- **Claude 3.5 Sonnet (Anthropic)** - AI-powered analysis
- PostgreSQL (optional)

## Notes

- Currently, authentication uses in-memory storage (data resets on server restart)
- The database schema is provided but not all features require it
- AI analysis uses Claude 3.5 Sonnet for intelligent career pathway recommendations
- Server is currently running at http://localhost:3000

