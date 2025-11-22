"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ReportUploadProps {
  onFileSelect: (file: File) => void
  currentFile?: File
}

export default function ReportUpload({ onFileSelect, currentFile }: ReportUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onFileSelect(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/30"
      }`}
    >
      <input
        type="file"
        id="reportUpload"
        onChange={handleFileInput}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
        className="hidden"
      />

      {currentFile ? (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">✓ {currentFile.name}</p>
          <Button variant="outline" size="sm" onClick={() => document.getElementById("reportUpload")?.click()}>
            Change File
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-foreground font-medium mb-1">Drag and drop your file here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
          <Button onClick={() => document.getElementById("reportUpload")?.click()}>Select File</Button>
          <p className="text-xs text-muted-foreground mt-4">Supported: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</p>
        </div>
      )}
    </div>
  )
}
