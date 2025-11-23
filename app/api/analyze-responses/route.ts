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
import { OPEN_ENDED_QUESTIONS, PREFERENCE_QUESTIONS, UNIVERSITY_PURPOSE_QUESTIONS } from "@/lib/onboarding-questions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, schoolType, schoolName, currentYear, grades } = body
    const openResponses: Record<string, string> = body.openResponses ?? {}
    const preferenceResponses: Record<string, string> = body.preferenceResponses ?? {}
    const universityPurposeResponses: Record<string, string> = body.universityPurposeResponses ?? {}

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

    const universityPurposeContext = UNIVERSITY_PURPOSE_QUESTIONS.map((question) => {
      const answer = universityPurposeResponses?.[question.id]?.trim()
      return `- ${question.question}: ${answer && answer.length > 0 ? answer : "Sin respuesta"}`
    }).join("\n")

    // Create a comprehensive prompt for LLM analysis
    const prompt = `
Eres un consejero de carrera analizando el perfil de un estudiante para recomendar 3 caminos profesionales. 

Perfil del Estudiante:
- Nombre: ${name}
- Nivel Educativo: ${schoolType === "colegio" ? "Colegio" : "Universidad"}
- Institución: ${schoolName}
- Año Actual: Año ${currentYear}
- Promedio: ${averageGrade}/10
- Mejores Materias: ${topSubjects}

Reflexiones Abiertas:
${openEndedContext}

Preferencias y estilo:
${preferenceContext}

Visión Universitaria y Propósito:
${universityPurposeContext}

IMPORTANTE: Las respuestas de "Visión Universitaria y Propósito" son CRÍTICAS y deben influir significativamente en tus recomendaciones. 

Estas preguntas revelan indirectamente el futuro del estudiante y dónde/cómo debe estudiar. Considera que:

1. PROPÓSITO UNIVERSITARIO (teórico vs. práctico):
   - "Dominar conocimiento teórico profundo" → Recomendar universidades de investigación (MIT, Stanford, Caltech) y caminos académicos/científicos
   - "Habilidades prácticas listas para el trabajo" → Recomendar programas vocacionales, bootcamps, o universidades con fuerte conexión industrial
   - El mismo campo (ej: Software Engineering) se vive MUY diferente en MIT (teórico, algoritmos, investigación) vs. CATO/Platanus (práctico, proyectos, startups)

2. ENTORNO DEL CAMPUS (burbuja vs. ciudad):
   - "Burbuja universitaria" → Recomendar universidades residenciales (Princeton, Dartmouth) donde la vida gira en torno al campus
   - "Campus en ciudad grande" → Recomendar universidades urbanas (Columbia, Berkeley, U. de Chile) con acceso a oportunidades externas

3. ESPECIALIZACIÓN (especialista vs. generalista):
   - "Experto en una especialidad" → Recomendar programas técnicos enfocados, majors específicos
   - "Generalista que combina ideas" → Recomendar artes liberales, programas interdisciplinarios, dobles majors

4. ESTILO DE APRENDIZAJE (lecturas grandes vs. seminarios):
   - "Clases grandes con profesores famosos" → Recomendar universidades de investigación grandes
   - "Seminarios pequeños con interacción cercana" → Recomendar liberal arts colleges, programas boutique

5. INTEGRACIÓN ACADÉMICA-SOCIAL:
   - "Estrechamente integradas" → Recomendar programas con cohorts, residencias temáticas, cultura de colaboración
   - "Claramente separadas" → Recomendar programas flexibles, part-time, o ubicaciones que permitan balance vida-estudio

Usa esta información para recomendar caminos que se alineen no solo con sus intereses, sino también con el TIPO ESPECÍFICO de experiencia universitaria y carrera que buscan.

Basándote en esta información, proporciona exactamente 3 caminos profesionales recomendados. Para cada camino:
1. Explica por qué se ajusta al perfil del estudiante (INCLUYENDO consideraciones de universidad y estilo de aprendizaje)
2. Menciona brevemente qué tipo de programas universitarios o instituciones se alinean con este camino (si aplica)
3. Lista pasos de acción específicos (5-7 pasos)
4. Estima el tiempo para alcanzar competencia (en meses)

IMPORTANTE: Tu respuesta debe estar completamente en español. Todos los nombres de caminos, razones, pasos y descripciones deben estar en español.

Formatea tu respuesta como JSON con esta estructura:
{
  "pathways": [
    {
      "name": "Nombre del Camino",
      "rationale": "Por qué esto se ajusta a su perfil, incluyendo consideraciones de universidad y estilo de aprendizaje. Menciona brevemente qué tipo de programas o instituciones se alinean con este camino.",
      "actionSteps": ["Paso 1", "Paso 2", ...],
      "timeline": "X meses"
    },
    ...
  ]
}

Asegúrate de que las recomendaciones sean ambiciosas pero alcanzables para un estudiante de LATAM que busca avanzar internacionalmente.
Enfócate en caminos prácticos y accionables que se alineen con sus intereses, emociones deseadas y estilo de trabajo preferido.
RESPONDE TODO EN ESPAÑOL.
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

    console.warn("[v0] Raw LLM response:", text)

    // Parse the LLM response with better error handling
    let analysis = null
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error("[v0] No JSON found in LLM response")
        throw new Error("No JSON found in LLM response")
      }
      
      const jsonStr = jsonMatch[0]
      console.warn("[v0] Extracted JSON string:", jsonStr)
      
      // Try to parse the JSON
      analysis = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error("[v0] JSON parsing failed:", parseError)
      console.error("[v0] Attempted to parse:", text)
      
      // Try to clean up common JSON issues
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          let cleaned = jsonMatch[0]
          // Remove trailing commas before closing braces/brackets
          cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1')
          // Remove newlines within strings
          cleaned = cleaned.replace(/"\s*\n\s*/g, '" ')
          
          console.warn("[v0] Trying to parse cleaned JSON:", cleaned)
          analysis = JSON.parse(cleaned)
        }
      } catch (cleanupError) {
        console.error("[v0] Cleanup parsing also failed:", cleanupError)
        throw new Error("Failed to parse LLM response even after cleanup")
      }
    }

    if (!analysis || !analysis.pathways) {
      console.error("[v0] Invalid analysis structure:", analysis)
      throw new Error("Failed to parse LLM response: missing pathways")
    }

    return Response.json({
      success: true,
      pathways: analysis.pathways,
    })
  } catch (error) {
    console.error("[v0] Error analyzing responses:", error)
    
    // Log detailed error information for debugging
    if (error && typeof error === 'object') {
      const errorObj = error as Error & { statusCode?: number; responseBody?: string; cause?: unknown }
      console.error("[v0] Error details:", {
        message: errorObj.message,
        statusCode: errorObj.statusCode,
        responseBody: errorObj.responseBody,
        cause: errorObj.cause,
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
