# Supabase Setup Instructions

## Overview
This guide walks you through setting up Supabase authentication and database for the Platanus Hack project.

## Prerequisites
- A Supabase account (https://supabase.com)
- Access to the Supabase project dashboard

## Step 1: Environment Variables

### Create `.env.local` file
The `.env.local` file is blocked by `.gitignore` for security. You need to create it manually:

```bash
# In the project root directory
touch .env.local
```

### Add Supabase Credentials
According to `SUPABASE-AUTH-GUIDE.md`, add these credentials to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://warsrhhanfmujkewgytm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-actual-anon-key-here>

# Anthropic API Configuration
ANTHROPIC_API_KEY=<your-anthropic-key-here>
```

**⚠️ Important**: Replace `<your-actual-anon-key-here>` with the actual anonymous key from your Supabase project settings (Settings → API).

## Step 2: Database Schema Setup

### Run the Initial Schema Script

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click "New Query"
4. Copy and paste the contents of `scripts/01-init-schema.sql`
5. Click "Run" to execute

This creates the following tables:
- `users` - User profiles
- `onboarding_responses` - Student onboarding data
- `pathways` - Career pathways
- `opportunities` - Internships, courses, etc.
- `action_plans` - 12-week action plans
- `reminders` - WhatsApp reminders

### Run the RLS Policies Script

1. In the same SQL Editor
2. Create a new query
3. Copy and paste the contents of `scripts/02-setup-rls-policies.sql`
4. Click "Run" to execute

This sets up:
- Row Level Security (RLS) on all tables
- Policies ensuring users can only access their own data
- Automatic user profile creation trigger
- Timestamp update triggers

## Step 3: Verify Setup

### Check Tables
Go to **Table Editor** in Supabase Dashboard and verify these tables exist:
- ✅ users
- ✅ onboarding_responses
- ✅ pathways
- ✅ opportunities
- ✅ action_plans
- ✅ reminders

### Check RLS Policies
1. Click on any table in Table Editor
2. Click "Policies" tab
3. Verify policies are enabled (should show green "RLS enabled")

### Test Authentication
Run the verification query in SQL Editor:

```sql
-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'onboarding_responses', 'pathways', 'opportunities', 'action_plans', 'reminders');

-- Should show rowsecurity = true for all tables
```

## Step 4: Configure Authentication Settings

### Email Auth Settings (Optional but Recommended)

1. Go to **Authentication → Settings** in Supabase
2. Under "Email Auth":
   - ✅ Enable Email Confirmations (recommended for production)
   - ⚠️ Disable Email Confirmations (for development/testing)
3. Under "Auth Providers":
   - ✅ Email provider should be enabled by default

### Password Requirements
Default settings are fine:
- Minimum password length: 6 characters

## Step 5: Test the Application

### Start the Development Server
```bash
npm run dev
```

### Test Registration Flow
1. Go to `http://localhost:3000`
2. Click "Crear Cuenta"
3. Enter email, password (min 6 chars), and name
4. Verify:
   - User is created in Supabase Dashboard → Authentication → Users
   - Profile is created in `users` table
   - User is automatically logged in

### Test Login Flow
1. Log out from the app
2. Click "Iniciar Sesión"
3. Enter credentials
4. Verify successful login and session persistence

### Test Protected Routes
1. While logged in, open browser console
2. Try accessing API routes:
```javascript
// Should work (authenticated)
fetch('/api/generate-action-plan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    selectedPathways: ['Software Engineering'],
    schoolInfo: { schoolType: 'universidad', schoolName: 'Test', currentYear: 1 }
  })
}).then(r => r.json()).then(console.log)
```

3. Log out and try again - should get 401 Unauthorized

## Troubleshooting

### Error: "Supabase client not initialized"
**Cause**: Environment variables not loaded
**Solution**: 
- Verify `.env.local` exists and has correct values
- Restart dev server: `npm run dev`

### Error: "relation does not exist"
**Cause**: Database tables not created
**Solution**: 
- Run `scripts/01-init-schema.sql` in Supabase SQL Editor

### Error: "new row violates row-level security policy"
**Cause**: RLS policies not set up correctly
**Solution**: 
- Run `scripts/02-setup-rls-policies.sql` in Supabase SQL Editor
- Verify policies are enabled in Table Editor

### Sessions not persisting
**Cause**: LocalStorage issues or incorrect configuration
**Solution**:
- Clear browser cache and cookies
- Verify not in incognito mode
- Check browser console for errors

## Security Checklist

Before deploying to production:

- [ ] Email confirmation enabled in Supabase Auth settings
- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] No hardcoded credentials in code
- [ ] RLS enabled on all tables
- [ ] RLS policies tested and working
- [ ] Service role key (if used) is kept secret
- [ ] HTTPS enforced (Vercel does this automatically)

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## Support

If you encounter issues:
1. Check the Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify environment variables are loaded: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
4. Check API route responses for error messages

---

**Last Updated**: November 22, 2025


