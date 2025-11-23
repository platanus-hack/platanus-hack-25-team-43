/**
 * Environment variable validation utility
 * Validates required environment variables on app startup
 */

export interface EnvValidationResult {
  isValid: boolean
  missingVars: string[]
  warnings: string[]
}

/**
 * Validates all required environment variables for the application
 * @returns EnvValidationResult with validation status and missing variables
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const missingVars: string[] = []
  const warnings: string[] = []

  // Check Supabase configuration (required for all functionality)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missingVars.push("NEXT_PUBLIC_SUPABASE_URL")
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    missingVars.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  // Check Anthropic API key (required for AI analysis)
  // Note: This is only checked server-side in API routes
  if (typeof window === 'undefined' && !process.env.ANTHROPIC_API_KEY) {
    warnings.push("ANTHROPIC_API_KEY is not set - AI pathway analysis will not work")
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    warnings,
  }
}

/**
 * Logs validation results to console with helpful formatting
 */
export function logEnvValidation(result: EnvValidationResult) {
  if (result.isValid && result.warnings.length === 0) {
    console.warn("✅ All required environment variables are configured")
    return
  }

  if (!result.isValid) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("⚠️  CRITICAL: Missing Required Environment Variables")
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("\n🔴 Missing variables:")
    result.missingVars.forEach(varName => {
      console.error(`   - ${varName}`)
    })
    console.error("\n📝 To fix this:")
    console.error("   1. Create a .env.local file in your project root")
    console.error("   2. Add the following variables:")
    console.error("\n      NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url")
    console.error("      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key")
    console.error("      ANTHROPIC_API_KEY=your_anthropic_api_key")
    console.error("\n   3. Restart your development server")
    console.error("\n📖 See SETUP.md for detailed instructions.")
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
  }

  if (result.warnings.length > 0) {
    console.warn("\n⚠️  Environment Warnings:")
    result.warnings.forEach(warning => {
      console.warn(`   - ${warning}`)
    })
    console.warn("")
  }
}

/**
 * Browser-safe environment check that shows user-friendly error
 */
export function checkClientEnvironment(): boolean {
  const result = validateEnvironmentVariables()
  
  if (process.env.NODE_ENV === "development") {
    logEnvValidation(result)
  }
  
  return result.isValid
}

/**
 * Server-side environment check with detailed logging
 */
export function checkServerEnvironment(): boolean {
  const result = validateEnvironmentVariables()
  logEnvValidation(result)
  return result.isValid
}


