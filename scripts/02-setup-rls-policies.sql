-- =====================================================
-- SUPABASE RLS POLICIES SETUP
-- =====================================================
-- This script sets up Row Level Security policies for all tables
-- Run this in your Supabase SQL Editor after running 01-init-schema.sql

-- =====================================================
-- USERS TABLE - RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- ONBOARDING_RESPONSES TABLE - RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own onboarding responses
CREATE POLICY "Users can view own onboarding"
  ON onboarding_responses FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own onboarding responses
CREATE POLICY "Users can insert own onboarding"
  ON onboarding_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own onboarding responses
CREATE POLICY "Users can update own onboarding"
  ON onboarding_responses FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- PATHWAYS TABLE - RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own pathways
CREATE POLICY "Users can view own pathways"
  ON pathways FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own pathways
CREATE POLICY "Users can insert own pathways"
  ON pathways FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pathways
CREATE POLICY "Users can update own pathways"
  ON pathways FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own pathways
CREATE POLICY "Users can delete own pathways"
  ON pathways FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- OPPORTUNITIES TABLE - RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view opportunities (public catalog)
CREATE POLICY "Everyone can view opportunities"
  ON opportunities FOR SELECT
  TO authenticated
  USING (true);

-- Note: Only admins should insert/update/delete opportunities
-- These policies can be added later with admin role checks

-- =====================================================
-- ACTION_PLANS TABLE - RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own action plans
CREATE POLICY "Users can view own action plans"
  ON action_plans FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own action plans
CREATE POLICY "Users can insert own action plans"
  ON action_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own action plans
CREATE POLICY "Users can update own action plans"
  ON action_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own action plans
CREATE POLICY "Users can delete own action plans"
  ON action_plans FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- REMINDERS TABLE - RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reminders
CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own reminders
CREATE POLICY "Users can insert own reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reminders
CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own reminders
CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS - Auto-create user profile on signup
-- =====================================================

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to action_plans table
DROP TRIGGER IF EXISTS update_action_plans_updated_at ON action_plans;
CREATE TRIGGER update_action_plans_updated_at
  BEFORE UPDATE ON action_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'onboarding_responses', 'pathways', 'opportunities', 'action_plans', 'reminders');

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;


