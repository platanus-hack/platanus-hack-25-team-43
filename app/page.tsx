/**
 * @file app/page.tsx
 * @description Main application entry point and routing logic
 * 
 * This component manages the application's primary flow:
 * 1. Authentication check (login/register)
 * 2. Onboarding modal (if not completed)
 * 3. Dashboard (after onboarding)
 * 
 * Uses localStorage to persist:
 * - userToken (authentication)
 * - onboardingComplete (onboarding status)
 * 
 * @see components/auth/auth-page.tsx - Authentication UI
 * @see components/onboarding/onboarding-modal.tsx - Onboarding flow
 * @see components/dashboard/dashboard.tsx - Main dashboard
 */

"use client"

import { useState, useEffect } from "react"
import OnboardingModal from "@/components/onboarding/onboarding-modal"
import Dashboard from "@/components/dashboard/dashboard"
import AuthPage from "@/components/auth/auth-page"
import { getCurrentUser, onAuthStateChange } from "@/lib/auth-client"
import { checkClientEnvironment } from "@/lib/env-validation"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [hasDismissedOnboarding, setHasDismissedOnboarding] = useState(false)
  const [dashboardSession, setDashboardSession] = useState(0)

  useEffect(() => {
    setMounted(true)
    // Validate environment variables on startup
    checkClientEnvironment()
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check authentication status with Supabase
    const checkAuth = async () => {
      const user = await getCurrentUser()
      
      if (!user) {
        setIsAuthenticated(false)
        setIsOnboarded(false)
        setHasDismissedOnboarding(false)
        setIsLoading(false)
        return
      }

      // Check onboarding status from Supabase (user-specific)
      const supabase = await import("@/lib/supabase-browser").then(m => m.getSupabaseBrowserClient())
      if (supabase) {
        const { data: onboardingData } = await supabase
          .from("onboarding")
          .select("completed_at, permanent")
          .eq("email", user.email)
          .maybeSingle()

        const hasCompletedOnboarding = !!onboardingData?.completed_at
        const onboardingDismissed = localStorage.getItem("onboardingDismissed") === "true"

        setIsAuthenticated(true)
        setIsOnboarded(hasCompletedOnboarding)
        setHasDismissedOnboarding(onboardingDismissed)
      } else {
        setIsAuthenticated(true)
        setIsOnboarded(false)
        setHasDismissedOnboarding(false)
      }
      
      setIsLoading(false)
    }

    checkAuth()

    // Subscribe to auth state changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
      if (!session) {
        setIsOnboarded(false)
        setHasDismissedOnboarding(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [mounted])

  const handleOnboardingComplete = () => {
    localStorage.removeItem("onboardingDismissed")
    setHasDismissedOnboarding(false)
    setIsOnboarded(true)
    setDashboardSession((prev) => prev + 1)
  }

  const handleOnboardingCancel = () => {
    localStorage.setItem("onboardingDismissed", "true")
    setHasDismissedOnboarding(true)
  }

  const handleResumeOnboarding = () => {
    // Clear any cached onboarding state
    localStorage.removeItem("onboardingDismissed")
    setIsOnboarded(false)
    setHasDismissedOnboarding(false)
    setDashboardSession((prev) => prev + 1)
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-2">Mi Ruta de Éxito</h1>
            <p className="text-muted-foreground">Cargando tu camino hacia el futuro...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {!isAuthenticated ? (
        <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />
      ) : (
        <>
          <Dashboard
            key={dashboardSession}
            onLogout={() => {
              setIsAuthenticated(false)
              setIsOnboarded(false)
            }}
            showOnboardingReminder={isAuthenticated && !isOnboarded && hasDismissedOnboarding}
            onResumeOnboarding={handleResumeOnboarding}
          />
          {isAuthenticated && !isOnboarded && !hasDismissedOnboarding && (
            <OnboardingModal onComplete={handleOnboardingComplete} onCancel={handleOnboardingCancel} />
          )}
        </>
      )}
    </main>
  )
}
