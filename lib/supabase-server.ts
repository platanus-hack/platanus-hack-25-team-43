import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("⚠️  CRITICAL: Missing Supabase Environment Variables (Server)")
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("\n🔴 Required environment variables:")
    console.error("   Missing:", !url ? "NEXT_PUBLIC_SUPABASE_URL" : "", !anonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : "")
    console.error("\n📖 See SETUP.md for configuration instructions.")
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    throw new Error("Missing Supabase environment variables. Check console for details.")
  }

  // Get the auth token from cookies
  const cookieStore = await cookies()
  const authToken = cookieStore.get("platanus-hack-session-access-token")?.value

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {},
    },
  })

  return supabase
}

