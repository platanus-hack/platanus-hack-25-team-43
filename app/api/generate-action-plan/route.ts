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
 * @input {string} motivation - Career motivation
 * @input {string} goals - 3-5 year goals
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
 *   "motivation": "Tech for social good",
 *   "goals": "Work at international startup"
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, selectedPathways, schoolInfo, motivation, goals } = body

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

    // Create detailed prompt for action plan generation
    const prompt = `
Eres un asesor de carrera experto creando un plan de acción personalizado de 12 semanas (3 meses) para ${name}.

INFORMACIÓN DEL ESTUDIANTE:
- Nombre: ${name}
- Educación: ${schoolInfo?.schoolType === "colegio" ? "Colegio" : "Universidad"} - ${schoolInfo?.schoolName}
- Año actual: ${schoolInfo?.currentYear}
- Motivación: ${motivation}
- Objetivos (3-5 años): ${goals}

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
          "priority": "high" | "medium" | "low",
          "dailyHabit": true | false,
          "estimatedTime": "Tiempo estimado (ej: 2 horas, 30 min diarios)"
        }
      ],
      "milestone": "Qué deberías lograr al final de esta semana"
    }
  ],
  "opportunities": [
    {
      "type": "internship" | "course" | "scholarship" | "summer_camp" | "competition",
      "title": "Nombre específico del programa/oportunidad",
      "provider": "Organización que lo ofrece",
      "pathway": "A qué camino aplica",
      "description": "Descripción breve",
      "applicationPeriod": "Cuándo aplicar (ej: Enero-Marzo)",
      "deadline": "Deadline si es conocido",
      "cost": "free" | "paid" | "scholarship_available",
      "url": "URL si existe (opcional)",
      "recommendedWeek": "En qué semana deberías aplicar"
    }
  ],
  "resources": [
    {
      "type": "book" | "platform" | "community" | "tool" | "course",
      "title": "Nombre del recurso",
      "pathway": "A qué camino aplica",
      "description": "Para qué sirve",
      "cost": "free" | "paid" | "freemium",
      "url": "URL si existe",
      "timing": "Cuándo usar este recurso (ej: Semanas 1-4)"
    }
  ],
  "reminders": [
    {
      "week": 1,
      "title": "Título del recordatorio",
      "description": "Qué hacer o revisar",
      "type": "checkpoint" | "deadline" | "application" | "review",
      "priority": "high" | "medium" | "low"
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
    `.trim()

    console.log("[v0] Generating action plan with Claude...")

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt,
      temperature: 0.7,
      maxTokens: 4000,
    })

    // Parse the LLM response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const plan = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    if (!plan || !plan.weeks) {
      throw new Error("Failed to parse action plan - invalid format")
    }

    // Add metadata
    plan.pathways = selectedPathways
    plan.createdAt = new Date().toISOString()
    plan.studentName = name

    console.log("[v0] Action plan generated successfully:", {
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
