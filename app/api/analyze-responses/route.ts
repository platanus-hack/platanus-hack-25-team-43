/**
 * @file app/api/analyze-responses/route.ts
 * @description AI-powered student profile analysis and pathway recommendations
 * 
 * This API endpoint uses Claude 3 Haiku to analyze student onboarding data
 * and recommend 3 personalized career pathways.
 * 
 * @endpoint POST /api/analyze-responses
 * @authentication None required
 * @ratelimit None (TODO: Add rate limiting)
 * 
 * @input {Object} request body
 * @input {string} name - Student's name
 * @input {string} schoolType - "colegio" or "universidad"
 * @input {string} schoolName - Name of institution
 * @input {number} currentYear - Current academic year
 * @input {Object} openResponses - Map of open-ended reflections
 * @input {Object} preferenceResponses - Map of multiple-choice preferences
 * @input {Array} grades - Array of {subject: string, grade: number}
 * 
 * @output {Object} response
 * @output {boolean} success - Whether analysis succeeded
 * @output {Array} pathways - Array of 3 recommended pathways
 * @output {string} pathways[].name - Pathway name
 * @output {string} pathways[].rationale - Why it fits the student
 * @output {Array<string>} pathways[].actionSteps - Steps to get started
 * @output {string} pathways[].timeline - Time to proficiency
 * 
 * @ai_model claude-3-haiku-20240307
 * @avg_response_time 5-10 seconds
 * 
 * @example
 * // Request
 * POST /api/analyze-responses
 * {
 *   "name": "María",
 *   "schoolType": "universidad",
 *   "schoolName": "Universidad de los Andes",
 *   "currentYear": 2,
 *   "openResponses": {
 *     "futureVision": "Dirijo proyectos de impacto social y tecnológico...",
 *     "dailyFeeling": "Propósito y emoción cada mañana",
 *     "problemEnjoyment": "Retos complejos que mezclan datos y personas",
 *     "skillFocus": "Product management y storytelling",
 *     "oneWeekJob": "Product Manager en una startup de salud"
 *   },
 *   "preferenceResponses": {
 *     "consideredCollege": "Sí",
 *     "wantsCollege": "Tal vez",
 *     "environmentComfort": "Interiores",
 *     "workStyle": "Una mezcla de ambos",
 *     "dayPreference": "Algo diferente cada día",
 *     "workPace": "Una mezcla según la tarea",
 *     "taskComfort": "Tareas donde puedes sumar tus ideas",
 *     "activityPreference": "Una combinación de ambas",
 *     "technologyComfort": "Me siento cómodo/a y hasta lo disfruto",
 *     "communicationStyle": "Hablar con grupos pequeños"
 *   },
 *   "grades": [
 *     { "subject": "Matemáticas", "grade": 9.5 },
 *     { "subject": "Programación", "grade": 9.0 }
 *   ]
 * }
 * 
 * // Response
 * {
 *   "success": true,
 *   "pathways": [
 *     {
 *       "name": "Software Engineering",
 *       "rationale": "Strong math and programming skills...",
 *       "actionSteps": ["Learn React", "Build portfolio", ...],
 *       "timeline": "12 months"
 *     },
 *     ...
 *   ]
 * }
 * 
 * @see lib/llm-client.ts - Client-side wrapper
 * @see components/onboarding/onboarding-modal.tsx - Usage example
 */

import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import { OPEN_ENDED_QUESTIONS, PREFERENCE_QUESTIONS } from "@/lib/onboarding-questions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, schoolType, schoolName, currentYear, grades } = body
    const openResponses: Record<string, string> = body.openResponses ?? {}
    const preferenceResponses: Record<string, string> = body.preferenceResponses ?? {}

    // Calculate average grade
    const averageGrade =
      grades && grades.length > 0
        ? (grades.reduce((sum: number, g: { grade: number }) => sum + g.grade, 0) / grades.length).toFixed(1)
        : "N/A"

    // List top subjects
    const topSubjects =
      grades && grades.length > 0
        ? grades
            .sort((a: { grade: number }, b: { grade: number }) => b.grade - a.grade)
            .slice(0, 3)
            .map((g: { subject: string; grade: number }) => `${g.subject} (${g.grade}/10)`)
            .join(", ")
        : "N/A"

    const openEndedContext = OPEN_ENDED_QUESTIONS.map((question) => {
      const answer = openResponses?.[question.id]?.trim()
      return `- ${question.label}: ${answer && answer.length > 0 ? answer : "Sin respuesta"}`
    }).join("\n")

    const preferenceContext = PREFERENCE_QUESTIONS.map((question) => {
      const answer = preferenceResponses?.[question.id]?.trim()
      return `- ${question.question}: ${answer && answer.length > 0 ? answer : "Sin respuesta"}`
    }).join("\n")

    // Create a comprehensive prompt for LLM analysis
    const prompt = `
You are a career counselor analyzing a student's profile to recommend 3 career pathways. 

Student Profile:
- Name: ${name}
- Education Level: ${schoolType === "colegio" ? "High School" : "University"}
- Institution: ${schoolName}
- Current Year: Year ${currentYear}
- Average Grade: ${averageGrade}/10
- Top Subjects: ${topSubjects}

Reflexiones Abiertas:
${openEndedContext}

Preferencias y estilo:
${preferenceContext}

Based on this information, provide exactly 3 recommended career pathways. For each pathway:
1. Explain why it matches the student's profile
2. List specific action steps (5-7 steps)
3. Estimate timeline to achieve proficiency (in months)

Format your response as JSON with this structure:
{
  "pathways": [
    {
      "name": "Pathway Name",
      "rationale": "Why this fits their profile",
      "actionSteps": ["Step 1", "Step 2", ...],
      "timeline": "X months"
    },
    ...
  ]
}

Ensure recommendations are ambitious yet achievable for a LATAM student looking to advance internacionalmente.
Focus on practical, actionable pathways that align with their interests, emociones deseadas y estilo de trabajo preferido.
    `.trim()

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
      console.error("⚠️  CRITICAL: Missing ANTHROPIC_API_KEY")
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
      console.error("\n🔴 The AI pathway analysis requires an Anthropic API key.")
      console.error("\n📝 To fix this:")
      console.error("   1. Get an API key from: https://console.anthropic.com/")
      console.error("   2. Add it to your .env.local file:")
      console.error("      ANTHROPIC_API_KEY=sk-ant-...")
      console.error("   3. Restart your development server")
      console.error("\n📖 See SETUP.md for detailed instructions.")
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
      
      return Response.json(
        {
          success: false,
          error: "AI analysis is not configured. The ANTHROPIC_API_KEY environment variable is missing. Please contact the administrator or see the console for setup instructions.",
        },
        { status: 500 },
      )
    }

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Parse the LLM response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    if (!analysis || !analysis.pathways) {
      throw new Error("Failed to parse LLM response")
    }

    return Response.json({
      success: true,
      pathways: analysis.pathways,
    })
  } catch (error) {
    console.error("[v0] Error analyzing responses:", error)
    
    // Log detailed error information for debugging
    if (error && typeof error === 'object') {
      console.error("[v0] Error details:", {
        message: (error as any).message,
        statusCode: (error as any).statusCode,
        responseBody: (error as any).responseBody,
        cause: (error as any).cause,
      })
    }
    
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 },
    )
  }
}
