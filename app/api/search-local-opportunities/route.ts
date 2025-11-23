import { NextRequest, NextResponse } from "next/server"
import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pathway, location, userResponses, specificTopic } = body

    console.log('[search-local-opportunities] Request:', { pathway, location, specificTopic })

    if (!pathway || !location) {
      return NextResponse.json(
        { success: false, error: "Falta el camino o la ubicación" },
        { status: 400 }
      )
    }

    const topicContext = specificTopic 
      ? `\nTEMA ESPECÍFICO A BUSCAR: ${specificTopic}\nCentra la búsqueda en encontrar oportunidades relacionadas con este tema específico.` 
      : ''

    const prompt = `Eres un experto en búsqueda de oportunidades educativas y profesionales locales.

UBICACIÓN DEL USUARIO: ${location}
CAMINO/INTERÉS: ${pathway}${topicContext}

${userResponses ? `CONTEXTO DEL ESTUDIANTE:
- Tipo de institución: ${userResponses.schoolType || "No especificado"}
- Año actual: ${userResponses.currentYear || "No especificado"}
${userResponses.openResponses ? Object.entries(userResponses.openResponses).map(([key, value]) => `- ${key}: ${value}`).join('\n') : ''}
` : ''}

Tu tarea es identificar 4-6 oportunidades REALES Y ESPECÍFICAS disponibles en ${location} relacionadas con ${pathway}${specificTopic ? ` y especialmente con: ${specificTopic}` : ''}.

IMPORTANTE:
1. Busca organizaciones, empresas, instituciones educativas, o programas REALES que existan en ${location}
2. Las oportunidades deben ser específicas de la ubicación (no programas genéricos online)
3. Incluye información práctica como nombres de organizaciones, ubicaciones específicas dentro de la ciudad
4. Prioriza oportunidades accesibles para el nivel educativo del estudiante
5. Varía el tipo de oportunidades: talleres locales, eventos, meetups, programas de mentorí­a, empresas que ofrecen pasantías, centros culturales, etc.
6. NO agrupes por tipo, lista las oportunidades en el orden que consideres más relevante

Responde SOLO con un JSON válido en el siguiente formato:
{
  "opportunities": [
    {
      "id": "unique-id",
      "title": "Título específico de la oportunidad",
      "description": "Descripción breve de qué es y qué ofrece (2-3 líneas)",
      "provider": "Nombre de la organización o empresa",
      "duration": "Duración estimada o formato (ej: 3 meses, Sábados 10am-2pm, Evento único)",
      "location": "Ubicación específica dentro de ${location}",
      "type": "local_opportunity"
    }
  ]
}

NO incluyas explicaciones adicionales, SOLO el JSON.`

    console.log('[search-local-opportunities] Calling AI...')

    const result = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      prompt,
      temperature: 0.8,
      maxTokens: 2000,
    })

    const responseText = result.text
    console.log('[search-local-opportunities] AI Response length:', responseText?.length || 0)
    
    if (!responseText) {
      console.error("[search-local-opportunities] Empty response from AI")
      return NextResponse.json(
        { success: false, error: "Respuesta vacía de la IA" },
        { status: 500 }
      )
    }

    // Try to extract JSON from response
    let jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error("[search-local-opportunities] No JSON found in response:", responseText.substring(0, 500))
      return NextResponse.json(
        { success: false, error: "No se pudo extraer datos de la respuesta de la IA" },
        { status: 500 }
      )
    }

    console.log('[search-local-opportunities] Parsing JSON...')
    const parsedData = JSON.parse(jsonMatch[0])

    if (!parsedData.opportunities || !Array.isArray(parsedData.opportunities)) {
      console.error("[search-local-opportunities] Invalid response structure:", parsedData)
      return NextResponse.json(
        { success: false, error: "Estructura de respuesta inválida" },
        { status: 500 }
      )
    }

    console.log('[search-local-opportunities] Success! Found', parsedData.opportunities.length, 'opportunities')

    return NextResponse.json({
      success: true,
      opportunities: parsedData.opportunities,
    })

  } catch (error) {
    console.error("[search-local-opportunities] Error:", error)
    
    // Better error message handling
    let errorMessage = "Error al buscar oportunidades locales"
    if (error instanceof Error) {
      errorMessage = error.message
      // Don't expose model names in error messages to user
      if (errorMessage.includes('claude-3-5-sonnet')) {
        errorMessage = "Error de configuración de la IA. Por favor intenta de nuevo."
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    )
  }
}

