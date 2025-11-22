export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phoneNumber = searchParams.get("phoneNumber")

    if (!phoneNumber) {
      return Response.json({ success: false, error: "Phone number required" }, { status: 400 })
    }

    const reminders = JSON.parse(localStorage.getItem("whatsappReminders") || "[]")
    const userReminders = reminders.filter((r: any) => r.phoneNumber === phoneNumber)

    return Response.json({
      success: true,
      reminders: userReminders,
      count: userReminders.length,
      upcoming: userReminders.filter((r: any) => !r.sent).length,
    })
  } catch (error) {
    console.error("[v0] Error fetching reminders:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch reminders",
      },
      { status: 500 },
    )
  }
}
