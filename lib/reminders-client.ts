export async function scheduleReminders(phoneNumber: string, actionPlan: any) {
  try {
    const response = await fetch("/api/reminders/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, actionPlan }),
    })

    if (!response.ok) {
      throw new Error("Failed to schedule reminders")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("[v0] Error scheduling reminders:", error)
    throw error
  }
}

export async function getReminders(phoneNumber: string) {
  try {
    const response = await fetch(`/api/reminders/list?phoneNumber=${encodeURIComponent(phoneNumber)}`)

    if (!response.ok) {
      throw new Error("Failed to fetch reminders")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("[v0] Error fetching reminders:", error)
    throw error
  }
}

export async function createReminder(phoneNumber: string, weekNumber: number, tasks: any[]) {
  try {
    const response = await fetch("/api/reminders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, weekNumber, tasks }),
    })

    if (!response.ok) {
      throw new Error("Failed to create reminder")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("[v0] Error creating reminder:", error)
    throw error
  }
}
