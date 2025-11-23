"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ExternalLink } from "lucide-react"

interface OpportunitiesByPathwayProps {
  selectedPathways: string[]
  userResponses?: {
    openResponses?: Record<string, string>
    preferenceResponses?: Record<string, string>
    schoolType?: string
    currentYear?: number
  }
}

interface Opportunity {
  id: string
  title: string
  description: string
  provider?: string
  company?: string
  duration?: string
  location?: string
  dates?: string
  level?: string
  type: "internship" | "course" | "study_plan" | "summer_camp"
}

export default function OpportunitiesByPathway({ selectedPathways, userResponses }: OpportunitiesByPathwayProps) {
  const [opportunities, setOpportunities] = useState<Record<string, Opportunity[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedPathways.length === 0) return

    const fetchOpportunities = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/get-opportunities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pathways: selectedPathways,
            userResponses,
          }),
        })

        const data = await response.json()
        if (data.success) {
          // Group opportunities by pathway
          const grouped: Record<string, Opportunity[]> = {}
          selectedPathways.forEach((pathway) => {
            grouped[pathway] = data.opportunities.filter((opp: Opportunity) =>
              data.opportunities.some((o: Opportunity) => o.id === opp.id)
            )
          })
          setOpportunities(grouped)
        } else {
          setError(data.error || "Error al cargar oportunidades")
        }
      } catch (err) {
        console.error("Error fetching opportunities:", err)
        setError("Error al cargar oportunidades")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpportunities()
  }, [selectedPathways, userResponses])

  if (selectedPathways.length === 0) {
    return null
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-background via-primary/5 to-background border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Oportunidades Personalizadas</h2>
          <p className="text-sm text-muted-foreground">
            Basadas en los caminos recomendados para tu perfil específico
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cargando oportunidades personalizadas...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <Tabs defaultValue={selectedPathways[0]} className="w-full">
          <TabsList className="grid w-full gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${selectedPathways.length}, 1fr)` }}>
            {selectedPathways.map((pathway) => (
              <TabsTrigger key={pathway} value={pathway} className="text-xs sm:text-sm">
                {pathway}
              </TabsTrigger>
            ))}
          </TabsList>

          {selectedPathways.map((pathway) => {
            const pathwayOps = opportunities[pathway] || []
            const internships = pathwayOps.filter((opp) => opp.type === "internship")
            const courses = pathwayOps.filter((opp) => opp.type === "course")
            const studyPlans = pathwayOps.filter((opp) => opp.type === "study_plan")
            const summerCamps = pathwayOps.filter((opp) => opp.type === "summer_camp")

            return (
              <TabsContent key={pathway} value={pathway} className="space-y-6 mt-0">
                {/* Internships */}
                {internships.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      Prácticas Profesionales
                      <Badge variant="secondary" className="text-xs">
                        {internships.length}
                      </Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {internships.map((item) => (
                        <Card
                          key={item.id}
                          className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.company} • {item.duration}
                            {item.location && ` • ${item.location}`}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Courses */}
                {courses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      Cursos Recomendados
                      <Badge variant="secondary" className="text-xs">
                        {courses.length}
                      </Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {courses.map((item) => (
                        <Card
                          key={item.id}
                          className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs text-muted-foreground">
                              {item.provider} • {item.duration}
                            </p>
                            {item.level && (
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                {item.level}
                              </Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Study Plans */}
                {studyPlans.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      Planes de Estudio
                      <Badge variant="secondary" className="text-xs">
                        {studyPlans.length}
                      </Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {studyPlans.map((item) => (
                        <Card
                          key={item.id}
                          className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-green-500"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.provider} • {item.duration}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summer Camps */}
                {summerCamps.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      Campamentos de Verano
                      <Badge variant="secondary" className="text-xs">
                        {summerCamps.length}
                      </Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {summerCamps.map((item) => (
                        <Card
                          key={item.id}
                          className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-500"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">{item.title}</h4>
                            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.provider} • {item.dates}
                            {item.location && ` • ${item.location}`}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state for pathway with no opportunities */}
                {pathwayOps.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No hay oportunidades disponibles para este camino aún.
                    </p>
                  </div>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      )}
    </Card>
  )
}
