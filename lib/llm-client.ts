import type { OpenEndedResponses, PreferenceResponses } from "@/lib/onboarding-questions"

export async function analyzeStudentResponses(data: {
  name: string
  schoolType: string
  schoolName: string
  currentYear: number
  openResponses: OpenEndedResponses
  preferenceResponses: PreferenceResponses
  grades: Array<{ subject: string; grade: number }>
}) {
  try {
    const response = await fetch("/api/analyze-responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("[llm-client] API error:", response.status, errorData)
      throw new Error(errorData.error || `Failed to analyze responses (${response.status})`)
    }

    const result = await response.json()
    return result.pathways
  } catch (error) {
    console.error("[llm-client] Error in analyzeStudentResponses:", error)
    throw error
  }
}

export async function getOpportunitiesForPathways(pathways: string[]) {
  try {
    const response = await fetch("/api/get-opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include cookies for authentication
      body: JSON.stringify({ pathways }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("[llm-client] API error:", response.status, errorData)
      throw new Error(errorData.error || `Failed to get opportunities (${response.status})`)
    }

    const result = await response.json()
    return result.opportunities
  } catch (error) {
    console.error("[llm-client] Error in getOpportunitiesForPathways:", error)
    throw error
  }
}
