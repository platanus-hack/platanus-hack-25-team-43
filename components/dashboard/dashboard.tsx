"use client"

import { useState, useEffect } from "react"
import { Settings as SettingsIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ActionPlanDisplay from "./action-plan-display"
import ActionPlanGenerator from "./action-plan-generator"
import PathwayCards from "./pathway-cards"
import OpportunitiesByPathway from "./opportunities-by-pathway"
import RemindersSection from "./reminders-section"
import {
  createEmptyOpenResponses,
  createEmptyPreferenceResponses,
  type OpenEndedResponses,
  type PreferenceResponses,
} from "@/lib/onboarding-questions"

type DashboardSettings = {
  whatsappReminders: boolean
  weeklySummaryEmails: boolean
  shareProgressWithMentor: boolean
}

const defaultDashboardSettings: DashboardSettings = {
  whatsappReminders: true,
  weeklySummaryEmails: false,
  shareProgressWithMentor: false,
}

type SavedGradeEntry = {
  subject: string
  grade: number
}

type SavedRecommendedPathway = {
  name: string
  rationale?: string
  actionSteps?: string[]
  timeline?: string
}

type SavedOnboardingData = {
  name?: string
  email?: string
  phoneNumber?: string
  schoolType?: "colegio" | "universidad"
  schoolName?: string
  currentYear?: number
  motivation?: string
  goals?: string
  grades?: SavedGradeEntry[]
  selectedPathways?: string[]
  customTracks?: string[]
  recommendedPathways?: SavedRecommendedPathway[]
  completedAt?: string
  permanent?: boolean
  openResponses?: OpenEndedResponses
  preferenceResponses?: PreferenceResponses
}

const withResponseDefaults = (payload?: SavedOnboardingData | null): SavedOnboardingData | null => {
  if (!payload) {
    return null
  }

  return {
    ...payload,
    openResponses: {
      ...createEmptyOpenResponses(),
      ...(payload.openResponses ?? {}),
    },
    preferenceResponses: {
      ...createEmptyPreferenceResponses(),
      ...(payload.preferenceResponses ?? {}),
    },
  }
}

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
  showOnboardingReminder?: boolean
  onResumeOnboarding?: () => void
}

export default function Dashboard({ showOnboardingReminder, onResumeOnboarding }: DashboardProps) {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null)
  const [showPlan, setShowPlan] = useState(false)
  const [userInfo, setUserInfo] = useState<{ name: string; schoolName: string; schoolType: string; completedAt?: string } | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>()
  const [selectedPathways, setSelectedPathways] = useState<string[]>([])
  const [onboardingData, setOnboardingData] = useState<SavedOnboardingData | null>(null)
  const [settingsPreferences, setSettingsPreferences] = useState<DashboardSettings>(defaultDashboardSettings)
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  useEffect(() => {
    // Load onboarding data from localStorage
    const savedOnboardingData = localStorage.getItem("onboardingData")
    if (savedOnboardingData) {
      try {
        const parsedData = JSON.parse(savedOnboardingData)
        const normalizedData = withResponseDefaults(parsedData)
        if (normalizedData) {
          setOnboardingData(normalizedData)
          setUserInfo({
            name: normalizedData.name ?? "",
            schoolName: normalizedData.schoolName ?? "",
            schoolType: normalizedData.schoolType === "universidad" ? "Universidad" : "Colegio",
            completedAt: normalizedData.completedAt,
          })
          if (normalizedData.selectedPathways?.length) {
            setSelectedPathways(normalizedData.selectedPathways)
          }
          if (normalizedData.phoneNumber) {
            setPhoneNumber(normalizedData.phoneNumber)
          }
        }
      } catch (error) {
        console.error("Error parsing saved onboarding data", error)
      }
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem("dashboardSettings")
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettingsPreferences((prev) => ({
          ...prev,
          ...parsedSettings,
        }))
      } catch (error) {
        console.error("Error parsing saved dashboard settings", error)
      }
    }

    setSettingsLoaded(true)
  }, [])

  useEffect(() => {
    if (!settingsLoaded) return
    localStorage.setItem("dashboardSettings", JSON.stringify(settingsPreferences))
  }, [settingsLoaded, settingsPreferences])

  const dialogPhoneNumber = onboardingData?.phoneNumber ?? phoneNumber ?? "—"
  const formattedSchoolType =
    onboardingData?.schoolType === "universidad"
      ? "Universidad"
      : onboardingData?.schoolType === "colegio"
        ? "Colegio"
        : userInfo?.schoolType ?? "Sin definir"
  const institutionLabel =
    formattedSchoolType === "Universidad"
      ? "Universidad"
      : formattedSchoolType === "Colegio"
        ? "Colegio"
        : "Institución"

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
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
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" variant="default">
                <SettingsIcon className="h-4 w-4" />
                Configuración
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Configuración rápida</DialogTitle>
                <DialogDescription>Ajusta cómo quieres recibir tus recordatorios y reportes.</DialogDescription>
              </DialogHeader>

              {!onboardingData ? (
                <Card className="p-6 border-dashed bg-muted/40">
                  <p className="text-sm text-muted-foreground">
                    Completa la primera pantalla del onboarding para sincronizar esta información.
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Datos del perfil</p>
                        <p className="text-xs text-muted-foreground">Sincronizados desde la primera pantalla del onboarding.</p>
                      </div>
                      {onboardingData.permanent && (
                        <Badge variant="secondary" className="text-[11px]">
                          Perfil permanente
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Nombre</span>
                        <span className="font-medium text-right">{onboardingData.name ?? "—"}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Correo</span>
                        <span className="font-medium text-right break-all">{onboardingData.email ?? "—"}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">WhatsApp</span>
                        <span className="font-medium text-right">{dialogPhoneNumber}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Tipo de institución</span>
                        <span className="font-medium text-right">{formattedSchoolType}</span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">{institutionLabel}</span>
                        <span className="font-medium text-right">
                          {onboardingData.schoolName ?? userInfo?.schoolName ?? "Sin registrar"}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-muted-foreground">Año actual</span>
                        <span className="font-medium text-right">
                          {onboardingData?.currentYear ? `Año ${onboardingData.currentYear}` : "No indicado"}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {onResumeOnboarding && (
                    <Button className="w-full" variant="outline" onClick={onResumeOnboarding}>
                      Retomar onboarding
                    </Button>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showOnboardingReminder && (
        <Card className="p-4 mb-8 border border-dashed border-primary/30 bg-primary/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-foreground">Te falta completar tu onboarding</p>
              <p className="text-sm text-muted-foreground">
                Completa tu perfil para desbloquear recomendaciones, planes de acción y recordatorios personalizados.
              </p>
            </div>
            {onResumeOnboarding && (
              <Button className="w-full md:w-auto" onClick={onResumeOnboarding}>
                Reanudar onboarding
              </Button>
            )}
          </div>
        </Card>
      )}

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
              openResponses: onboardingData.openResponses ?? createEmptyOpenResponses(),
              preferenceResponses: onboardingData.preferenceResponses ?? createEmptyPreferenceResponses(),
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
      {actionPlan &&
        (settingsPreferences.whatsappReminders ? (
          <div className="mb-8">
            <RemindersSection phoneNumber={phoneNumber} actionPlan={actionPlan} />
          </div>
        ) : (
          <Card className="mb-8 p-6">
            <h3 className="text-lg font-semibold mb-2">Recordatorios desactivados</h3>
            <p className="text-sm text-muted-foreground">
              Activa los recordatorios por WhatsApp desde el panel de Configuración para programar mensajes automáticos.
            </p>
          </Card>
        ))}

    </div>
  )
}
