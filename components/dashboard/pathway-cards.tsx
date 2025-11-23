"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PathwayDetailDialog from "./pathway-detail-dialog"
import { Laptop, Rocket, BarChart3, Clock, BookOpen, ArrowRight } from "lucide-react"

interface PathwayCardProps {
  title: string
  description: string
  duration: string
  icon: string
  opportunities: number
}

interface PathwayCardsProps {
  userResponses?: {
    openResponses?: Record<string, string>
    preferenceResponses?: Record<string, string>
    selectedPathways?: string[]
    schoolType?: string
    currentYear?: number
  }
}

export default function PathwayCards({ userResponses }: PathwayCardsProps) {
  const [selectedPathway, setSelectedPathway] = useState<PathwayCardProps | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "Desarrollo Tecnológico": Laptop,
    "Emprendimiento": Rocket,
    "Gestión & Negocios": BarChart3,
  }

  const pathways: PathwayCardProps[] = [
    {
      title: "Desarrollo Tecnológico",
      description: "Especialízate en programación, desarrollo web y tecnología moderna",
      duration: "6-12 meses",
      icon: "Laptop",
      opportunities: 12,
    },
    {
      title: "Emprendimiento",
      description: "Aprende a crear y lanzar tu propio negocio o startup",
      duration: "3-6 meses",
      icon: "Rocket",
      opportunities: 8,
    },
    {
      title: "Gestión & Negocios",
      description: "Desarrolla habilidades de liderazgo y gestión empresarial",
      duration: "6-12 meses",
      icon: "BarChart3",
      opportunities: 10,
    },
  ]

  const handleExplorePathway = (pathway: PathwayCardProps) => {
    setSelectedPathway(pathway)
    setDialogOpen(true)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tus Caminos Recomendados</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {pathways.map((pathway, idx) => {
          const IconComponent = iconMap[pathway.title]
          return (
            <Card
              key={idx}
              className="p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary cursor-pointer"
              onClick={() => handleExplorePathway(pathway)}
            >
              <div className="mb-3">
                <IconComponent className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{pathway.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{pathway.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{pathway.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span>{pathway.opportunities} oportunidades</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <span>Click para explorar</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Card>
          )
        })}
      </div>

      {selectedPathway && (
        <PathwayDetailDialog
          pathway={selectedPathway}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userResponses={userResponses}
        />
      )}
    </div>
  )
}
