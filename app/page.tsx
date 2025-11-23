/**
 * @file app/page.tsx
 * @description Main application entry point and routing logic
 * 
 * This component manages the application's primary flow:
 * 1. Onboarding modal (if not completed)
 * 2. Dashboard (after onboarding)
 * 
 * Uses localStorage to persist onboarding status.
 * 
 * @see components/onboarding/onboarding-modal.tsx - Onboarding flow
 * @see components/dashboard/dashboard.tsx - Main dashboard
 */

"use client"

import { useState, useEffect } from "react"
import OnboardingModal from "@/components/onboarding/onboarding-modal"
import Dashboard from "@/components/dashboard/dashboard"

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [hasDismissedOnboarding, setHasDismissedOnboarding] = useState(false)
  const [dashboardSession, setDashboardSession] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check onboarding status from localStorage
    const onboardingComplete = localStorage.getItem("onboardingComplete") === "true"
    const onboardingDismissed = localStorage.getItem("onboardingDismissed") === "true"

    setIsOnboarded(onboardingComplete)
    setHasDismissedOnboarding(onboardingDismissed)
    setIsLoading(false)
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
      <Dashboard
        key={dashboardSession}
        showOnboardingReminder={!isOnboarded && hasDismissedOnboarding}
        onResumeOnboarding={handleResumeOnboarding}
      />
      {!isOnboarded && !hasDismissedOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} onCancel={handleOnboardingCancel} />
      )}
    </main>
  )
}
