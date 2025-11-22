// Import the users store from register route
import { users } from "../register/route"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return Response.json({ success: false, error: "Email and password required" }, { status: 400 })
    }

    const user = users.get(email)

    if (!user || user.password !== password) {
      return Response.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }

    return Response.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      token: user.id,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      },
      { status: 500 },
    )
  }
}
