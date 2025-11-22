"use client"

interface OpenEndedProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function OpenEnded({ label, value, onChange }: OpenEndedProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer..."
        rows={3}
        className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
      />
    </div>
  )
}
