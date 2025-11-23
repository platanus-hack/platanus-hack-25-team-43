"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { analyzeStudentResponses } from "@/lib/llm-client"
import OpenEnded from "./open-ended"
import MultipleChoice from "./multiple-choice"
import PathwayDetailDialog from "@/components/dashboard/pathway-detail-dialog"
import { Target, Rocket, CheckCircle2, Lightbulb } from "lucide-react"
import {
  OPEN_ENDED_QUESTIONS,
  PREFERENCE_QUESTIONS,
  UNIVERSITY_PURPOSE_QUESTIONS,
  createEmptyOpenResponses,
  createEmptyPreferenceResponses,
  createEmptyUniversityPurposeResponses,
  type OpenEndedResponses,
  type PreferenceResponses,
  type UniversityPurposeResponses,
} from "@/lib/onboarding-questions"

type OnboardingStep = "schoolInfo" | "knowledge" | "preferences" | "universityPurpose" | "grades" | "pathways" | "selection" | "summary"

interface GradeEntry {
  subject: string
  grade: number
}

interface OnboardingData {
  name: string
  email: string
  phoneNumber: string
  location: string
  schoolType: "colegio" | "universidad"
  schoolName: string
  currentYear: number
  openResponses: OpenEndedResponses
  preferenceResponses: PreferenceResponses
  universityPurposeResponses: UniversityPurposeResponses
  grades: GradeEntry[]
  selectedPathways: string[]
  customTracks: string[]
}

interface PathwayData {
  name: string
  rationale: string
  actionSteps: string[]
  timeline: string
}

interface OnboardingModalProps {
  onComplete: () => void
  onCancel: () => void
}

export default function OnboardingModal({ onComplete, onCancel }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("schoolInfo")
  const [data, setData] = useState<OnboardingData>({
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    schoolType: "colegio",
    schoolName: "",
    currentYear: 1,
    openResponses: createEmptyOpenResponses(),
    preferenceResponses: createEmptyPreferenceResponses(),
    universityPurposeResponses: createEmptyUniversityPurposeResponses(),
    grades: [],
    selectedPathways: [],
    customTracks: [],
  })
  const [recommendedPathways, setRecommendedPathways] = useState<PathwayData[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Load saved data from localStorage if exists
  useEffect(() => {
    const savedData = localStorage.getItem("onboardingData")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setData((prev) => ({
          ...prev,
          ...parsed,
          email: parsed.email || "",
          name: parsed.name || "",
        }))
      } catch (error) {
        console.error("Error loading onboarding data:", error)
      }
    }
  }, [])

  const handleNext = async () => {
    const steps: OnboardingStep[] = ["schoolInfo", "knowledge", "preferences", "universityPurpose", "grades", "pathways", "selection", "summary"]
    const currentIndex = steps.indexOf(currentStep)

    if (currentStep === "grades" && currentIndex < steps.length - 1) {
      setIsAnalyzing(true)
      try {
        const pathways = await analyzeStudentResponses({
          name: data.name,
          schoolType: data.schoolType,
          schoolName: data.schoolName,
          currentYear: data.currentYear,
          openResponses: data.openResponses,
          preferenceResponses: data.preferenceResponses,
          universityPurposeResponses: data.universityPurposeResponses,
          grades: data.grades,
        })
        setRecommendedPathways(pathways)
      } catch (error) {
        console.error("[v0] Error analyzing responses:", error)
        // Show user-friendly error message
        alert(error instanceof Error ? error.message : "Error al analizar tus respuestas. Por favor, intenta de nuevo.")
      } finally {
        setIsAnalyzing(false)
      }
    }

    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const steps: OnboardingStep[] = ["schoolInfo", "knowledge", "preferences", "universityPurpose", "grades", "pathways", "selection", "summary"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSelectPathway = (pathway: string) => {
    setData((prev) => ({
      ...prev,
      selectedPathways: prev.selectedPathways.includes(pathway)
        ? prev.selectedPathways.filter((p) => p !== pathway)
        : [...prev.selectedPathways, pathway],
    }))
  }

  const handleComplete = async () => {
    setIsSavingProfile(true)
    try {
      const completeData = {
        ...data,
        recommendedPathways,
        completedAt: new Date().toISOString(),
        permanent: true, // Mark as permanent - cannot be retaken
      }
      
      // Save to localStorage
      localStorage.setItem("onboardingData", JSON.stringify(completeData))
      localStorage.setItem("onboardingComplete", "true")
      
      console.warn("[Onboarding] Profile saved permanently:", {
        name: data.name,
        pathways: data.selectedPathways,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error("[Onboarding] Error completing onboarding", error)
    } finally {
      setIsSavingProfile(false)
      onComplete()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
        {currentStep === "schoolInfo" && (
          <SchoolInfoStep
            data={data}
            onUpdate={(updates) => setData({ ...data, ...updates })}
            onNext={handleNext}
            onCancel={onCancel}
          />
        )}
        {currentStep === "knowledge" && (
          <KnowledgeStep
            data={data}
            onUpdate={(updates) => setData({ ...data, ...updates })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === "preferences" && (
          <PreferencesStep
            data={data}
            onUpdate={(updates) => setData({ ...data, ...updates })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === "universityPurpose" && (
          <UniversityPurposeStep
            data={data}
            onUpdate={(updates) => setData({ ...data, ...updates })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === "grades" && (
          <GradesStep
            data={data}
            onUpdate={(updates) => setData({ ...data, ...updates })}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isAnalyzing={isAnalyzing}
          />
        )}
        {currentStep === "pathways" && (
          <PathwaysStep
            recommendedPathways={recommendedPathways}
            selectedPathways={data.selectedPathways}
            onSelectPathway={handleSelectPathway}
            onNext={handleNext}
            onPrevious={handlePrevious}
            userData={data}
          />
        )}
        {currentStep === "selection" && (
          <SelectionStep
            selectedPathways={data.selectedPathways}
            onAddCustomTrack={(track) => {
              setData((prev) => ({
                ...prev,
                customTracks: [...prev.customTracks, track],
                selectedPathways: [...prev.selectedPathways, track],
              }))
            }}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {currentStep === "summary" && (
          <SummaryStep
            data={data}
            selectedPathways={data.selectedPathways}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
            isSaving={isSavingProfile}
          />
        )}
      </Card>
    </div>
  )
}

function SchoolInfoStep({
  data,
  onUpdate,
  onNext,
  onCancel,
}: {
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onCancel: () => void
}) {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Bienvenido a tu Ruta de Éxito</h2>
      <p className="text-muted-foreground mb-6">Comencemos por conocer tu situación actual</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3">¿En qué estás estudiando?</label>
          <div className="space-y-2">
            {["colegio", "universidad"].map((type) => (
              <button
                key={type}
                onClick={() => onUpdate({ schoolType: type as "colegio" | "universidad" })}
                className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                  data.schoolType === type ? "border-primary bg-primary/10" : "border-input hover:border-primary/50"
                }`}
              >
                {type === "colegio" ? "Colegio" : "Universidad"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tu nombre completo</label>
          <input
            type="text"
            placeholder="Ej: Sofía Martínez"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tu correo electrónico</label>
          <input
            type="email"
            placeholder="tu.email@ejemplo.com"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Nombre de tu {data.schoolType === "colegio" ? "colegio" : "universidad"}
          </label>
          <input
            type="text"
            placeholder={`Ej: ${data.schoolType === "colegio" ? "Colegio Andrés Bello" : "Universidad de los Andes"}`}
            value={data.schoolName}
            onChange={(e) => onUpdate({ schoolName: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Número de WhatsApp</label>
          <input
            type="tel"
            placeholder="+56 9 1234 5678"
            value={data.phoneNumber}
            onChange={(e) => onUpdate({ phoneNumber: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tu ubicación (ciudad y país)</label>
          <input
            type="text"
            placeholder="Ej: Santiago, Chile"
            value={data.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">¿En qué año estás?</label>
          <select
            value={data.currentYear}
            onChange={(e) => onUpdate({ currentYear: Number.parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {data.schoolType === "colegio"
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((year) => (
                  <option key={year} value={year}>
                    Año {year}
                  </option>
                ))
              : [1, 2, 3, 4, 5, 6].map((year) => (
                  <option key={year} value={year}>
                    Año {year}
                  </option>
                ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground"
          onClick={onNext}
          disabled={!data.schoolName || !data.name || !data.email || !data.phoneNumber || !data.location}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

function KnowledgeStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: {
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrevious: () => void
}) {
  const allAnswered = Object.values(data.openResponses).every((answer) => answer.trim().length > 0)

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Tu Visión Personal</h2>
      <p className="text-muted-foreground mb-6">Comparte tus respuestas para que la IA entienda qué te inspira</p>

      <div className="space-y-4">
        {OPEN_ENDED_QUESTIONS.map((question) => (
          <OpenEnded
            key={question.id}
            label={question.label}
            value={data.openResponses[question.id]}
            placeholder={question.placeholder}
            onChange={(value) =>
              onUpdate({
                openResponses: {
                  ...data.openResponses,
                  [question.id]: value,
                },
              })
            }
          />
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onPrevious}>
          Anterior
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground" onClick={onNext} disabled={!allAnswered}>
          Siguiente
        </Button>
      </div>
    </div>
  )
}

function PreferencesStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: {
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrevious: () => void
}) {
  const allAnswered = Object.values(data.preferenceResponses).every((answer) => answer.trim().length > 0)

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Tu Estilo Preferido</h2>
      <p className="text-muted-foreground mb-6">Selecciona la opción que mejor describa tu forma de aprender y trabajar</p>

      <div className="space-y-5">
        {PREFERENCE_QUESTIONS.map((question) => (
          <div key={question.id}>
            <label className="block text-sm font-medium mb-3">{question.question}</label>
            <MultipleChoice
              options={question.options}
              selected={data.preferenceResponses[question.id]}
              onSelect={(option) =>
                onUpdate({
                  preferenceResponses: {
                    ...data.preferenceResponses,
                    [question.id]: option,
                  },
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onPrevious}>
          Anterior
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground" onClick={onNext} disabled={!allAnswered}>
          Siguiente
        </Button>
      </div>
    </div>
  )
}

function UniversityPurposeStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: {
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrevious: () => void
}) {
  const allAnswered = Object.values(data.universityPurposeResponses).every((answer) => answer.trim().length > 0)

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Tu Visión Universitaria</h2>
      <p className="text-muted-foreground mb-6">
        Estas preguntas nos ayudan a entender mejor qué tipo de experiencia universitaria buscas
      </p>

      <div className="space-y-5">
        {UNIVERSITY_PURPOSE_QUESTIONS.map((question) => (
          <div key={question.id}>
            <label className="block text-sm font-medium mb-3">{question.question}</label>
            <MultipleChoice
              options={question.options}
              selected={data.universityPurposeResponses[question.id]}
              onSelect={(option) =>
                onUpdate({
                  universityPurposeResponses: {
                    ...data.universityPurposeResponses,
                    [question.id]: option,
                  },
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onPrevious}>
          Anterior
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground" onClick={onNext} disabled={!allAnswered}>
          Siguiente
        </Button>
      </div>
    </div>
  )
}

function GradesStep({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isAnalyzing,
}: {
  data: OnboardingData
  onUpdate: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  onPrevious: () => void
  isAnalyzing: boolean
}) {
  const [subject, setSubject] = useState("")
  const [grade, setGrade] = useState(5)

  const handleAddGrade = () => {
    if (subject.trim()) {
      const updatedGrades = [
        ...data.grades,
        {
          subject: subject.trim(),
          grade,
        },
      ]
      onUpdate({ grades: updatedGrades })
      setSubject("")
      setGrade(5)
    }
  }

  const handleRemoveGrade = (index: number) => {
    const updatedGrades = data.grades.filter((_, i) => i !== index)
    onUpdate({ grades: updatedGrades })
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Tus Notas</h2>
      <p className="text-muted-foreground mb-6">Agrega tus materias y calificaciones</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Materia</label>
          <input
            type="text"
            placeholder="Ej: Matemáticas, Inglés, Historia..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Calificación (0-10)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={grade}
            onChange={(e) => {
              const value = e.target.value
              if (value === '' || value === null) {
                setGrade(0)
              } else {
                const parsed = Number.parseFloat(value)
                setGrade(isNaN(parsed) ? 0 : parsed)
              }
            }}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button
          type="button"
          onClick={handleAddGrade}
          disabled={!subject.trim()}
          className="w-full bg-secondary text-secondary-foreground"
        >
          Agregar Materia
        </Button>
      </div>

      {data.grades.length > 0 && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-3">Materias agregadas:</h3>
          <div className="space-y-2">
            {data.grades.map((entry, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-background rounded">
                <span>
                  {entry.subject}: <span className="font-bold text-primary">{entry.grade}/10</span>
                </span>
                <button
                  onClick={() => handleRemoveGrade(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-8">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onPrevious} disabled={isAnalyzing}>
          Anterior
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground"
          onClick={onNext}
          disabled={data.grades.length === 0 || isAnalyzing}
        >
          {isAnalyzing ? "Analizando..." : "Siguiente"}
        </Button>
      </div>
    </div>
  )
}

function PathwaysStep({
  recommendedPathways,
  selectedPathways,
  onSelectPathway,
  onNext,
  onPrevious,
  userData,
}: {
  recommendedPathways: PathwayData[]
  selectedPathways: string[]
  onSelectPathway: (pathway: string) => void
  onNext: () => void
  onPrevious: () => void
  userData: OnboardingData
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedForDialog, setSelectedForDialog] = useState<PathwayData | null>(null)

  const handleExplorePathway = (pathway: PathwayData, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent pathway selection
    setSelectedForDialog(pathway)
    setDialogOpen(true)
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Tus Caminos Recomendados</h2>
      <p className="text-muted-foreground mb-6">Basado en tu perfil, aquí hay 3 caminos personalizados para ti</p>

      <div className="space-y-4 mb-6">
        {recommendedPathways.map((pathway) => (
          <div key={pathway.name} className="relative">
            <div className="flex gap-2">
              {/* Small button to select/check pathway */}
              <button
                onClick={() => onSelectPathway(pathway.name)}
                className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 transition-all flex items-center justify-center ${
                  selectedPathways.includes(pathway.name)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:border-primary/50"
                }`}
              >
                {selectedPathways.includes(pathway.name) ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 opacity-30" />
                )}
              </button>

              {/* Big button to explore pathway */}
              <button
                onClick={(e) => handleExplorePathway(pathway, e)}
                className="flex-1 p-4 text-left rounded-lg border-2 transition-all border-input hover:border-primary/50 hover:bg-primary/5"
              >
                <h3 className="font-bold text-foreground mb-1">{pathway.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{pathway.rationale}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-primary font-medium">{pathway.timeline}</p>
                  <span className="text-xs text-muted-foreground">Click para explorar con IA →</span>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onPrevious}>
          Anterior
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground"
          onClick={onNext}
          disabled={selectedPathways.length === 0}
        >
          Siguiente
        </Button>
      </div>

      {selectedForDialog && (
        <PathwayDetailDialog
          pathway={{
            title: selectedForDialog.name,
            description: selectedForDialog.rationale,
            icon: "Star",
            duration: selectedForDialog.timeline,
          }}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          userResponses={{
            openResponses: userData.openResponses,
            preferenceResponses: userData.preferenceResponses,
            selectedPathways: selectedPathways,
            schoolType: userData.schoolType,
            currentYear: userData.currentYear,
          }}
        />
      )}
    </div>
  )
}

function SelectionStep({
  selectedPathways,
  onAddCustomTrack,
  onNext,
  onPrevious,
}: {
  selectedPathways: string[]
  onAddCustomTrack: (track: string) => void
  onNext: () => void
  onPrevious: () => void
}) {
  const [customTrack, setCustomTrack] = useState("")

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-foreground mb-2">Personaliza Tu Plan</h2>
      <p className="text-muted-foreground mb-6">Agrega otros caminos que te inspiraron (opcional)</p>

      <div className="mb-6">
        <h3 className="font-medium mb-3">Caminos seleccionados:</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedPathways.map((pathway) => (
            <span key={pathway} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {pathway}
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">¿Hay otro camino que te inspire? (Opcional)</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ej: Emprendimiento, Ciencia de Datos..."
            value={customTrack}
            onChange={(e) => setCustomTrack(e.target.value)}
            className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button
            variant="outline"
            onClick={() => {
              if (customTrack.trim()) {
                onAddCustomTrack(customTrack)
                setCustomTrack("")
              }
            }}
            disabled={!customTrack.trim()}
          >
            Agregar
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onPrevious}>
          Anterior
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground" onClick={onNext} disabled={selectedPathways.length === 0}>
          Continuar
        </Button>
      </div>
    </div>
  )
}

function SummaryStep({
  data,
  selectedPathways,
  onComplete,
  onPrevious,
  isSaving,
}: {
  data: OnboardingData
  selectedPathways: string[]
  onComplete: () => void
  onPrevious: () => void
  isSaving: boolean
}) {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <Target className="h-16 w-16 text-primary mb-4 mx-auto" />
        <h2 className="text-3xl font-bold text-foreground mb-2">¡Tu Ruta Está Lista!</h2>
        <p className="text-muted-foreground">Estos son los caminos que elegiste para tu futuro</p>
      </div>

      <div className="mb-8 p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Rocket className="h-6 w-6" />
          Tus Caminos Seleccionados
        </h3>
        <div className="space-y-3">
          {selectedPathways.map((pathway, index) => (
            <div key={pathway} className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold text-sm">
                {index + 1}
              </div>
              <span className="font-medium text-foreground">{pathway}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-2">📋 Resumen de tu perfil:</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• {data.schoolType === "colegio" ? "Colegio" : "Universidad"}: {data.schoolName}</li>
          <li>• Año {data.currentYear}</li>
          <li>• {selectedPathways.length} caminos seleccionados</li>
        </ul>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-900 dark:text-blue-100 flex items-start gap-2">
          <Lightbulb className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span><strong>Próximos pasos:</strong> Vamos a crear un plan de acción personalizado para cada uno de tus caminos con oportunidades, recursos y recordatorios.</span>
        </p>
      </div>

      <div className="flex gap-4 mt-8">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={onPrevious}>
          Anterior
        </Button>
        <Button className="flex-1 bg-primary text-primary-foreground text-lg py-6 gap-2" onClick={onComplete} disabled={isSaving}>
          {isSaving ? "Guardando..." : (
            <>
              <Target className="h-5 w-5" />
              <span>Comenzar Mi Ruta</span>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
