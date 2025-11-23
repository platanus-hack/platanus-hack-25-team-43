import { requireAuth } from "@/lib/auth-middleware"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

interface Task {
  task: string
  description?: string
}

export async function POST(request: Request) {
  try {
    // Authenticate user
    const auth = await requireAuth(request)
    if (!auth.authorized || !auth.user) {
      return auth.response
    }

    const body = await request.json()
    const { phoneNumber, weekNumber, tasks } = body

    if (!phoneNumber || !weekNumber || !tasks) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await getSupabaseServerClient()

    // Calculate scheduled date
    const scheduledFor = new Date(Date.now() + weekNumber * 7 * 24 * 60 * 60 * 1000)

    // Create reminder message
    const message = `Week ${weekNumber} Update: ${(tasks as Task[])
      .slice(0, 2)
      .map((t) => t.task)
      .join(", ")}...`

    // Store reminder in Supabase
    const { data, error } = await supabase
      .from("reminders")
      .insert({
        user_id: auth.user.id,
        reminder_text: message,
        scheduled_for: scheduledFor.toISOString(),
        sent: false,
      })
      .select()
      .single()

    if (error) {
      console.error("[reminders] Error creating reminder:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create reminder" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      reminder: {
        id: data.id,
        phoneNumber,
        weekNumber,
        tasks,
        createdAt: data.created_at,
        scheduledFor: data.scheduled_for,
        sent: data.sent,
        message: data.reminder_text,
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
