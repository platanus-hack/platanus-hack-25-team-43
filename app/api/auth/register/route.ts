// In-memory user store (for development only - use a database in production!)
const users = new Map<string, { id: string; email: string; password: string; name: string; createdAt: string }>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password || !name) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    if (users.has(email)) {
      return Response.json({ success: false, error: "User already exists" }, { status: 400 })
    }

    const userId = Math.random().toString(36).substr(2, 9)
    users.set(email, {
      id: userId,
      email,
      password, // In production, hash this!
      name,
      createdAt: new Date().toISOString(),
    })

    return Response.json({
      success: true,
      user: { id: userId, email, name },
      token: userId,
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      },
      { status: 500 },
    )
  }
}

// Export the users store so login can access it
export { users }
