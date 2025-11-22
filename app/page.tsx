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

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const userToken = localStorage.getItem("userToken")
    const onboardingStatus = localStorage.getItem("onboardingComplete")

    setIsAuthenticated(!!userToken)
    setIsOnboarded(!!onboardingStatus && !!userToken)
    setIsLoading(false)
  }, [mounted])

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
            onLogout={() => {
              setIsAuthenticated(false)
              setIsOnboarded(false)
            }}
          />
          {!isOnboarded && <OnboardingModal onComplete={() => setIsOnboarded(true)} />}
        </>
      )}
    </main>
  )
}
