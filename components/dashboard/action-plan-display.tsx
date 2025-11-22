import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Task {
  task: string
  priority: "high" | "medium" | "low"
  dailyHabit: boolean
}

interface Week {
  week: number
  title: string
  pathwayFocus: string
  tasks: Task[]
  milestone: string
}

interface Checkpoint {
  week: number
  checkpoint: string
  successMetrics: string[]
}

interface Resource {
  type: string
  title: string
  timing: string
}

interface ActionPlan {
  id?: string
  title: string
  overview: string
  weeks: Week[]
  checkpoints: Checkpoint[]
  resources: Resource[]
  pathways: string[]
  createdAt?: string
}

interface ActionPlanDisplayProps {
  plan: ActionPlan
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

export default function ActionPlanDisplay({ plan }: ActionPlanDisplayProps) {
  return (
    <div className="space-y-6 mb-8">
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10">
        <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
        <p className="text-muted-foreground">{plan.overview}</p>
      </Card>

      <Tabs defaultValue="weeks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weeks">Weekly Breakdown</TabsTrigger>
          <TabsTrigger value="checkpoints">Checkpoints</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Weekly Breakdown */}
        <TabsContent value="weeks" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {plan.weeks.map((week) => (
              <Card key={week.week} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">Week {week.week}</h3>
                    <p className="text-sm text-muted-foreground">{week.title}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">{week.pathwayFocus}</span>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-medium text-foreground mb-2">Tasks:</p>
                  <div className="space-y-2">
                    {week.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" disabled />
                        <div className="flex-1">
                          <p className="text-xs">{task.task}</p>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </span>
                            {task.dailyHabit && (
                              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">Daily</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-muted rounded">
                  <p className="text-xs font-medium mb-1">Milestone:</p>
                  <p className="text-xs text-muted-foreground">{week.milestone}</p>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Checkpoints */}
        <TabsContent value="checkpoints" className="space-y-4">
          {plan.checkpoints.map((checkpoint, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                  <span className="font-bold text-primary">✓</span>
                </div>
                <div>
                  <h3 className="font-medium">Week {checkpoint.week} Checkpoint</h3>
                  <p className="text-sm text-muted-foreground">{checkpoint.checkpoint}</p>
                </div>
              </div>

              <div className="pl-13">
                <p className="text-xs font-medium mb-2">Success Metrics:</p>
                <ul className="list-disc list-inside space-y-1">
                  {checkpoint.successMetrics.map((metric, midx) => (
                    <li key={midx} className="text-xs text-muted-foreground">
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="space-y-4">
          {plan.resources.map((resource, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Type: {resource.type.replace("_", " ")}</p>
                  <p className="text-sm text-muted-foreground">Timing: {resource.timing}</p>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
