export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumber, actionPlan } = body

    if (!phoneNumber || !actionPlan) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const reminders = JSON.parse(localStorage.getItem("whatsappReminders") || "[]")

    // Create a reminder for each week in the action plan
    const newReminders = actionPlan.weeks.map((week: any, index: number) => ({
      id: Math.random().toString(36).substr(2, 9),
      phoneNumber,
      weekNumber: week.week,
      tasks: week.tasks,
      createdAt: new Date().toISOString(),
      scheduledFor: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      sent: false,
      message: `Week ${week.week} - ${week.title}: ${week.milestone}`,
    }))

    reminders.push(...newReminders)
    localStorage.setItem("whatsappReminders", JSON.stringify(reminders))

    return Response.json({
      success: true,
      reminders: newReminders,
      count: newReminders.length,
    })
  } catch (error) {
    console.error("[v0] Error scheduling reminders:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to schedule reminders",
      },
      { status: 500 },
    )
  }
}
