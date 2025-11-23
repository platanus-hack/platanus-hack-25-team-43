import { getSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function getAuthenticatedUser() {
  try {
    const supabase = await getSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return { user: null, error: "Unauthorized" }
    }

    return { user, error: null }
  } catch (error) {
    console.error("[auth-middleware] Error getting authenticated user:", error)
    return { user: null, error: "Authentication failed" }
  }
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  )
}

export async function requireAuth(_request: Request) {
  const { user, error } = await getAuthenticatedUser()
  
  if (!user) {
    return { authorized: false, response: unauthorizedResponse(error || "Unauthorized"), user: null }
  }
  
  return { authorized: true, response: null, user }
}

