"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PathwayCardProps {
  title: string
  description: string
  duration: string
  icon: string
  opportunities: number
}

export default function PathwayCards() {
  const pathways: PathwayCardProps[] = [
    {
      title: "Desarrollo Tecnológico",
      description: "Especialízate en programación, desarrollo web y tecnología moderna",
      duration: "6-12 meses",
      icon: "💻",
      opportunities: 12,
    },
    {
      title: "Emprendimiento",
      description: "Aprende a crear y lanzar tu propio negocio o startup",
      duration: "3-6 meses",
      icon: "🚀",
      opportunities: 8,
    },
    {
      title: "Gestión & Negocios",
      description: "Desarrolla habilidades de liderazgo y gestión empresarial",
      duration: "6-12 meses",
      icon: "📊",
      opportunities: 10,
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tus Caminos Recomendados</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {pathways.map((pathway, idx) => (
          <Card
            key={idx}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-primary"
          >
            <div className="text-4xl mb-3">{pathway.icon}</div>
            <h3 className="text-xl font-bold mb-2">{pathway.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{pathway.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-primary font-semibold">⏱️</span>
                <span>{pathway.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-primary font-semibold">📚</span>
                <span>{pathway.opportunities} oportunidades</span>
              </div>
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              Explorar Camino
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
