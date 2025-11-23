"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { loginUser, registerUser, resendConfirmationEmail } from "@/lib/auth-client"

interface AuthPageProps {
  onAuthSuccess: () => void
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showResendConfirmation, setShowResendConfirmation] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setShowResendConfirmation(false)
    setIsLoading(true)

    try {
      if (isLogin) {
        await loginUser(email, password)
      } else {
        // Validar password mínimo
        if (password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres")
        }
        await registerUser(email, password, name)
      }
      onAuthSuccess()
    } catch (err) {
      // Mejorar mensajes de error
      const errorMessage = err instanceof Error ? err.message : "Error de autenticación"
      
      // Traducir errores comunes de Supabase
      if (errorMessage.includes("Invalid login credentials")) {
        setError("Email o contraseña incorrectos. Verifica tus credenciales e intenta de nuevo.")
      } else if (errorMessage.includes("Email not confirmed")) {
        setError("Tu email aún no ha sido confirmado. Por favor, revisa tu bandeja de entrada y haz clic en el enlace de confirmación.")
        setShowResendConfirmation(true)
      } else if (errorMessage.includes("User already registered")) {
        setError("Este email ya está registrado. Intenta iniciar sesión.")
      } else if (errorMessage.includes("Password should be at least")) {
        setError("La contraseña debe tener al menos 6 caracteres")
      } else if (errorMessage.includes("Unable to validate email")) {
        setError("Email inválido. Verifica que esté escrito correctamente.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    setIsLoading(true)
    setError("")
    setSuccessMessage("")

    try {
      await resendConfirmationEmail(email)
      setSuccessMessage("Email de confirmación enviado. Por favor, revisa tu bandeja de entrada.")
      setShowResendConfirmation(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al enviar el email"
      setError(`No se pudo reenviar el email de confirmación: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Mi Ruta de Éxito</h1>
            <p className="text-muted-foreground">Guía de carreras para estudiantes ambiciosos de Latam</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.email@ejemplo.com"
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">{successMessage}</div>
            )}

            {showResendConfirmation && (
              <Button
                type="button"
                onClick={handleResendConfirmation}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                Reenviar Email de Confirmación
              </Button>
            )}

            <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={isLoading}>
              {isLoading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
              }}
              className="text-sm text-primary hover:underline font-medium"
            >
              {isLogin ? "Crear Cuenta" : "Iniciar Sesión"}
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
