export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pathways } = body

    // Mock opportunities database - in production, this would query your real database
    const opportunitiesDatabase = {
      "Software Engineering": [
        {
          id: "1",
          type: "internship",
          title: "Summer Internship - Backend Development",
          description: "Join a growing tech startup in Mexico City working on scalable backend systems",
          provider: "TechStartup LATAM",
          duration: "3 months",
          location: "Remote/Mexico City",
        },
        {
          id: "2",
          type: "course",
          title: "Advanced Node.js & TypeScript",
          description: "Master modern backend development with Node.js, TypeScript, and PostgreSQL",
          provider: "Coursera",
          duration: "8 weeks",
          level: "Intermediate",
        },
        {
          id: "3",
          type: "study_plan",
          title: "Full Stack Developer Roadmap",
          description: "6-month comprehensive program covering frontend, backend, databases, and DevOps",
          provider: "Self-paced",
          duration: "6 months",
        },
      ],
      "Product Management": [
        {
          id: "4",
          type: "internship",
          title: "Product Management Internship",
          description: "Work with experienced PMs at a Series B startup building products for LATAM",
          provider: "InnovateCo",
          duration: "6 months",
          location: "Hybrid - Buenos Aires",
        },
        {
          id: "5",
          type: "course",
          title: "Product Management Fundamentals",
          description: "Learn product strategy, user research, and roadmap planning",
          provider: "Reforge",
          duration: "4 weeks",
          level: "Beginner",
        },
        {
          id: "6",
          type: "summer_camp",
          title: "Product Leader Summit",
          description: "Network with product leaders and learn from industry experts",
          provider: "Product School",
          duration: "1 week",
          location: "Online",
        },
      ],
      "UX/UI Design": [
        {
          id: "7",
          type: "internship",
          title: "Design Internship - Design Systems",
          description: "Build design systems and components for a growing fintech platform",
          provider: "FinTechXYZ",
          duration: "4 months",
          location: "Remote",
        },
        {
          id: "8",
          type: "course",
          title: "Interaction Design & Prototyping",
          description: "Master Figma, prototyping, and user-centered design principles",
          provider: "DesignLab",
          duration: "10 weeks",
          level: "Beginner",
        },
        {
          id: "9",
          type: "study_plan",
          title: "UX Design Career Path",
          description: "Comprehensive guide to becoming a professional UX designer",
          provider: "Nielsen Norman Group",
          duration: "3 months",
        },
      ],
      "Data Science": [
        {
          id: "10",
          type: "internship",
          title: "Data Science Internship - ML Engineering",
          description: "Work on machine learning projects in production environments",
          provider: "DataCorp LATAM",
          duration: "6 months",
          location: "São Paulo - Remote",
        },
        {
          id: "11",
          type: "course",
          title: "Machine Learning Specialization",
          description: "Deep dive into ML algorithms, deep learning, and MLOps",
          provider: "Coursera",
          duration: "12 weeks",
          level: "Intermediate",
        },
        {
          id: "12",
          type: "study_plan",
          title: "Data Science 100 Days Challenge",
          description: "Intensive daily learning program with real-world projects",
          provider: "DataCamp",
          duration: "100 days",
        },
      ],
      "Startup Founder": [
        {
          id: "13",
          type: "internship",
          title: "Founder Immersion - Startup Accelerator",
          description: "Fast-track program for aspiring entrepreneurs with mentorship",
          provider: "Startup Academy LATAM",
          duration: "3 months",
          location: "Hybrid - Colombia",
        },
        {
          id: "14",
          type: "course",
          title: "How to Start a Startup",
          description: "Learn fundraising, product-market fit, and scaling strategies",
          provider: "Y Combinator",
          duration: "6 weeks",
          level: "Beginner",
        },
        {
          id: "15",
          type: "summer_camp",
          title: "Founder Bootcamp 2024",
          description: "Intensive summer program with investor pitch preparation",
          provider: "FounderInstitute",
          duration: "8 weeks",
          location: "Mexico City",
        },
      ],
      "Business Strategy": [
        {
          id: "16",
          type: "course",
          title: "Strategic Planning & Business Execution",
          description: "Learn frameworks used by top consultants at McKinsey and Bain",
          provider: "MasterClass",
          duration: "8 weeks",
          level: "Intermediate",
        },
        {
          id: "17",
          type: "internship",
          title: "Management Consulting Internship",
          description: "Work on strategic projects with multinational companies",
          provider: "ConsultingCorp",
          duration: "6 months",
          location: "Hybrid - Santiago",
        },
        {
          id: "18",
          type: "study_plan",
          title: "MBA Preparation Program",
          description: "Prepare for MBA applications and business leadership",
          provider: "Self-curated",
          duration: "4 months",
        },
      ],
    }

    // Collect opportunities for selected pathways
    const opportunities: any[] = []
    pathways.forEach((pathway: string) => {
      const pathwayOps = opportunitiesDatabase[pathway as keyof typeof opportunitiesDatabase] || []
      opportunities.push(...pathwayOps)
    })

    return Response.json({
      success: true,
      opportunities,
    })
  } catch (error) {
    console.error("[v0] Error fetching opportunities:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch opportunities",
      },
      { status: 500 },
    )
  }
}
