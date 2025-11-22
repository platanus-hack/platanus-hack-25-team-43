export async function analyzeStudentResponses(data: {
  name: string
  schoolType: string
  schoolName: string
  currentYear: number
  motivation: string
  goals: string
  grades: Array<{ subject: string; grade: number }>
}) {
  try {
    const response = await fetch("/api/analyze-responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to analyze responses")
    }

    const result = await response.json()
    return result.pathways
  } catch (error) {
    console.error("[v0] Error in analyzeStudentResponses:", error)
    throw error
  }
}

export async function getOpportunitiesForPathways(pathways: string[]) {
  try {
    const response = await fetch("/api/get-opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathways }),
    })

    if (!response.ok) {
      throw new Error("Failed to get opportunities")
    }

    const result = await response.json()
    return result.opportunities
  } catch (error) {
    console.error("[v0] Error in getOpportunitiesForPathways:", error)
    throw error
  }
}
