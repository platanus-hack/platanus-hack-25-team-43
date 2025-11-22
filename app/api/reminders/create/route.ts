export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumber, weekNumber, tasks } = body

    if (!phoneNumber || !weekNumber || !tasks) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Store reminders in localStorage (in production, use a real database + WhatsApp API)
    const reminders = JSON.parse(localStorage.getItem("whatsappReminders") || "[]")

    const newReminder = {
      id: Math.random().toString(36).substr(2, 9),
      phoneNumber,
      weekNumber,
      tasks,
      createdAt: new Date().toISOString(),
      scheduledFor: new Date(Date.now() + weekNumber * 7 * 24 * 60 * 60 * 1000).toISOString(),
      sent: false,
      message: `Week ${weekNumber} Update: ${tasks
        .slice(0, 2)
        .map((t: any) => t.task)
        .join(", ")}...`,
    }

    reminders.push(newReminder)
    localStorage.setItem("whatsappReminders", JSON.stringify(reminders))

    return Response.json({
      success: true,
      reminder: newReminder,
    })
  } catch (error) {
    console.error("[v0] Error creating reminder:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create reminder",
      },
      { status: 500 },
    )
  }
}
