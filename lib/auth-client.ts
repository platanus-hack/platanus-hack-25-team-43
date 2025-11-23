import { getSupabaseBrowserClient } from "@/lib/supabase-browser"

export async function registerUser(email: string, password: string, name: string) {
  const supabase = getSupabaseBrowserClient()

  if (!supabase) {
    throw new Error("Supabase client not initialized. Check your environment variables.")
  }

  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error("Registration failed: No user returned")
    }

    return { 
      success: true, 
      user: data.user, 
      session: data.session,
      needsConfirmation: !data.session // true if email confirmation is required
    }
  } catch (error) {
    console.error("[auth] Registration error:", error)
    throw error
  }
}

export async function loginUser(email: string, password: string) {
  const supabase = getSupabaseBrowserClient()

  if (!supabase) {
    throw new Error("Supabase client not initialized. Check your environment variables.")
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })
    
    if (error) {
      throw new Error(error.message)
    }

    if (!data.session) {
      throw new Error("Login failed: No session created")
    }

    return { success: true, user: data.user, session: data.session }
  } catch (error) {
    console.error("[auth] Login error:", error)
    throw error
  }
}

export async function resendConfirmationEmail(email: string) {
  const supabase = getSupabaseBrowserClient()

  if (!supabase) {
    throw new Error("Supabase client not initialized. Check your environment variables.")
  }

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  } catch (error) {
    console.error("[auth] Resend confirmation error:", error)
    throw error
  }
}

export async function logoutUser() {
  const supabase = getSupabaseBrowserClient()
  
  if (!supabase) {
    console.warn("[auth] Supabase client not initialized")
    return
  }

  try {
    await supabase.auth.signOut()
    
    // Clear ALL local storage related to user data
    localStorage.removeItem("onboardingComplete")
    localStorage.removeItem("onboardingData")
    localStorage.removeItem("actionPlan")
    localStorage.removeItem("onboardingCompletedDate")
    localStorage.removeItem("userName")
    localStorage.removeItem("whatsappPhoneNumber")
    localStorage.removeItem("onboardingDismissed")
    
    // Clear any other potential user-specific data
    localStorage.clear()
  } catch (error) {
    console.error("[auth] Logout error:", error)
    throw error
  }
}

export async function getCurrentUser() {
  const supabase = getSupabaseBrowserClient()
  
  if (!supabase) {
    return null
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      // Suprimir "Auth session missing" - es normal cuando no hay sesión
      if (error.message !== "Auth session missing!") {
        console.error("[auth] Get user error:", error)
      }
      return null
    }
    
    return user
  } catch (error) {
    // Suprimir errores de sesión faltante en development
    const isSessionMissing = error instanceof Error && error.message === "Auth session missing!"
    if (!isSessionMissing) {
      console.error("[auth] Get user error:", error)
    }
    return null
  }
}

export async function getSession() {
  const supabase = getSupabaseBrowserClient()
  
  if (!supabase) {
    return null
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      // Suprimir "Auth session missing" - es normal cuando no hay sesión
      if (error.message !== "Auth session missing!") {
        console.error("[auth] Get session error:", error)
      }
      return null
    }
    
    return session
  } catch (error) {
    // Suprimir errores de sesión faltante en development
    const isSessionMissing = error instanceof Error && error.message === "Auth session missing!"
    if (!isSessionMissing) {
      console.error("[auth] Get session error:", error)
    }
    return null
  }
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = getSupabaseBrowserClient()
  
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } }
  }

  return supabase.auth.onAuthStateChange(callback)
}
