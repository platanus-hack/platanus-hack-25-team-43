"use client"

interface MultipleChoiceProps {
  options: string[]
  selected?: string
  onSelect: (option: string) => void
}

export default function MultipleChoice({ options, selected, onSelect }: MultipleChoiceProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
            selected === option ? "border-primary bg-primary/10" : "border-input hover:border-primary/50"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
