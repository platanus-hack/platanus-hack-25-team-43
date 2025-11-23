import { NextRequest, NextResponse } from "next/server"
import { getLLMClient } from "@/lib/llm-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pathway, userSuggestion, userResponses } = body

    if (!pathway || !userSuggestion) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const llm = getLLMClient()

    // Build context from user responses
    const contextParts: string[] = []
    
    if (userResponses?.openResponses) {
      contextParts.push("User's open-ended responses:")
      Object.entries(userResponses.openResponses).forEach(([key, value]) => {
        if (value) contextParts.push(`- ${key}: ${value}`)
      })
    }

    if (userResponses?.preferenceResponses) {
      contextParts.push("\nUser's preferences:")
      Object.entries(userResponses.preferenceResponses).forEach(([key, value]) => {
        if (value) contextParts.push(`- ${key}: ${value}`)
      })
    }

    if (userResponses?.selectedPathways?.length) {
      contextParts.push(`\nUser's selected pathways: ${userResponses.selectedPathways.join(", ")}`)
    }

    const userContext = contextParts.join("\n")

    const prompt = `Eres un consejero de orientación profesional ayudando a un estudiante a explorar su camino elegido: "${pathway}".

El estudiante ha compartido la siguiente idea o inquietud:
"${userSuggestion}"

${userContext ? `Esto es lo que sabemos sobre el estudiante:\n${userContext}\n` : ""}

Por favor proporciona:
1. Una respuesta alentadora y personalizada reconociendo su idea
2. Consejos específicos y accionables sobre cómo perseguir este interés
3. Primeros pasos potenciales que podrían tomar hoy o esta semana
4. Cualquier recurso, comunidad u oportunidad que deberían explorar
5. Cómo esto se conecta con su camino más amplio y objetivos

Mantén tu respuesta cálida, solidaria y práctica. Escribe en español (el estudiante es de América Latina). 
Limita tu respuesta a un máximo de 300 palabras.

IMPORTANTE: Tu respuesta completa debe estar EN ESPAÑOL.`

    const analysis = await llm.generateText(prompt)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error analyzing suggestion:", error)
    return NextResponse.json(
      { error: "Failed to analyze suggestion" },
      { status: 500 }
    )
  }
}


