/**
 * @file app/api/generate-action-plan/route.ts
 * @description AI-powered 12-week personalized action plan generation
 * 
 * This API endpoint uses Claude 3 Haiku to create comprehensive action plans
 * with weekly tasks, opportunities, resources, and reminders tailored to the
 * student's chosen career pathways and profile.
 * 
 * @endpoint POST /api/generate-action-plan
 * @authentication None required
 * @ratelimit None (TODO: Add rate limiting)
 * 
 * @input {Object} request body
 * @input {string} name - Student's name
 * @input {Array<string>} selectedPathways - Chosen career pathways
 * @input {Object} schoolInfo - School information
 * @input {string} schoolInfo.schoolType - "colegio" or "universidad"
 * @input {string} schoolInfo.schoolName - Institution name
 * @input {number} schoolInfo.currentYear - Current academic year
 * @input {Object} openResponses - Map of open-ended reflections
 * @input {Object} preferenceResponses - Map of multiple-choice preferences
 * 
 * @output {Object} response
 * @output {boolean} success - Whether generation succeeded
 * @output {Object} plan - Complete action plan
 * @output {string} plan.title - Plan title
 * @output {string} plan.overview - Plan description
 * @output {Array} plan.weeks - 12 weeks of structured tasks
 * @output {Array} plan.opportunities - 10+ curated opportunities
 * @output {Array} plan.resources - 15+ learning resources
 * @output {Array} plan.reminders - 20+ scheduled reminders
 * @output {Array} plan.checkpoints - Progress checkpoints
 * 
 * @ai_model claude-3-haiku-20240307
 * @avg_response_time 8-15 seconds
 * @max_tokens 4000
 * 
 * @example
 * // Request
 * POST /api/generate-action-plan
 * {
 *   "name": "María",
 *   "selectedPathways": ["Software Engineering", "Data Science"],
 *   "schoolInfo": {
 *     "schoolType": "universidad",
 *     "schoolName": "Universidad de los Andes",
 *     "currentYear": 2
 *   },
 *   "openResponses": {
 *     "futureVision": "Impactar salud pública con analítica de datos",
 *     "dailyFeeling": "Propósito y emoción cada día",
 *     "problemEnjoyment": "Retos complejos entre ciencia y comunidad",
 *     "skillFocus": "Storytelling y liderazgo técnico",
 *     "oneWeekJob": "Diseñar estrategias como epidemióloga urbana"
 *   },
 *   "preferenceResponses": {
 *     "consideredCollege": "Sí",
 *     "wantsCollege": "Sí",
 *     "environmentComfort": "Al aire libre",
 *     "workStyle": "Una mezcla de ambos",
 *     "dayPreference": "Algo diferente cada día",
 *     "workPace": "Una mezcla según la tarea",
 *     "taskComfort": "Tareas donde puedes sumar tus ideas",
 *     "activityPreference": "Una combinación de ambas",
 *     "technologyComfort": "Me siento cómodo/a y hasta lo disfruto",
 *     "communicationStyle": "Hablar con grupos pequeños"
 *   }
 * }
 * 
 * // Response
 * {
 *   "success": true,
 *   "plan": {
 *     "title": "Tu Plan de Acción Personalizado - 12 Semanas",
 *     "overview": "Plan estructurado para...",
 *     "weeks": [
 *       {
 *         "week": 1,
 *         "title": "Fundamentos de Programación",
 *         "pathwayFocus": "Software Engineering",
 *         "tasks": [...],
 *         "milestone": "..."
 *       }
 *     ],
 *     "opportunities": [...],
 *     "resources": [...],
 *     "reminders": [...]
 *   }
 * }
 * 
 * @see lib/action-plan-client.ts - Client-side wrapper
 * @see components/dashboard/action-plan-generator.tsx - UI component
 */

import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"
import { OPEN_ENDED_QUESTIONS, PREFERENCE_QUESTIONS } from "@/lib/onboarding-questions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, selectedPathways, schoolInfo } = body
    const openResponses: Record<string, string> = body.openResponses ?? {}
    const preferenceResponses: Record<string, string> = body.preferenceResponses ?? {}

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("[v0] Anthropic API key not configured")
      return Response.json(
        {
          success: false,
          error: "Anthropic API key not configured.",
        },
        { status: 500 },
      )
    }

    const openResponsesSummary = OPEN_ENDED_QUESTIONS.map((question) => {
      const answer = openResponses[question.id]?.trim()
      return `- ${question.label}: ${answer && answer.length > 0 ? answer : "Sin respuesta"}`
    }).join("\n")

    const preferenceSummary = PREFERENCE_QUESTIONS.map((question) => {
      const answer = preferenceResponses[question.id]?.trim()
      return `- ${question.question}: ${answer && answer.length > 0 ? answer : "Sin respuesta"}`
    }).join("\n")

    // Create detailed prompt for action plan generation
    const prompt = `
Eres un asesor de carrera experto creando un plan de acción personalizado de 12 semanas (3 meses) para ${name}.

INFORMACIÓN DEL ESTUDIANTE:
- Nombre: ${name}
- Educación: ${schoolInfo?.schoolType === "colegio" ? "Colegio" : "Universidad"} - ${schoolInfo?.schoolName}
- Año actual: ${schoolInfo?.currentYear}
- Visión personal (respuestas abiertas):
${openResponsesSummary}
- Preferencias y estilo de aprendizaje:
${preferenceSummary}

CAMINOS ELEGIDOS:
${selectedPathways.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

INSTRUCCIONES:
Crea un plan de acción detallado que incluya:

1. **Plan Semanal (12 semanas)**: Tareas específicas, prioridades y hábitos diarios
2. **Oportunidades**: Internships, cursos, becas, campamentos de verano específicos para LATAM
3. **Recursos**: Libros, plataformas, comunidades, herramientas
4. **Recordatorios**: Fechas clave, deadlines, checkpoints

El plan debe ser:
- Realista y alcanzable para un estudiante en LATAM
- Específico con nombres de programas, plataformas y recursos reales
- Progresivo: empezar con fundamentos, avanzar a aplicaciones
- Incluir oportunidades gratuitas y de bajo costo
- Considerar preparación para oportunidades internacionales

Formato JSON (RESPONDE SOLO CON JSON, SIN TEXTO ADICIONAL):
{
  "title": "Tu Plan de Acción Personalizado - 12 Semanas",
  "overview": "Descripción general del plan y objetivos principales",
  "weeks": [
    {
      "week": 1,
      "title": "Título descriptivo de la semana",
      "pathwayFocus": "Qué camino se enfoca esta semana",
      "tasks": [
        {
          "task": "Descripción específica de la tarea",
          "priority": "high",
          "dailyHabit": true,
          "estimatedTime": "Tiempo estimado (ej: 2 horas, 30 min diarios)"
        }
      ],
      "milestone": "Qué deberías lograr al final de esta semana"
    }
  ],
  "opportunities": [
    {
      "type": "internship",
      "title": "Nombre específico del programa/oportunidad",
      "provider": "Organización que lo ofrece",
      "pathway": "A qué camino aplica",
      "description": "Descripción breve",
      "applicationPeriod": "Cuándo aplicar (ej: Enero-Marzo)",
      "deadline": "Deadline si es conocido",
      "cost": "free",
      "url": "URL si existe (opcional)",
      "recommendedWeek": "En qué semana deberías aplicar"
    }
  ],
  "resources": [
    {
      "type": "book",
      "title": "Nombre del recurso",
      "pathway": "A qué camino aplica",
      "description": "Para qué sirve",
      "cost": "free",
      "url": "URL si existe",
      "timing": "Cuándo usar este recurso (ej: Semanas 1-4)"
    }
  ],
  "reminders": [
    {
      "week": 1,
      "title": "Título del recordatorio",
      "description": "Qué hacer o revisar",
      "type": "checkpoint",
      "priority": "high"
    }
  ],
  "checkpoints": [
    {
      "week": 4,
      "title": "Checkpoint del Mes 1",
      "checkpoint": "Qué revisar en este punto",
      "successMetrics": ["Métrica 1", "Métrica 2", "Métrica 3"]
    }
  ]
}

IMPORTANTE: 
- Incluye al menos 12 semanas de plan
- Mínimo 10 oportunidades reales y específicas
- Mínimo 15 recursos concretos
- Mínimo 20 recordatorios distribuidos
- Usa nombres reales de programas, plataformas y organizaciones
- Enfócate en recursos accesibles desde LATAM
- ASEGÚRATE DE QUE EL JSON ESTÉ BIEN FORMADO: cierra todos los corchetes y llaves, no dejes comas al final de arrays u objetos
- Usa solo valores válidos para los campos tipo enum (priority: "high" | "medium" | "low", type: "internship" | "course" | etc.)
- NO incluyas saltos de línea dentro de strings JSON
    `.trim()

    console.warn("[v0] Generating action plan with Claude...")

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt,
      temperature: 0.7,
      maxTokens: 4000,
    })

    console.log("[v0] Raw LLM response (first 500 chars):", text.substring(0, 500))

    // Parse the LLM response with better error handling
    let plan = null
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error("[v0] No JSON found in LLM response")
        throw new Error("No JSON found in LLM response")
      }
      
      const jsonStr = jsonMatch[0]
      console.log("[v0] Extracted JSON string length:", jsonStr.length)
      
      // Try to parse the JSON
      plan = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error("[v0] JSON parsing failed:", parseError)
      console.error("[v0] Attempted to parse (last 500 chars):", text.slice(-500))
      
      // Try to clean up common JSON issues
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          let cleaned = jsonMatch[0]
          // Remove trailing commas before closing braces/brackets
          cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1')
          // Fix common JSON issues
          cleaned = cleaned.replace(/,(\s*,)/g, ',') // Remove double commas
          cleaned = cleaned.replace(/\[\s*,/g, '[') // Remove leading commas in arrays
          cleaned = cleaned.replace(/,(\s*\])/g, ']') // Remove trailing commas in arrays
          cleaned = cleaned.replace(/,(\s*\})/g, '}') // Remove trailing commas in objects
          // Fix missing commas between array elements (common issue)
          cleaned = cleaned.replace(/\}\s*\{/g, '},{') // Add comma between objects in array
          cleaned = cleaned.replace(/\]\s*\[/g, '],[') // Add comma between arrays
          // Fix newlines in strings (replace with spaces)
          cleaned = cleaned.replace(/"([^"]*)\n\s*([^"]*)"/g, '"$1 $2"')
          
          console.log("[v0] Trying to parse cleaned JSON (last 500 chars):", cleaned.slice(-500))
          plan = JSON.parse(cleaned)
        }
      } catch (cleanupError) {
        console.error("[v0] Cleanup parsing also failed:", cleanupError)
        // If cleaning failed, try to salvage what we can by truncating at the error position
        try {
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch && parseError instanceof SyntaxError) {
            const errorMatch = parseError.message.match(/position (\d+)/)
            if (errorMatch) {
              const errorPos = Number.parseInt(errorMatch[1])
              console.log("[v0] Attempting to truncate at error position:", errorPos)
              let truncated = jsonMatch[0].substring(0, errorPos)
              // Try to close any open structures
              const openBraces = (truncated.match(/\{/g) || []).length - (truncated.match(/\}/g) || []).length
              const openBrackets = (truncated.match(/\[/g) || []).length - (truncated.match(/\]/g) || []).length
              // Remove any trailing commas
              truncated = truncated.replace(/,\s*$/, '')
              // Close open brackets and braces
              truncated += ']'.repeat(Math.max(0, openBrackets))
              truncated += '}'.repeat(Math.max(0, openBraces))
              console.log("[v0] Trying truncated JSON (last 200 chars):", truncated.slice(-200))
              plan = JSON.parse(truncated)
            }
          }
        } catch (truncateError) {
          console.error("[v0] Truncate attempt also failed:", truncateError)
          throw new Error(`Failed to parse LLM response even after all cleanup attempts: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
        }
      }
    }

    if (!plan || !plan.weeks) {
      console.error("[v0] Invalid plan structure:", plan)
      throw new Error("Failed to parse action plan - invalid format (missing weeks)")
    }

    // Add metadata
    plan.pathways = selectedPathways
    plan.createdAt = new Date().toISOString()
    plan.studentName = name

    console.warn("[v0] Action plan generated successfully:", {
      weeks: plan.weeks?.length,
      opportunities: plan.opportunities?.length,
      resources: plan.resources?.length,
    })

    return Response.json({
      success: true,
      plan,
    })
  } catch (error) {
    console.error("[v0] Error generating action plan:", error)
    
    // Detailed error logging
    if (error && typeof error === 'object') {
      console.error("[v0] Error details:", {
        message: (error as any).message,
        statusCode: (error as any).statusCode,
        responseBody: (error as any).responseBody,
      })
    }
    
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate plan",
      },
      { status: 500 },
    )
  }
}
