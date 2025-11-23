/**
 * @file lib/supabase-client.ts
 * @description Supabase client initialization for browser and server
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Environment variables not found. Supabase features will be disabled.')
}

/**
 * Browser client for Supabase
 * Use this in client components
 */
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Server client for Supabase
 * Use this in API routes and server components
 */
export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('[Supabase] Environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}


