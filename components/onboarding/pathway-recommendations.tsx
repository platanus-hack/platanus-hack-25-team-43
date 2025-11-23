"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import PathwayDetailDialog from "@/components/dashboard/pathway-detail-dialog"
import { Laptop, BarChart3, Palette, TrendingUp, Rocket, Target, Search, Star } from "lucide-react"

interface PathwayData {
  name: string
  rationale: string
  actionSteps: string[]
  timeline: string
}

interface PathwayRecommendationsProps {
  selectedPathways: string[]
  onSelectPathway: (pathway: string) => void
  recommendedPathways?: PathwayData[]
  isLoading?: boolean
  userResponses?: {
    openResponses?: Record<string, string>
    preferenceResponses?: Record<string, string>
    schoolType?: string
    currentYear?: number
  }
}

const DEFAULT_PATHWAYS = [
  { name: "Software Engineering", icon: "Laptop" },
  { name: "Product Management", icon: "BarChart3" },
  { name: "UX/UI Design", icon: "Palette" },
  { name: "Data Science", icon: "TrendingUp" },
  { name: "Startup Founder", icon: "Rocket" },
  { name: "Business Strategy", icon: "Target" },
]

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop: Laptop,
  BarChart3: BarChart3,
  Palette: Palette,
  TrendingUp: TrendingUp,
  Rocket: Rocket,
  Target: Target,
  Star: Star,
}

export default function PathwayRecommendations({
  selectedPathways,
  onSelectPathway,
  recommendedPathways,
  isLoading = false,
  userResponses,
}: PathwayRecommendationsProps) {
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedForDialog, setSelectedForDialog] = useState<{ name: string; icon: string } | null>(null)

  const displayPathways =
    recommendedPathways?.map((p) => ({
      name: p.name,
      icon: "Star",
    })) || DEFAULT_PATHWAYS

  const handleExplorePathway = (pathway: { name: string; icon: string }) => {
    setSelectedForDialog(pathway)
    setDialogOpen(true)
  }

  return (
    <div>
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Analyzing your profile...</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {displayPathways.map((pathway) => {
          const pathwayData = recommendedPathways?.find((p) => p.name === pathway.name)
          const isRecommended = !!pathwayData
          const isSelected = selectedPathways.includes(pathway.name)
          const isExpanded = expandedPathway === pathway.name
          const IconComponent = iconMap[pathway.icon] || Star

          return (
            <div key={pathway.name} className="relative">
              <button
                onClick={() => onSelectPathway(pathway.name)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected ? "border-primary bg-primary/10" : "border-input hover:border-primary/50"
                } ${isRecommended ? "ring-2 ring-yellow-400/50" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <IconComponent className="h-8 w-8 text-primary mb-2" />
                    <p className="font-medium text-sm">{pathway.name}</p>
                  </div>
                  {isRecommended && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Recommended</span>
                  )}
                </div>
              </button>

              {isRecommended && (
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedPathway(isExpanded ? null : pathway.name)}
                      className="text-xs h-7 flex-1"
                    >
                      {isExpanded ? "Hide details" : "View details"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExplorePathway(pathway)}
                      className="text-xs h-7 flex-1 gap-1"
                    >
                      <Search className="h-3 w-3" />
                      <span>Explore with AI</span>
                    </Button>
                  </div>
                </div>
              )}

              {isExpanded && pathwayData && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-card border border-input rounded-lg z-20 shadow-lg">
                  <p className="text-foreground font-medium mb-2 text-xs">Why this fits you:</p>
                  <p className="text-muted-foreground text-xs mb-3">{pathwayData.rationale}</p>

                  <p className="text-foreground font-medium mb-2 text-xs">Action Steps:</p>
                  <ol className="text-muted-foreground text-xs space-y-1 mb-3 list-decimal list-inside">
                    {pathwayData.actionSteps.slice(0, 3).map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>

                  <p className="text-foreground font-medium text-xs">Timeline: {pathwayData.timeline}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {selectedForDialog && (
        <PathwayDetailDialog
          pathway={{
            title: selectedForDialog.name,
            description: recommendedPathways?.find((p) => p.name === selectedForDialog.name)?.rationale || "Explore this pathway",
            icon: selectedForDialog.icon,
            duration: recommendedPathways?.find((p) => p.name === selectedForDialog.name)?.timeline || "Variable",
          }}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userResponses={userResponses ? {
            ...userResponses,
            selectedPathways: selectedPathways,
          } : undefined}
        />
      )}
    </div>
  )
}
