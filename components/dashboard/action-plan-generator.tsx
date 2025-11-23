/**
 * @file components/dashboard/action-plan-generator.tsx
 * @description Interactive UI for generating AI-powered personalized action plans
 * 
 * This component provides a beautiful, step-by-step interface for generating
 * comprehensive 12-week action plans using Claude AI.
 * 
 * @features
 * - Introduction screen explaining plan benefits
 * - One-click AI plan generation
 * - Loading state with progress indicator
 * - 4-tab plan display (weeks, opportunities, resources, reminders)
 * - Automatic localStorage persistence
 * 
 * @props {Object} userData - Student profile information
 * @props {string} userData.name - Student name
 * @props {Array<string>} userData.selectedPathways - Chosen career paths
 * @props {string} userData.schoolType - "colegio" or "universidad"
 * @props {string} userData.schoolName - Institution name
 * @props {number} userData.currentYear - Current academic year
 * @props {Object} userData.openResponses - Open-ended onboarding answers
 * @props {Object} userData.preferenceResponses - Multiple-choice preferences
 * @props {Function} onPlanGenerated - Callback when plan is created
 * 
 * @state {boolean} isGenerating - Whether plan is being generated
 * @state {Object} generatedPlan - Complete action plan from AI
 * @state {string} error - Error message if generation fails
 * @state {boolean} showGenerator - Whether to show generator UI
 * 
 * @ai_integration
 * - Calls /api/generate-action-plan
 * - Uses Claude 3 Haiku
 * - Takes 8-15 seconds to generate
 * - Automatically saves to localStorage
 * 
 * @tabs
 * 1. **Weekly Plan** - 12 weeks of tasks with checkboxes
 * 2. **Opportunities** - Internships, scholarships, courses
 * 3. **Resources** - Books, platforms, communities
 * 4. **Reminders** - Deadlines and checkpoints
 * 
 * @see lib/action-plan-client.ts - API client
 * @see app/api/generate-action-plan/route.ts - Backend API
 * @see components/dashboard/dashboard.tsx - Parent component
 * 
 * @example
 * <ActionPlanGenerator
 *   userData={{
 *     name: "María",
 *     selectedPathways: ["Software Engineering"],
 *     schoolType: "universidad",
 *     schoolName: "UdeA",
 *     currentYear: 2,
 *     openResponses: {
 *       futureVision: "Liderar productos tech con impacto social",
 *       dailyFeeling: "Curiosidad y propósito cada día",
 *       problemEnjoyment: "Retos donde combino datos y personas",
 *       skillFocus: "Storytelling y análisis avanzado",
 *       oneWeekJob: "Product Manager en una startup healthtech"
 *     },
 *     preferenceResponses: {
 *       consideredCollege: "Sí",
 *       wantsCollege: "Sí",
 *       environmentComfort: "Interiores",
 *       workStyle: "Una mezcla de ambos",
 *       dayPreference: "Algo intermedio",
 *       workPace: "Un ritmo rápido y energético",
 *       taskComfort: "Tareas donde puedes sumar tus ideas",
 *       activityPreference: "Una combinación de ambas",
 *       technologyComfort: "Me siento cómodo/a y hasta lo disfruto",
 *       communicationStyle: "Hablar con grupos pequeños"
 *     }
 *   }}
 *   onPlanGenerated={(plan) => console.log(plan)}
 * />
 */

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateActionPlan } from "@/lib/action-plan-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { OpenEndedResponses, PreferenceResponses } from "@/lib/onboarding-questions"

interface ActionPlanGeneratorProps {
  userData: {
    name: string
    selectedPathways: string[]
    schoolType: string
    schoolName: string
    currentYear: number
    openResponses: OpenEndedResponses
    preferenceResponses: PreferenceResponses
  }
  onPlanGenerated: (plan: any) => void
}

export default function ActionPlanGenerator({ userData, onPlanGenerated }: ActionPlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showGenerator, setShowGenerator] = useState(false)

  const handleGeneratePlan = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const plan = await generateActionPlan({
        name: userData.name,
        selectedPathways: userData.selectedPathways,
        schoolInfo: {
          schoolType: userData.schoolType,
          schoolName: userData.schoolName,
          currentYear: userData.currentYear,
        },
        openResponses: userData.openResponses,
        preferenceResponses: userData.preferenceResponses,
      })

      setGeneratedPlan(plan)
      
      // Save to localStorage
      localStorage.setItem("actionPlan", JSON.stringify(plan))
      
      onPlanGenerated(plan)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar el plan")
      console.error("[ActionPlanGenerator] Error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!showGenerator) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
        <div className="text-6xl mb-4">🚀</div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Genera Tu Plan de Acción Personalizado
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Usa inteligencia artificial para crear un plan detallado de 12 semanas con:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-3xl mx-auto">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="text-3xl mb-2">📅</div>
            <p className="text-sm font-medium">Plan Semanal</p>
            <p className="text-xs text-muted-foreground">12 semanas</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="text-3xl mb-2">💼</div>
            <p className="text-sm font-medium">Oportunidades</p>
            <p className="text-xs text-muted-foreground">Internships & más</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-sm font-medium">Recursos</p>
            <p className="text-xs text-muted-foreground">Cursos & herramientas</p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
            <div className="text-3xl mb-2">⏰</div>
            <p className="text-sm font-medium">Recordatorios</p>
            <p className="text-xs text-muted-foreground">Fechas clave</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowGenerator(true)}
          size="lg"
          className="text-lg px-8"
        >
          Comenzar Generación
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h2 className="text-xl font-bold text-foreground">Generador de Plan de Acción con IA</h2>
              <p className="text-sm text-muted-foreground">
                Basado en tus caminos: {userData.selectedPathways.join(", ")}
              </p>
            </div>
          </div>
          {!isGenerating && !generatedPlan && (
            <Button onClick={() => setShowGenerator(false)} variant="outline">
              Cancelar
            </Button>
          )}
        </div>

        {!generatedPlan && (
          <div className="mt-6">
            <Button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⚙️</span>
                  Generando tu plan personalizado con IA...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Generar Plan de Acción
                </>
              )}
            </Button>
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {generatedPlan && (
        <ActionPlanDisplay plan={generatedPlan} />
      )}
    </div>
  )
}

function ActionPlanDisplay({ plan }: { plan: any }) {
  const [selectedWeek, setSelectedWeek] = useState(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">✅</span>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{plan.title}</h2>
            <p className="text-muted-foreground">{plan.overview}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>📅 {plan.weeks?.length || 0} semanas</span>
          <span>💼 {plan.opportunities?.length || 0} oportunidades</span>
          <span>📚 {plan.resources?.length || 0} recursos</span>
          <span>⏰ {plan.reminders?.length || 0} recordatorios</span>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="weeks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weeks">📅 Plan Semanal</TabsTrigger>
          <TabsTrigger value="opportunities">💼 Oportunidades</TabsTrigger>
          <TabsTrigger value="resources">📚 Recursos</TabsTrigger>
          <TabsTrigger value="reminders">⏰ Recordatorios</TabsTrigger>
        </TabsList>

        <TabsContent value="weeks" className="space-y-4">
          {/* Week Selector */}
          <div className="flex flex-wrap gap-2">
            {plan.weeks?.map((week: any) => (
              <Button
                key={week.week}
                variant={selectedWeek === week.week ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedWeek(week.week)}
              >
                Semana {week.week}
              </Button>
            ))}
          </div>

          {/* Selected Week Details */}
          {plan.weeks?.filter((w: any) => w.week === selectedWeek).map((week: any) => (
            <Card key={week.week} className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-foreground">Semana {week.week}: {week.title}</h3>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {week.pathwayFocus}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  🎯 <strong>Objetivo:</strong> {week.milestone}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Tareas:</h4>
                {week.tasks?.map((task: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="text-foreground">{task.task}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" :
                          task.priority === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        }`}>
                          {task.priority}
                        </span>
                        {task.dailyHabit && (
                          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            Hábito diario
                          </span>
                        )}
                        {task.estimatedTime && (
                          <span className="text-xs text-muted-foreground">⏱️ {task.estimatedTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Checkpoints */}
          {plan.checkpoints?.length > 0 && (
            <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <h4 className="font-bold text-foreground mb-4">🎯 Checkpoints de Progreso</h4>
              <div className="space-y-3">
                {plan.checkpoints.map((checkpoint: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <h5 className="font-semibold text-foreground mb-2">
                      Semana {checkpoint.week}: {checkpoint.title}
                    </h5>
                    <p className="text-sm text-muted-foreground mb-2">{checkpoint.checkpoint}</p>
                    <div className="text-sm">
                      <strong>Métricas de éxito:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {checkpoint.successMetrics?.map((metric: string, i: number) => (
                          <li key={i} className="text-muted-foreground">{metric}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {plan.opportunities?.map((opp: any, idx: number) => (
            <Card key={idx} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {opp.type === "internship" && "💼"}
                      {opp.type === "course" && "📚"}
                      {opp.type === "scholarship" && "🎓"}
                      {opp.type === "summer_camp" && "⛺"}
                      {opp.type === "competition" && "🏆"}
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{opp.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{opp.provider}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  opp.cost === "free" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                  opp.cost === "scholarship_available" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                  "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                }`}>
                  {opp.cost === "free" ? "Gratis" : opp.cost === "scholarship_available" ? "Con Beca" : "Pago"}
                </span>
              </div>

              <p className="text-foreground mb-3">{opp.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">🎯 Camino:</span>
                  <span className="ml-2 font-medium">{opp.pathway}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">📅 Periodo:</span>
                  <span className="ml-2 font-medium">{opp.applicationPeriod}</span>
                </div>
                {opp.deadline && (
                  <div>
                    <span className="text-muted-foreground">⏰ Deadline:</span>
                    <span className="ml-2 font-medium text-red-600 dark:text-red-400">{opp.deadline}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">✅ Aplicar en:</span>
                  <span className="ml-2 font-medium">Semana {opp.recommendedWeek}</span>
                </div>
              </div>

              {opp.url && (
                <div className="mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href={opp.url} target="_blank" rel="noopener noreferrer">
                      Ver más información →
                    </a>
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4">
            {plan.resources?.map((resource: any, idx: number) => (
              <Card key={idx} className="p-5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">
                    {resource.type === "book" && "📖"}
                    {resource.type === "platform" && "💻"}
                    {resource.type === "community" && "👥"}
                    {resource.type === "tool" && "🛠️"}
                    {resource.type === "course" && "🎓"}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-foreground">{resource.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        resource.cost === "free" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                        resource.cost === "freemium" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                      }`}>
                        {resource.cost === "free" ? "Gratis" : resource.cost === "freemium" ? "Freemium" : "Pago"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>🎯 {resource.pathway}</span>
                      <span>⏰ {resource.timing}</span>
                    </div>
                    {resource.url && (
                      <Button variant="link" size="sm" className="px-0 h-auto mt-2" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          Acceder al recurso →
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          {plan.reminders?.map((reminder: any, idx: number) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                  reminder.priority === "high" ? "bg-red-100 dark:bg-red-900" :
                  reminder.priority === "medium" ? "bg-yellow-100 dark:bg-yellow-900" :
                  "bg-green-100 dark:bg-green-900"
                }`}>
                  {reminder.type === "checkpoint" && "🎯"}
                  {reminder.type === "deadline" && "⏰"}
                  {reminder.type === "application" && "📝"}
                  {reminder.type === "review" && "📊"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-foreground">{reminder.title}</h4>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      Semana {reminder.week}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{reminder.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

