import { NextResponse } from "next/server"

interface Task {
  task: string
  description?: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phoneNumber, weekNumber, tasks } = body

    if (!phoneNumber || !weekNumber || !tasks) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Calculate scheduled date
    const scheduledFor = new Date(Date.now() + weekNumber * 7 * 24 * 60 * 60 * 1000)

    // Create reminder message
    const message = `Week ${weekNumber} Update: ${(tasks as Task[])
      .slice(0, 2)
      .map((t) => t.task)
      .join(", ")}...`

    // For now, store reminders in localStorage on the client
    // In production, you would integrate with a WhatsApp API or notification service
    return NextResponse.json({
      success: true,
      reminder: {
        id: `reminder-${Date.now()}`,
        phoneNumber,
        weekNumber,
        tasks,
        createdAt: new Date().toISOString(),
        scheduledFor: scheduledFor.toISOString(),
        sent: false,
        message,
      },
    })
  } catch (error) {
    console.error("[reminders] Error creating reminder:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create reminder",
      },
      { status: 500 }
    )
  }
}
