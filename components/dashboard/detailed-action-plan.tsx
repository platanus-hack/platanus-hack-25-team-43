"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Target, TrendingUp, Loader2, ChevronDown, ChevronUp } from "lucide-react"

interface DetailedActionPlanProps {
  selectedOpportunities: Array<{
    id: string
    title: string
    description: string
    type: string
    provider?: string
    company?: string
  }>
  selectedPathways: string[]
  userResponses?: {
    openResponses?: Record<string, string>
    preferenceResponses?: Record<string, string>
    schoolType?: string
    currentYear?: number
  }
}

interface ActionStep {
  step: number
  title: string
  description: string
  timeline: string
  priority: "high" | "medium" | "low"
  relatedOpportunity?: string
  tasks: string[]
}

interface DetailedPlan {
  overview: string
  totalDuration: string
  steps: ActionStep[]
  milestones: Array<{
    week: number
    description: string
  }>
  tips: string[]
}

export default function DetailedActionPlan({ 
  selectedOpportunities, 
  selectedPathways,
  userResponses 
}: DetailedActionPlanProps) {
  const [plan, setPlan] = useState<DetailedPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

  const generateDetailedPlan = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-detailed-action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunities: selectedOpportunities,
          pathways: selectedPathways,
          userResponses,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPlan(data.plan)
      } else {
        setError(data.error || "Error al generar el plan detallado")
      }
    } catch (err) {
      console.error("Error generating detailed plan:", err)
      setError("Error al generar el plan detallado")
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber)
      } else {
        newSet.add(stepNumber)
      }
      return newSet
    })
  }

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      case "low":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
    }
  }

  const getPriorityLabel = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "Alta prioridad"
      case "medium":
        return "Prioridad media"
      case "low":
        return "Prioridad baja"
    }
  }

  if (selectedOpportunities.length === 0) {
    return null
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-background via-blue-50 dark:via-blue-950/20 to-background border-2 border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-3 mb-6">
        <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">Plan de Acción Detallado</h2>
          <p className="text-sm text-muted-foreground">
            Basado en las {selectedOpportunities.length} oportunidad{selectedOpportunities.length !== 1 ? 'es' : ''} que seleccionaste
          </p>
        </div>
      </div>

      {!plan && !isGenerating && (
        <div className="text-center py-8">
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-2">Oportunidades seleccionadas:</h3>
            <div className="space-y-2">
              {selectedOpportunities.map((opp) => (
                <div key={opp.id} className="text-sm text-left p-2 bg-background rounded">
                  <p className="font-medium">{opp.title}</p>
                  <p className="text-xs text-muted-foreground">{opp.provider || opp.company}</p>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={generateDetailedPlan} size="lg" className="gap-2">
            <TrendingUp className="h-5 w-5" />
            Generar Plan de Acción Detallado
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            La IA creará un plan paso a paso para aprovechar estas oportunidades
          </p>
        </div>
      )}

      {isGenerating && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Generando tu plan detallado...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Esto puede tomar unos segundos
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={generateDetailedPlan} variant="outline">
            Intentar de nuevo
          </Button>
        </div>
      )}

      {plan && !isGenerating && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Visión General
            </h3>
            <p className="text-sm text-muted-foreground mb-3">{plan.overview}</p>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{plan.totalDuration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{plan.steps.length} pasos</span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Pasos a Seguir</h3>
            <div className="space-y-3">
              {plan.steps.map((step) => {
                const isExpanded = expandedSteps.has(step.step)
                return (
                  <Card key={step.step} className="overflow-hidden">
                    <button
                      onClick={() => toggleStep(step.step)}
                      className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold text-sm flex-shrink-0">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{step.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {step.timeline}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(step.priority)}`}>
                                {getPriorityLabel(step.priority)}
                              </Badge>
                              {step.relatedOpportunity && (
                                <Badge variant="outline" className="text-xs">
                                  {step.relatedOpportunity}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    
                    {isExpanded && step.tasks.length > 0 && (
                      <div className="px-4 pb-4 border-t pt-4">
                        <p className="text-sm font-medium mb-2">Tareas específicas:</p>
                        <ul className="space-y-2">
                          {step.tasks.map((task, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Milestones */}
          {plan.milestones && plan.milestones.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4 text-lg">Hitos Importantes</h3>
              <div className="space-y-2">
                {plan.milestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-center w-16 h-8 bg-primary/10 text-primary rounded font-bold text-sm flex-shrink-0">
                      Sem {milestone.week}
                    </div>
                    <p className="text-sm flex-1">{milestone.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {plan.tips && plan.tips.length > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                💡 Consejos para el Éxito
              </h3>
              <ul className="space-y-2">
                {plan.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <span className="text-yellow-600 dark:text-yellow-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button 
            onClick={generateDetailedPlan} 
            variant="outline" 
            className="w-full"
          >
            Regenerar Plan
          </Button>
        </div>
      )}
    </Card>
  )
}

