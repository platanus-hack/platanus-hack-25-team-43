import type { OpenEndedResponses, PreferenceResponses } from "@/lib/onboarding-questions"

export async function generateActionPlan(data: {
  name: string
  selectedPathways: string[]
  schoolInfo: {
    schoolType: string
    schoolName: string
    currentYear: number
  }
  openResponses: OpenEndedResponses
  preferenceResponses: PreferenceResponses
}) {
  try {
    const response = await fetch("/api/generate-action-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to generate action plan")
    }

    const result = await response.json()
    return result.plan
  } catch (error) {
    console.error("[v0] Error in generateActionPlan:", error)
    throw error
  }
}
