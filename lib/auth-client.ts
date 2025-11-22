export async function registerUser(email: string, password: string, name: string) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      throw new Error("Registration failed")
    }

    const result = await response.json()
    if (result.success) {
      localStorage.setItem("userToken", result.token)
      localStorage.setItem("userEmail", email)
    }
    return result
  } catch (error) {
    console.error("[v0] Registration error:", error)
    throw error
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const result = await response.json()
    if (result.success) {
      localStorage.setItem("userToken", result.token)
      localStorage.setItem("userEmail", email)
    }
    return result
  } catch (error) {
    console.error("[v0] Login error:", error)
    throw error
  }
}

export function logoutUser() {
  localStorage.removeItem("userToken")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("onboardingComplete")
  localStorage.removeItem("onboardingData")
  localStorage.removeItem("actionPlan")
}

export function getCurrentUser() {
  const token = localStorage.getItem("userToken")
  const email = localStorage.getItem("userEmail")
  return token && email ? { token, email } : null
}
