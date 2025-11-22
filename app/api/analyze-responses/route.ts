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
 * @input {string} motivation - Career motivation text
 * @input {string} goals - 3-5 year goals text
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
 *   "motivation": "Quiero ayudar a mi comunidad con tecnología",
 *   "goals": "Trabajar en una startup tech internacional",
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, schoolType, schoolName, currentYear, motivation, goals, grades } = body

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

Student's Responses:
- Career Motivation: ${motivation}
- Goals (3-5 years): ${goals}

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

Ensure recommendations are ambitious yet achievable for a LATAM student looking to advance internationally.
Focus on practical, actionable pathways that align with their interests and academic strengths.
    `.trim()

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("[v0] Anthropic API key not configured")
      return Response.json(
        {
          success: false,
          error: "Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file.",
        },
        { status: 500 },
      )
    }

    // Debug: Log API key presence (first 10 chars only for security)
    console.log("[v0] API Key present:", process.env.ANTHROPIC_API_KEY?.substring(0, 15) + "...")

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
