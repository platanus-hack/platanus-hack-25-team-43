import { NextResponse } from "next/server"

export async function GET(_request: Request) {
  try {
    // Without auth, we can't fetch user-specific reminders
    // Return empty array for now
    return NextResponse.json({
      success: true,
      reminders: [],
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
