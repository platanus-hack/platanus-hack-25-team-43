import { requireAuth } from "@/lib/auth-middleware"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Authenticate user
    const auth = await requireAuth(request)
    if (!auth.authorized || !auth.user) {
      return auth.response
    }

    const supabase = await getSupabaseServerClient()

    // Fetch reminders for the authenticated user
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", auth.user.id)
      .order("scheduled_for", { ascending: true })

    if (error) {
      console.error("[reminders] Error fetching reminders:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch reminders" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      reminders: data || [],
    })
  } catch (error) {
    console.error("[reminders] Error fetching reminders:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch reminders",
      },
      { status: 500 }
    )
  }
}
