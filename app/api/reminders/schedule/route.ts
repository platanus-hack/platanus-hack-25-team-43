import { requireAuth } from "@/lib/auth-middleware"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Authenticate user
    const auth = await requireAuth(request)
    if (!auth.authorized || !auth.user) {
      return auth.response
    }

    const body = await request.json()
    const { reminderId, newDate } = body

    if (!reminderId || !newDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await getSupabaseServerClient()

    // Update reminder schedule
    const { data, error } = await supabase
      .from("reminders")
      .update({ scheduled_for: newDate })
      .eq("id", reminderId)
      .eq("user_id", auth.user.id) // Ensure user owns this reminder
      .select()
      .single()

    if (error) {
      console.error("[reminders] Error updating reminder:", error)
      return NextResponse.json(
        { success: false, error: "Failed to update reminder" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      reminder: data,
    })
  } catch (error) {
    console.error("[reminders] Error updating reminder:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update reminder",
      },
      { status: 500 }
    )
  }
}
