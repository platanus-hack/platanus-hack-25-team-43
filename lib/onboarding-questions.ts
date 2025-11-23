export type OpenEndedQuestionId =
  | "futureVision"
  | "dailyFeeling"
  | "problemEnjoyment"
  | "skillFocus"
  | "oneWeekJob"

export type PreferenceQuestionId =
  | "consideredCollege"
  | "wantsCollege"
  | "environmentComfort"
  | "workStyle"
  | "dayPreference"
  | "workPace"
  | "taskComfort"
  | "activityPreference"
  | "technologyComfort"
  | "communicationStyle"

export type UniversityPurposeQuestionId =
  | "universityMainPurpose"
  | "campusPreference"
  | "specialistVsGeneralist"
  | "learningStylePreference"
  | "academicSocialIntegration"

export interface OpenEndedQuestion {
  id: OpenEndedQuestionId
  label: string
  placeholder: string
}

export interface PreferenceQuestion {
  id: PreferenceQuestionId
  question: string
  options: string[]
}

export interface UniversityPurposeQuestion {
  id: UniversityPurposeQuestionId
  question: string
  options: string[]
}

export type OpenEndedResponses = Record<OpenEndedQuestionId, string>
export type PreferenceResponses = Record<PreferenceQuestionId, string>
export type UniversityPurposeResponses = Record<UniversityPurposeQuestionId, string>

export const OPEN_ENDED_QUESTIONS: OpenEndedQuestion[] = [
  {
    id: "futureVision",
    label: "Si pudieras diseñar tu día perfecto dentro de cinco años, ¿qué estarías haciendo?",
    placeholder: "Descríbelo con detalles: actividades, personas, lugares y sensaciones.",
  },
  {
    id: "dailyFeeling",
    label: "Cuando imaginas tu futuro, ¿qué emoción esperas sentir todos los días?",
    placeholder: "Piensa en una sensación que quieras que te acompañe siempre (tranquilidad, emoción, impacto...).",
  },
  {
    id: "problemEnjoyment",
    label: "¿Qué tipo de problemas disfrutas resolver realmente?",
    placeholder: "Por ejemplo: retos técnicos, situaciones sociales, temas creativos, estrategias, etc.",
  },
  {
    id: "skillFocus",
    label: "Si tuvieras más tiempo libre ahora, ¿en qué te gustaría mejorar?",
    placeholder: "Menciona habilidades concretas o áreas que te gustaría dominar.",
  },
  {
    id: "oneWeekJob",
    label: "Si pudieras probar cualquier trabajo durante una semana sin riesgo, ¿cuál elegirías?",
    placeholder: "Cuenta qué rol te intriga y qué te gustaría aprender de esa experiencia.",
  },
]

export const PREFERENCE_QUESTIONS: PreferenceQuestion[] = [
  {
    id: "consideredCollege",
    question: "¿Alguna vez has pensado en ir a la universidad?",
    options: ["Sí", "Tal vez", "No"],
  },
  {
    id: "wantsCollege",
    question: "¿Quieres ir a la universidad?",
    options: ["Sí", "Tal vez", "No"],
  },
  {
    id: "environmentComfort",
    question: "¿Qué entorno se siente más cómodo para ti?",
    options: ["Interiores", "Al aire libre", "Sin preferencia"],
  },
  {
    id: "workStyle",
    question: "Cuando trabajas en algo importante, ¿qué se siente más natural?",
    options: ["Trabajar de forma independiente", "Trabajar en equipo", "Una mezcla de ambos"],
  },
  {
    id: "dayPreference",
    question: "¿Qué tipo de día disfrutarías más?",
    options: ["Una rutina predecible", "Algo diferente cada día", "Algo intermedio"],
  },
  {
    id: "workPace",
    question: "¿Qué ritmo de trabajo se siente más natural para ti?",
    options: ["Un ritmo estable y predecible", "Una mezcla según la tarea", "Un ritmo rápido y energético"],
  },
  {
    id: "taskComfort",
    question: "¿Qué tipo de tarea te resulta más cómoda?",
    options: [
      "Tareas con instrucciones claras",
      "Tareas donde puedes sumar tus ideas",
      "Tareas donde decides todo desde cero",
    ],
  },
  {
    id: "activityPreference",
    question: "¿Qué tipo de actividad te resulta más satisfactoria?",
    options: ["Usar tus manos o moverte", "Pensar, planear o analizar", "Una combinación de ambas"],
  },
  {
    id: "technologyComfort",
    question: "¿Cómo te sientes al trabajar con tecnología?",
    options: ["Me siento cómodo/a y hasta lo disfruto", "La uso cuando es necesario", "Prefiero usar lo mínimo posible"],
  },
  {
    id: "communicationStyle",
    question: "¿Qué estilo de comunicación encaja mejor contigo?",
    options: ["Conversar uno a uno", "Hablar con grupos pequeños", "Trabajar en silencio y comunicar sólo cuando toca"],
  },
]

export const createEmptyOpenResponses = (): OpenEndedResponses =>
  OPEN_ENDED_QUESTIONS.reduce((acc, question) => {
    acc[question.id] = ""
    return acc
  }, {} as OpenEndedResponses)

export const createEmptyPreferenceResponses = (): PreferenceResponses =>
  PREFERENCE_QUESTIONS.reduce((acc, question) => {
    acc[question.id] = ""
    return acc
  }, {} as PreferenceResponses)

export const UNIVERSITY_PURPOSE_QUESTIONS: UniversityPurposeQuestion[] = [
  {
    id: "universityMainPurpose",
    question: "¿Cuál es el propósito principal de la universidad para ti?",
    options: [
      "Dominar conocimiento teórico profundo en una materia",
      "Ganar habilidades prácticas listas para el trabajo",
      "Una mezcla equilibrada de ambos"
    ]
  },
  {
    id: "campusPreference",
    question: "¿Qué tipo de entorno universitario prefieres?",
    options: [
      "Una 'burbuja universitaria' donde mi vida gira en torno al campus",
      "Un campus en una gran ciudad donde mi vida se integra con una comunidad diversa y no estudiantil",
      "No tengo una preferencia clara"
    ]
  },
  {
    id: "specialistVsGeneralist",
    question: "¿Qué te emociona más?",
    options: [
      "Convertirme en un experto destacado en una especialidad específica",
      "Ser un generalista que combina ideas de muchas materias diferentes",
      "Algo intermedio"
    ]
  },
  {
    id: "learningStylePreference",
    question: "¿Qué estilo de aprendizaje suena mejor?",
    options: [
      "Clases grandes y formales con profesores famosos",
      "Seminarios pequeños basados en discusión con interacción cercana con profesores",
      "Una combinación de ambos"
    ]
  },
  {
    id: "academicSocialIntegration",
    question: "¿Quieres que tu vida académica y social estén...?",
    options: [
      "Estrechamente integradas (grupos de estudio, eventos de residencias, laboratorios de investigación)",
      "Claramente separadas (vas a clase, luego te enfocas en pasatiempos, familia o trabajo)",
      "Un equilibrio entre ambos"
    ]
  }
]

export const createEmptyUniversityPurposeResponses = (): UniversityPurposeResponses =>
  UNIVERSITY_PURPOSE_QUESTIONS.reduce((acc, question) => {
    acc[question.id] = ""
    return acc
  }, {} as UniversityPurposeResponses)


