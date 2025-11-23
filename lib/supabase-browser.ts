import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let supabaseClient: SupabaseClient | null = null

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === "development") {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
      console.error("⚠️  CRITICAL: Missing Supabase Environment Variables")
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
      console.error("\n🔴 Please create a .env.local file in your project root with:")
      console.error("\n   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url")
      console.error("   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key")
      console.error("   ANTHROPIC_API_KEY=your_anthropic_api_key")
      console.error("\n📖 See SETUP.md for detailed instructions.")
      console.error("\n⚠️  The app will not work without these variables!")
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    }
    return null
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: "platanus-hack-session",
        autoRefreshToken: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
  }

  return supabaseClient
}

// Helper to check if user is authenticated
export async function isAuthenticated() {
  const client = getSupabaseBrowserClient()
  if (!client) return false
  
  const { data: { session } } = await client.auth.getSession()
  return !!session
}

