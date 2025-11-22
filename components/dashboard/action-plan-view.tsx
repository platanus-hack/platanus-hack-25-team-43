import { Card } from "@/components/ui/card"

interface Opportunity {
  id: string
  type: "internship" | "course" | "study_plan" | "summer_camp"
  title: string
  description: string
  pathway: string
}

interface ActionPlan {
  id: string
  pathways: string[]
  opportunities: Opportunity[]
  createdAt: string
}

interface ActionPlanViewProps {
  plan: ActionPlan
}

export default function ActionPlanView({ plan }: ActionPlanViewProps) {
  return (
    <div className="space-y-4 mb-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Action Plan</h2>

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Recommended Pathways</h3>
          <div className="flex flex-wrap gap-2">
            {plan.pathways.map((pathway) => (
              <span key={pathway} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {pathway}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Suggested Opportunities</h3>
          <div className="space-y-3">
            {plan.opportunities.length === 0 ? (
              <p className="text-muted-foreground">Opportunities will be loaded after analysis</p>
            ) : (
              plan.opportunities.map((opp) => (
                <Card key={opp.id} className="p-4 bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{opp.title}</h4>
                    <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                      {opp.type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{opp.description}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
