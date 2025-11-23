"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, ExternalLink, MapPin, Loader2 } from "lucide-react"

interface OpportunitiesByPathwayProps {
  selectedPathways: string[]
  userLocation?: string
  userResponses?: {
    openResponses?: Record<string, string>
    preferenceResponses?: Record<string, string>
    schoolType?: string
    currentYear?: number
  }
  onOpportunitiesSelected?: (opportunities: Opportunity[]) => void
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
  type: "internship" | "course" | "study_plan" | "summer_camp" | "local_opportunity"
  isLocal?: boolean
}

// Template general opportunities that apply to everyone
const getGeneralOpportunities = (pathway: string): Opportunity[] => {
  // Mapeo flexible - buscar coincidencias parciales
  const pathwayLower = pathway.toLowerCase()
  
  // Templates base que se pueden aplicar a múltiples pathways
  const baseTemplates = {
    tech: [
      {
        id: `template-${pathway}-1`,
        title: "Participa en Hackathons y Competencias",
        description: "Únete a eventos locales o virtuales relacionados con tu área de interés para mejorar tus habilidades y hacer networking.",
        provider: "Varios organizadores",
        duration: "Eventos puntuales",
        type: "course" as const,
        location: "Presencial y virtual"
      },
      {
        id: `template-${pathway}-2`,
        title: "Contribuye a Proyectos Open Source",
        description: "Encuentra proyectos en GitHub que te interesen y comienza a contribuir. Aprenderás prácticas profesionales y crearás un portafolio visible.",
        provider: "GitHub / GitLab",
        duration: "Continuo",
        type: "study_plan" as const,
        location: "Virtual"
      },
      {
        id: `template-${pathway}-3`,
        title: "Desarrolla Proyectos Personales",
        description: "Crea proyectos que resuelvan problemas reales en tu área de interés. Documenta tu proceso y compártelo en tu portafolio.",
        provider: "Autoaprendizaje",
        duration: "Flexible",
        type: "study_plan" as const,
        location: "Virtual"
      },
      {
        id: `template-${pathway}-4`,
        title: "Busca Prácticas o Pasantías",
        description: "Aplica a programas de prácticas en empresas relacionadas con tu campo. Muchas ofrecen programas para estudiantes.",
        provider: "Empresas locales",
        duration: "3-6 meses",
        type: "internship" as const,
        location: "Presencial/Híbrido"
      }
    ],
    business: [
      {
        id: `template-${pathway}-1`,
        title: "Únete a Incubadoras o Aceleradoras",
        description: "Busca programas de incubación en tu ciudad o país que ofrezcan mentoría, recursos y networking.",
        provider: "Incubadoras locales",
        duration: "3-12 meses",
        type: "course" as const,
        location: "Presencial"
      },
      {
        id: `template-${pathway}-2`,
        title: "Asiste a Eventos de Networking",
        description: "Participa en meetups, conferencias y eventos para conocer mentores, profesionales y otros estudiantes del área.",
        provider: "Cámaras de comercio, comunidades",
        duration: "Eventos puntuales",
        type: "course" as const,
        location: "Presencial y virtual"
      },
      {
        id: `template-${pathway}-3`,
        title: "Desarrolla un Proyecto Propio",
        description: "Identifica un problema en tu comunidad y desarrolla una solución. Crea un plan y valida tu idea.",
        provider: "Autoaprendizaje",
        duration: "Continuo",
        type: "study_plan" as const,
        location: "Flexible"
      },
      {
        id: `template-${pathway}-4`,
        title: "Busca Prácticas en el Área",
        description: "Aplica a posiciones en empresas o departamentos relacionados con tu camino profesional.",
        provider: "Empresas locales",
        duration: "3-6 meses",
        type: "internship" as const,
        location: "Presencial/Híbrido"
      }
    ],
    design: [
      {
        id: `template-${pathway}-1`,
        title: "Construye tu Portafolio",
        description: "Crea proyectos personales y profesionales que demuestren tus habilidades. Documenta tu proceso de diseño.",
        provider: "Autoaprendizaje",
        duration: "Continuo",
        type: "study_plan" as const,
        location: "Virtual"
      },
      {
        id: `template-${pathway}-2`,
        title: "Participa en Design Challenges",
        description: "Únete a competencias y desafíos de diseño en plataformas como Behance, Dribbble o comunidades locales.",
        provider: "Comunidades de diseño",
        duration: "Eventos puntuales",
        type: "course" as const,
        location: "Virtual/Presencial"
      },
      {
        id: `template-${pathway}-3`,
        title: "Busca Prácticas en Estudios o Empresas",
        description: "Aplica a posiciones en estudios de diseño, agencias o departamentos creativos de empresas.",
        provider: "Empresas locales",
        duration: "3-6 meses",
        type: "internship" as const,
        location: "Presencial/Híbrido"
      },
      {
        id: `template-${pathway}-4`,
        title: "Toma Cursos Especializados",
        description: "Aprende herramientas y técnicas específicas en plataformas como Domestika, Coursera o talleres locales.",
        provider: "Plataformas online",
        duration: "2-4 meses",
        type: "course" as const,
        location: "Virtual"
      }
    ],
    general: [
      {
        id: `template-${pathway}-1`,
        title: "Desarrolla Proyectos Prácticos",
        description: "Crea proyectos relacionados con tu área de interés que demuestren tus habilidades y conocimientos.",
        provider: "Autoaprendizaje",
        duration: "Flexible",
        type: "study_plan" as const,
        location: "Virtual"
      },
      {
        id: `template-${pathway}-2`,
        title: "Asiste a Eventos y Meetups",
        description: "Participa en eventos, conferencias y encuentros relacionados con tu campo para hacer networking y aprender.",
        provider: "Comunidades locales",
        duration: "Eventos puntuales",
        type: "course" as const,
        location: "Presencial/Virtual"
      },
      {
        id: `template-${pathway}-3`,
        title: "Busca Oportunidades de Práctica",
        description: "Aplica a programas de prácticas, voluntariados o proyectos que te permitan ganar experiencia real.",
        provider: "Empresas y organizaciones",
        duration: "3-6 meses",
        type: "internship" as const,
        location: "Presencial/Híbrido"
      },
      {
        id: `template-${pathway}-4`,
        title: "Toma Cursos y Certificaciones",
        description: "Busca cursos especializados en plataformas educativas que te ayuden a desarrollar habilidades específicas.",
        provider: "Plataformas educativas",
        duration: "2-6 meses",
        type: "course" as const,
        location: "Virtual"
      }
    ]
  }
  
  // Determinar qué template usar basado en el pathway
  if (pathwayLower.includes('software') || pathwayLower.includes('engineering') || 
      pathwayLower.includes('data') || pathwayLower.includes('tech') || 
      pathwayLower.includes('desarrollo')) {
    return baseTemplates.tech
  } else if (pathwayLower.includes('business') || pathwayLower.includes('management') || 
             pathwayLower.includes('product') || pathwayLower.includes('startup') || 
             pathwayLower.includes('emprendimiento') || pathwayLower.includes('gestión') ||
             pathwayLower.includes('strategy') || pathwayLower.includes('negocio')) {
    return baseTemplates.business
  } else if (pathwayLower.includes('design') || pathwayLower.includes('ux') || 
             pathwayLower.includes('ui') || pathwayLower.includes('diseño')) {
    return baseTemplates.design
  } else {
    // Template general para cualquier otro pathway
    return baseTemplates.general
  }
}

export default function OpportunitiesByPathway({ 
  selectedPathways, 
  userLocation, 
  userResponses,
  onOpportunitiesSelected 
}: OpportunitiesByPathwayProps) {
  const [opportunities, setOpportunities] = useState<Record<string, Opportunity[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingLocal, setIsLoadingLocal] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>([])

  useEffect(() => {
    if (selectedPathways.length === 0) return

    // Initialize with general opportunities for each pathway
    const initialOpportunities: Record<string, Opportunity[]> = {}
    selectedPathways.forEach((pathway) => {
      initialOpportunities[pathway] = getGeneralOpportunities(pathway)
    })
    setOpportunities(initialOpportunities)
    setIsLoading(false)
  }, [selectedPathways])

  // Notify parent component when opportunities are selected
  useEffect(() => {
    if (onOpportunitiesSelected) {
      const allOpportunities = Object.values(opportunities).flat()
      const selected = allOpportunities.filter(opp => selectedOpportunities.includes(opp.id))
      onOpportunitiesSelected(selected)
    }
  }, [selectedOpportunities, opportunities, onOpportunitiesSelected])

  const handleFindLocalOpportunities = async (pathway: string, specificTopic: string) => {
    if (!userLocation) {
      alert("Por favor, completa tu ubicación en el perfil para buscar oportunidades locales")
      return
    }

    setIsLoadingLocal((prev) => ({ ...prev, [pathway]: true }))
    try {
      const response = await fetch("/api/search-local-opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathway,
          location: userLocation,
          userResponses,
          specificTopic, // Add the specific topic to search for
        }),
      })

      const data = await response.json()
      if (data.success && data.opportunities) {
        // Add local opportunities to the existing ones
        setOpportunities((prev) => ({
          ...prev,
          [pathway]: [...(prev[pathway] || []), ...data.opportunities.map((opp: Opportunity) => ({
            ...opp,
            isLocal: true,
            type: "local_opportunity" as const
          }))],
        }))
      } else {
        alert(data.error || "Error al buscar oportunidades locales")
      }
    } catch (err) {
      console.error("Error searching local opportunities:", err)
      alert("Error al buscar oportunidades locales")
    } finally {
      setIsLoadingLocal((prev) => ({ ...prev, [pathway]: false }))
    }
  }

  const toggleOpportunitySelection = (opportunityId: string) => {
    setSelectedOpportunities((prev) => 
      prev.includes(opportunityId) 
        ? prev.filter((id) => id !== opportunityId)
        : [...prev, opportunityId]
    )
  }

  if (selectedPathways.length === 0) {
    return null
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-background via-primary/5 to-background border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">Ideas de Oportunidades para Ti</h2>
          <p className="text-sm text-muted-foreground">
            Estas son ideas generales que puedes aplicar en cualquier lugar.
          </p>
        </div>
      </div>

      {selectedOpportunities.length > 0 && (
        <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm font-medium mb-2">
            {selectedOpportunities.length} oportunidad{selectedOpportunities.length !== 1 ? 'es' : ''} seleccionada{selectedOpportunities.length !== 1 ? 's' : ''}
          </p>
          <p className="text-xs text-muted-foreground">
            Las oportunidades seleccionadas se usarán para generar tu plan de acción detallado
          </p>
        </div>
      )}

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
          <div className="overflow-x-auto pb-2 -mx-6 px-6 mb-6">
            <TabsList className="inline-flex w-auto min-w-min gap-2">
              {selectedPathways.map((pathway) => (
                <TabsTrigger 
                  key={pathway} 
                  value={pathway} 
                  className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                >
                  {pathway}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {selectedPathways.map((pathway) => {
            const pathwayOps = opportunities[pathway] || []

            const renderOpportunityCard = (item: Opportunity, isGeneral: boolean = false) => (
              <Card
                key={item.id}
                onClick={() => {
                  if (isGeneral && userLocation) {
                    // If it's a general idea and user has location, search for local opportunities
                    handleFindLocalOpportunities(pathway, item.title)
                  } else {
                    // Otherwise, just toggle selection
                    toggleOpportunitySelection(item.id)
                  }
                }}
                className={`p-4 hover:shadow-md transition-all cursor-pointer border-l-4 ${
                  item.isLocal ? 'border-l-purple-500' : 'border-l-primary'
                } ${
                  selectedOpportunities.includes(item.id) 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : ''
                } ${isGeneral && userLocation ? 'hover:border-primary/70' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm flex-1">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    {item.isLocal && (
                      <Badge variant="default" className="text-[10px] px-1 py-0">
                        <MapPin className="h-3 w-3 mr-1" />
                        Local
                      </Badge>
                    )}
                    {isGeneral && userLocation && !isLoadingLocal[pathway] && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        Click para buscar localmente
                      </Badge>
                    )}
                    {selectedOpportunities.includes(item.id) && (
                      <Badge variant="default" className="text-[10px] px-1 py-0">
                        ✓ Seleccionada
                      </Badge>
                    )}
                    {!isGeneral && <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                <p className="text-xs text-muted-foreground">
                  {item.company || item.provider}
                  {item.duration && ` • ${item.duration}`}
                  {item.location && ` • ${item.location}`}
                  {item.dates && ` • ${item.dates}`}
                </p>
              </Card>
            )

            // Separate general ideas from local opportunities
            const generalIdeas = pathwayOps.filter((opp) => !opp.isLocal)
            const localOpportunities = pathwayOps.filter((opp) => opp.isLocal)

            return (
              <TabsContent key={pathway} value={pathway} className="space-y-6 mt-0">
                {isLoadingLocal[pathway] && (
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <div>
                      <p className="text-sm font-medium">Buscando oportunidades locales...</p>
                      <p className="text-xs text-muted-foreground">Esto puede tomar unos segundos</p>
                    </div>
                  </div>
                )}

                {/* General Ideas */}
                {generalIdeas.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      💡 Ideas Generales
                      <Badge variant="secondary" className="text-xs">
                        {generalIdeas.length}
                      </Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {generalIdeas.map((item) => renderOpportunityCard(item, true))}
                    </div>
                  </div>
                )}

                {/* Local Opportunities - Not grouped by type, just as they come */}
                {localOpportunities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Oportunidades Específicas en tu Zona
                      <Badge variant="secondary" className="text-xs">
                        {localOpportunities.length}
                      </Badge>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {localOpportunities.map((item) => renderOpportunityCard(item, false))}
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
