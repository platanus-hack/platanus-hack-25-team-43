"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getReminders, scheduleReminders } from "@/lib/reminders-client"

interface RemindersSectionProps {
  phoneNumber?: string
  actionPlan?: any
}

export default function RemindersSection({ phoneNumber, actionPlan }: RemindersSectionProps) {
  const [reminders, setReminders] = useState<any[]>([])
  const [inputPhoneNumber, setInputPhoneNumber] = useState(phoneNumber || "")
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(!phoneNumber)

  useEffect(() => {
    if (phoneNumber) {
      loadReminders(phoneNumber)
    }
  }, [phoneNumber])

  const loadReminders = async (phone: string) => {
    setIsLoading(true)
    try {
      const result = await getReminders(phone)
      setReminders(result.reminders)
    } catch (error) {
      console.error("[v0] Error loading reminders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnableReminders = async () => {
    if (!inputPhoneNumber || !actionPlan) return

    setIsLoading(true)
    try {
      await scheduleReminders(inputPhoneNumber, actionPlan)
      await loadReminders(inputPhoneNumber)
      setShowForm(false)
    } catch (error) {
      console.error("[v0] Error enabling reminders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">WhatsApp Reminders</h3>
        {!showForm && phoneNumber && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            Update
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Get weekly WhatsApp reminders to stay on track with your action plan
          </p>
          <div className="flex gap-2">
            <input
              type="tel"
              value={inputPhoneNumber}
              onChange={(e) => setInputPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleEnableReminders}
              disabled={!inputPhoneNumber || !actionPlan || isLoading}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isLoading ? "Setting up..." : "Enable"}
            </Button>
          </div>
        </div>
      ) : reminders.length > 0 ? (
        <div className="space-y-3">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">✓ Reminders enabled for {inputPhoneNumber || phoneNumber}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Upcoming Reminders:</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {reminders
                .filter((r) => !r.sent)
                .slice(0, 5)
                .map((reminder) => (
                  <div key={reminder.id} className="p-2 bg-muted rounded text-xs">
                    <p className="font-medium">Week {reminder.weekNumber}</p>
                    <p className="text-muted-foreground truncate">{reminder.message}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {new Date(reminder.scheduledFor).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">No reminders scheduled yet</p>
        </div>
      )}
    </Card>
  )
}
