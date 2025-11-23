"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Plus, Lightbulb, ClipboardList, Target } from "lucide-react"

interface PathwayDetailDialogProps {
  pathway: {
    title: string
    description: string
    icon: string
    duration: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  userResponses?: {
    openResponses?: Record<string, string>
    preferenceResponses?: Record<string, string>
    selectedPathways?: string[]
    schoolType?: string
    currentYear?: number
  }
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target: Target,
}

export default function PathwayDetailDialog({
  pathway,
  open,
  onOpenChange,
  userResponses,
}: PathwayDetailDialogProps) {
  const [userSuggestion, setUserSuggestion] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string>("")

  // Get the icon component
  const IconComponent = iconMap[pathway.icon] || Target

  const handleAnalyzeSuggestion = async () => {
    if (!userSuggestion.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-pathway-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathway: pathway.title,
          userSuggestion: userSuggestion,
          userResponses: userResponses,
        }),
      })

      if (!response.ok) throw new Error("Failed to analyze suggestion")

      const data = await response.json()
      setAnalysisResult(data.analysis)
    } catch (error) {
      console.error("Error analyzing suggestion:", error)
      setAnalysisResult("Lo siento, hubo un error analizando tu sugerencia. Por favor intenta de nuevo.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <IconComponent className="h-10 w-10 text-primary" />
            <div>
              <DialogTitle className="text-2xl">{pathway.title}</DialogTitle>
              <DialogDescription className="text-base mt-1">{pathway.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* User Suggestions Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Agrega tus propias ideas</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              ¿Tienes ideas específicas sobre lo que te gustaría explorar en este camino? Compártelas aquí y recibirás
              retroalimentación personalizada.
            </p>

            <div className="space-y-4">
              <Textarea
                placeholder="Por ejemplo: 'Me gustaría aprender desarrollo web pero no sé por dónde empezar' o 'Quiero participar en hackathons pero no tengo experiencia'..."
                value={userSuggestion}
                onChange={(e) => setUserSuggestion(e.target.value)}
                className="min-h-[120px]"
              />

              <Button onClick={handleAnalyzeSuggestion} disabled={!userSuggestion.trim() || isAnalyzing} className="w-full">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analizando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analizar mi idea
                  </>
                )}
              </Button>

              {analysisResult && (
                <Card className="p-5 bg-primary/5 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">Análisis personalizado</h4>
                      <p className="text-sm whitespace-pre-wrap">{analysisResult}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Action Plan Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-bold">Tu Plan de Acción</h3>
            </div>
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="space-y-4">
                {/* Why this is appropriate paragraph */}
                {userResponses && (
                  <div className="mb-4 p-4 bg-background/50 rounded-lg border border-primary/10">
                    <h4 className="font-semibold text-sm mb-2 text-primary">¿Por qué este plan es apropiado para ti?</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Este plan está diseñado específicamente para tu perfil, tomando en cuenta tu visión de futuro, 
                      tus preferencias de trabajo y aprendizaje, y tus objetivos educativos. 
                      Cada paso está pensado para ayudarte a desarrollar las habilidades que mencionaste 
                      mientras mantienes el estilo de trabajo que prefieres. Las actividades están adaptadas 
                      a tu nivel actual {userResponses.schoolType === "universidad" ? "universitario" : "escolar"} 
                      y te preparan para las oportunidades que buscas.
                    </p>
                  </div>
                )}
                
                {analysisResult ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Comienza con tus ideas personales</h4>
                        <p className="text-xs text-muted-foreground">
                          Has compartido ideas específicas - empieza por explorarlas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Dedica tiempo cada día</h4>
                        <p className="text-xs text-muted-foreground">
                          Establece un horario consistente para trabajar en tus objetivos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Conecta con la comunidad</h4>
                        <p className="text-xs text-muted-foreground">
                          Busca grupos, mentores o comunidades relacionadas con este camino
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">Evalúa tu progreso</h4>
                        <p className="text-xs text-muted-foreground">
                          Revisa semanalmente qué has logrado y ajusta tu plan
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-3">
                      Tu plan de acción se generará cuando agregues tus propias ideas y las analices arriba
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Pathway Info */}
          <Card className="p-5 bg-muted/50">
            <h4 className="font-semibold mb-3">Información del camino</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Duración estimada: {pathway.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Personalizado según tu perfil y respuestas</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

