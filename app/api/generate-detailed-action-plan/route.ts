import { NextRequest, NextResponse } from "next/server"
import { getLLMClient } from "@/lib/llm-client"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { opportunities, pathways, userResponses } = body

    if (!opportunities || opportunities.length === 0) {
      return NextResponse.json(
        { success: false, error: "No hay oportunidades seleccionadas" },
        { status: 400 }
      )
    }

    const llm = getLLMClient()

    const opportunitiesList = opportunities
      .map((opp: any, idx: number) => `${idx + 1}. ${opp.title} - ${opp.description} (${opp.provider || opp.company || 'Proveedor no especificado'})`)
      .join('\n')

    const prompt = `Eres un experto en planificación educativa y desarrollo de carrera.

CAMINOS DEL ESTUDIANTE: ${pathways.join(', ')}

OPORTUNIDADES SELECCIONADAS:
${opportunitiesList}

${userResponses ? `CONTEXTO DEL ESTUDIANTE:
- Tipo de institución: ${userResponses.schoolType || "No especificado"}
- Año actual: ${userResponses.currentYear || "No especificado"}
${userResponses.openResponses ? Object.entries(userResponses.openResponses).map(([key, value]) => `- ${key}: ${value}`).join('\n') : ''}
` : ''}

Tu tarea es crear un PLAN DE ACCIÓN DETALLADO y ESPECÍFICO que integre todas estas oportunidades de manera coherente y estratégica.

El plan debe:
1. Ser PRÁCTICO y ACCIONABLE - pasos concretos que el estudiante puede empezar HOY
2. Integrar las oportunidades seleccionadas de manera lógica y secuencial
3. Tener un cronograma realista considerando el nivel educativo del estudiante
4. Incluir pasos preparatorios antes de aplicar a las oportunidades
5. Considerar requisitos, deadlines y preparación necesaria
6. Balancear múltiples oportunidades sin sobrecargar al estudiante

Responde SOLO con un JSON válido en el siguiente formato:
{
  "overview": "Descripción breve del plan general (2-3 líneas)",
  "totalDuration": "Duración total estimada (ej: 3-6 meses, 1 año)",
  "steps": [
    {
      "step": 1,
      "title": "Título del paso",
      "description": "Descripción del paso (1-2 líneas)",
      "timeline": "Semana 1-2, Mes 1, etc.",
      "priority": "high|medium|low",
      "relatedOpportunity": "Nombre de la oportunidad relacionada (si aplica)",
      "tasks": [
        "Tarea específica 1",
        "Tarea específica 2",
        "Tarea específica 3"
      ]
    }
  ],
  "milestones": [
    {
      "week": 4,
      "description": "Descripción del hito"
    }
  ],
  "tips": [
    "Consejo práctico 1",
    "Consejo práctico 2",
    "Consejo práctico 3"
  ]
}

IMPORTANTE:
- Crea entre 5-8 pasos concretos
- Cada paso debe tener 3-5 tareas específicas
- Los pasos deben seguir un orden lógico
- Incluye 3-5 hitos importantes
- Incluye 4-6 consejos prácticos

NO incluyas explicaciones adicionales, SOLO el JSON.`

    const completion = await llm.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un experto en planificación educativa y desarrollo de carrera. Respondes SOLO con JSON válido, sin texto adicional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    })

    const responseText = completion.choices[0]?.message?.content?.trim() || ""
    
    // Try to extract JSON from response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("[generate-detailed-action-plan] No JSON found in response:", responseText)
      return NextResponse.json(
        { success: false, error: "Error al procesar la respuesta de la IA" },
        { status: 500 }
      )
    }

    const parsedData = JSON.parse(jsonMatch[0])

    if (!parsedData.steps || !Array.isArray(parsedData.steps)) {
      console.error("[generate-detailed-action-plan] Invalid response structure:", parsedData)
      return NextResponse.json(
        { success: false, error: "Respuesta inválida de la IA" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      plan: parsedData,
    })

  } catch (error) {
    console.error("[generate-detailed-action-plan] Error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Error al generar el plan detallado" 
      },
      { status: 500 }
    )
  }
}

