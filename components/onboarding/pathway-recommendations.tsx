"use client"

import { useState } from "react"

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
}

const DEFAULT_PATHWAYS = [
  { name: "Software Engineering", icon: "💻" },
  { name: "Product Management", icon: "📊" },
  { name: "UX/UI Design", icon: "🎨" },
  { name: "Data Science", icon: "📈" },
  { name: "Startup Founder", icon: "🚀" },
  { name: "Business Strategy", icon: "🎯" },
]

export default function PathwayRecommendations({
  selectedPathways,
  onSelectPathway,
  recommendedPathways,
  isLoading = false,
}: PathwayRecommendationsProps) {
  const [expandedPathway, setExpandedPathway] = useState<string | null>(null)

  const displayPathways =
    recommendedPathways?.map((p) => ({
      name: p.name,
      icon: "⭐",
    })) || DEFAULT_PATHWAYS

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
                    <div className="text-2xl mb-2">{pathway.icon}</div>
                    <p className="font-medium text-sm">{pathway.name}</p>
                  </div>
                  {isRecommended && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Recommended</span>
                  )}
                </div>
              </button>

              {isRecommended && (
                <button
                  onClick={() => setExpandedPathway(isExpanded ? null : pathway.name)}
                  className="text-xs text-primary mt-1 underline"
                >
                  {isExpanded ? "Hide details" : "View details"}
                </button>
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
    </div>
  )
}
