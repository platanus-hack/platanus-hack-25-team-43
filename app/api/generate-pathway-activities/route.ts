import { NextRequest, NextResponse } from "next/server"
import { getLLMClient } from "@/lib/llm-client"

interface PersonalizedActivity {
  title: string
  description: string
  timeframe: string
  difficulty: "beginner" | "intermediate" | "advanced"
  link?: string
  relevance: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pathway, userResponses } = body

    if (!pathway) {
      return NextResponse.json({ error: "Missing pathway" }, { status: 400 })
    }

    const llm = getLLMClient()

    // Build context from user responses
    const contextParts: string[] = []
    
    if (userResponses?.openResponses) {
      contextParts.push("User's aspirations and preferences:")
      
      if (userResponses.openResponses.futureVision) {
        contextParts.push(`- Future vision: ${userResponses.openResponses.futureVision}`)
      }
      if (userResponses.openResponses.problemEnjoyment) {
        contextParts.push(`- Problems they enjoy solving: ${userResponses.openResponses.problemEnjoyment}`)
      }
      if (userResponses.openResponses.skillFocus) {
        contextParts.push(`- Skills they want to develop: ${userResponses.openResponses.skillFocus}`)
      }
      if (userResponses.openResponses.oneWeekJob) {
        contextParts.push(`- Job they'd like to try: ${userResponses.openResponses.oneWeekJob}`)
      }
    }

    if (userResponses?.preferenceResponses) {
      contextParts.push("\nWork style and preferences:")
      
      if (userResponses.preferenceResponses.workStyle) {
        contextParts.push(`- Work style: ${userResponses.preferenceResponses.workStyle}`)
      }
      if (userResponses.preferenceResponses.activityPreference) {
        contextParts.push(`- Activity preference: ${userResponses.preferenceResponses.activityPreference}`)
      }
      if (userResponses.preferenceResponses.technologyComfort) {
        contextParts.push(`- Technology comfort: ${userResponses.preferenceResponses.technologyComfort}`)
      }
    }

    if (userResponses?.schoolType) {
      contextParts.push(`\nCurrent situation: ${userResponses.schoolType === "universidad" ? "University student" : "High school student"}`)
      if (userResponses.currentYear) {
        contextParts.push(`Year: ${userResponses.currentYear}`)
      }
    }

    const userContext = contextParts.join("\n")

    const prompt = `Eres un asesor de carrera ayudando a un estudiante latinoamericano a explorar el camino: "${pathway}".

${userContext ? `Esto es lo que sabemos sobre el estudiante:\n${userContext}\n` : ""}

Genera 4-5 actividades ESPECÍFICAS y ACCIONABLES que puedan hacer HOY o ESTA SEMANA para comenzar a progresar en este camino.

Directrices importantes:
1. Las actividades deben ser GRATUITAS o de muy bajo costo (accesibles para estudiantes)
2. Las actividades deben ser ESPECÍFICAS y ACCIONABLES (no vagas como "aprende programación")
3. Considera su ubicación (América Latina) y proporciona recursos locales o en línea relevantes
4. Mezcla diferentes niveles de dificultad (principiante a intermedio)
5. Incluye actividades en línea y fuera de línea cuando sea posible
6. Cada actividad debe ser realista para completar en el tiempo indicado
7. Proporciona enlaces reales a recursos cuando sea posible (sitios web reales, plataformas, comunidades)

IMPORTANTE: Toda tu respuesta debe estar EN ESPAÑOL. Nombres, descripciones, títulos, todo debe ser en español.

Para cada actividad, proporciona:
- title: Un título claro y específico (en español)
- description: Qué harán y qué aprenderán (2-3 oraciones, en español)
- timeframe: Cuánto tiempo tomará (ej: "30 minutos", "2 horas", "Esta semana")
- difficulty: "beginner", "intermediate", o "advanced"
- link: Una URL real para comenzar (si aplica) - debe ser un enlace real y funcional
- relevance: Por qué esta actividad coincide con su perfil (1 oración, en español)

Devuelve SOLO un array JSON válido de actividades, sin otro texto. Formato:
[
  {
    "title": "string",
    "description": "string",
    "timeframe": "string",
    "difficulty": "beginner" | "intermediate" | "advanced",
    "link": "string or undefined",
    "relevance": "string"
  }
]

RESPONDE TODO EN ESPAÑOL.`

    const response = await llm.generateText(prompt)
    
    // Try to parse the JSON from the response
    let activities: PersonalizedActivity[] = []
    
    try {
      // Remove any markdown code blocks if present
      const jsonText = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      activities = JSON.parse(jsonText)
    } catch (parseError) {
      console.error("Failed to parse activities JSON:", parseError)
      console.error("Raw response:", response)
      
      // Fallback to default activities if parsing fails
      activities = generateDefaultActivities(pathway)
    }

    return NextResponse.json({ activities })
  } catch (error) {
    console.error("Error generating activities:", error)
    return NextResponse.json(
      { error: "Failed to generate activities" },
      { status: 500 }
    )
  }
}

function generateDefaultActivities(pathway: string): PersonalizedActivity[] {
  const activityMap: Record<string, PersonalizedActivity[]> = {
    "Desarrollo Tecnológico": [
      {
        title: "Completa tu primer curso de programación gratis",
        description: "Inscríbete en freeCodeCamp y completa las primeras 10 lecciones de JavaScript. Es 100% gratis y en español.",
        timeframe: "2-3 horas",
        difficulty: "beginner",
        link: "https://www.freecodecamp.org/espanol/",
        relevance: "Perfecto para empezar sin experiencia previa"
      },
      {
        title: "Construye tu primera página web",
        description: "Usa CodePen para crear una página web simple con HTML y CSS. Experimenta con colores, fuentes y diseños.",
        timeframe: "1-2 horas",
        difficulty: "beginner",
        link: "https://codepen.io/",
        relevance: "Verás resultados inmediatos de tu código"
      },
      {
        title: "Únete a una comunidad tech latina",
        description: "Únete al Discord de 'Latam Developers' para conectar con otros programadores de América Latina y hacer preguntas.",
        timeframe: "30 minutos",
        difficulty: "beginner",
        relevance: "Networking con personas en tu misma situación"
      }
    ],
    "Emprendimiento": [
      {
        title: "Define tu idea de negocio con Lean Canvas",
        description: "Usa la plantilla Lean Canvas gratuita para mapear tu idea de negocio en una página. Identifica clientes, problema y solución.",
        timeframe: "1 hora",
        difficulty: "beginner",
        link: "https://leanstack.com/lean-canvas",
        relevance: "Estructura tus ideas de forma clara y profesional"
      },
      {
        title: "Entrevista a 5 potenciales clientes",
        description: "Identifica 5 personas que podrían usar tu producto/servicio y hazles 3 preguntas sobre sus necesidades. Anota sus respuestas.",
        timeframe: "Esta semana",
        difficulty: "intermediate",
        relevance: "Validación real antes de invertir tiempo y dinero"
      },
      {
        title: "Crea una landing page gratis",
        description: "Usa Carrd o Google Sites para crear una página simple que explique tu idea y capte correos de personas interesadas.",
        timeframe: "2 horas",
        difficulty: "beginner",
        link: "https://carrd.co/",
        relevance: "Presencia online sin necesidad de programar"
      }
    ],
    "Gestión & Negocios": [
      {
        title: "Completa un curso de Excel intermedio",
        description: "Aprende fórmulas esenciales, tablas dinámicas y gráficos en Excel usando el curso gratuito de GCF Global en español.",
        timeframe: "3-4 horas",
        difficulty: "beginner",
        link: "https://edu.gcfglobal.org/es/excel-2016/",
        relevance: "Herramienta fundamental en cualquier rol de negocios"
      },
      {
        title: "Analiza un caso de negocio real",
        description: "Lee un caso de estudio de Harvard Business Review (versión gratuita) y escribe tu análisis de qué harías diferente.",
        timeframe: "2 horas",
        difficulty: "intermediate",
        link: "https://hbr.org/",
        relevance: "Desarrolla pensamiento estratégico con ejemplos reales"
      },
      {
        title: "Practica presentaciones ejecutivas",
        description: "Crea una presentación de 5 minutos sobre un tema que dominas. Grábate y analiza tu lenguaje corporal y claridad.",
        timeframe: "1-2 horas",
        difficulty: "intermediate",
        relevance: "Comunicación efectiva es clave en gestión"
      }
    ]
  }

  return activityMap[pathway] || activityMap["Desarrollo Tecnológico"]
}


