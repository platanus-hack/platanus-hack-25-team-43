"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ActionPlanDisplay from "./action-plan-display"
import ActionPlanGenerator from "./action-plan-generator"
import PathwayCards from "./pathway-cards"
import OpportunitiesByPathway from "./opportunities-by-pathway"
import RemindersSection from "./reminders-section"
import { logoutUser } from "@/lib/auth-client"

interface ActionPlan {
  id: string
  title: string
  overview: string
  weeks: Array<{
    week: number
    title: string
    pathwayFocus: string
    tasks: Array<{
      task: string
      priority: "high" | "medium" | "low"
      dailyHabit: boolean
    }>
    milestone: string
  }>
  checkpoints: Array<{
    week: number
    checkpoint: string
    successMetrics: string[]
  }>
  resources: Array<{
    type: string
    title: string
    timing: string
  }>
  pathways: string[]
  createdAt: string
}

interface DashboardProps {
  onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null)
  const [showPlan, setShowPlan] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; schoolName: string; schoolType: string; completedAt?: string } | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>()
  const [selectedPathways, setSelectedPathways] = useState<string[]>([])
  const [onboardingData, setOnboardingData] = useState<any>(null)

  useEffect(() => {
    // Load saved data from localStorage
    const savedPlan = localStorage.getItem("actionPlan")
    const savedOnboardingData = localStorage.getItem("onboardingData")
    const savedPhoneNumber = localStorage.getItem("whatsappPhoneNumber")

    if (savedOnboardingData) {
      const data = JSON.parse(savedOnboardingData)
      setOnboardingData(data)
      setUserInfo({
        name: data.name,
        schoolName: data.schoolName,
        schoolType: data.schoolType === "colegio" ? "Colegio" : "Universidad",
        completedAt: data.completedAt,
      })
      // Extract selected pathways
      if (data.selectedPathways) {
        setSelectedPathways(data.selectedPathways)
      }
    }

    if (savedPlan && savedPlan !== "{}") {
      const plan = JSON.parse(savedPlan)
      if (plan.weeks) {
        setActionPlan(plan)
      }
    }

    if (savedPhoneNumber) {
      setPhoneNumber(savedPhoneNumber)
    }
  }, [])

  const handleLogout = () => {
    logoutUser()
    onLogout()
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header with Logout */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">¡Bienvenido, {userInfo?.name}!</h1>
          <p className="text-muted-foreground">
            {userInfo?.schoolType} • {userInfo?.schoolName}
          </p>
          {userInfo?.completedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              ✓ Perfil completado el {new Date(userInfo.completedAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>

      {/* Selected Pathways Banner */}
      {selectedPathways.length > 0 && (
        <>
          <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-2 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Tus Caminos Elegidos</h2>
                  <p className="text-muted-foreground text-sm">Los objetivos que definiste para tu futuro</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-xs font-medium">
                <span>✓</span>
                <span>Analizado por IA</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              {selectedPathways.map((pathway, index) => (
                <div key={pathway} className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-primary/30 shadow-sm">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full font-bold text-xs">
                    {index + 1}
                  </span>
                  <span className="font-medium text-foreground">{pathway}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-primary/10">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span>🔒</span>
                <span>Tu perfil ha sido analizado por IA y guardado permanentemente. Todas las oportunidades y recursos están personalizados para estos caminos.</span>
              </p>
            </div>
          </Card>
        </>
      )}

      {/* Action Plan Generator */}
      {onboardingData && selectedPathways.length > 0 && !actionPlan && (
        <div className="mb-12">
          <ActionPlanGenerator 
            userData={{
              name: onboardingData.name,
              selectedPathways: selectedPathways,
              schoolType: onboardingData.schoolType,
              schoolName: onboardingData.schoolName,
              currentYear: onboardingData.currentYear,
              motivation: onboardingData.motivation,
              goals: onboardingData.goals,
            }}
            onPlanGenerated={(plan) => setActionPlan(plan)}
          />
        </div>
      )}

      {/* Pathway Recommendations Cards */}
      {actionPlan && (
        <div className="mb-12">
          <PathwayCards />
        </div>
      )}

      {/* Opportunities by Pathway */}
      {actionPlan && (
        <div className="mb-12">
          <OpportunitiesByPathway />
        </div>
      )}

      {/* Action Plan Section */}
      {actionPlan && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Tu Plan de Acción Detallado</h2>
            <Button variant={showPlan ? "default" : "outline"} onClick={() => setShowPlan(!showPlan)}>
              {showPlan ? "Ocultar Plan" : "Ver Plan Completo"}
            </Button>
          </div>
          {showPlan && <ActionPlanDisplay plan={actionPlan} />}
        </div>
      )}

      {/* Reminders Section */}
      {actionPlan && (
        <div className="mb-8">
          <RemindersSection phoneNumber={phoneNumber} actionPlan={actionPlan} />
        </div>
      )}

      {!actionPlan && (
        <Card className="p-8 text-center mb-8">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-foreground mb-2">Tu Perfil Está Completo</h3>
          <p className="text-muted-foreground mb-4">Tu información ha sido analizada y guardada exitosamente</p>
          <p className="text-sm text-muted-foreground">
            Explora las oportunidades y recursos personalizados para tus caminos elegidos
          </p>
        </Card>
      )}
    </div>
  )
}
