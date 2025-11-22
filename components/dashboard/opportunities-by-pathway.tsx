"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const OPPORTUNITIES_BY_PATHWAY = {
  "Desarrollo Tecnológico": {
    internships: [
      { id: 1, title: "Frontend Developer Internship", company: "Tech Startup", duration: "3 months" },
      { id: 2, title: "Full Stack Internship", company: "TechCorp", duration: "6 months" },
    ],
    courses: [
      { id: 1, title: "React Advanced", provider: "Udemy", duration: "8 weeks" },
      { id: 2, title: "Node.js Backend", provider: "Coursera", duration: "6 weeks" },
    ],
    studyPlans: [
      { id: 1, title: "Full Stack Developer", duration: "6 months" },
      { id: 2, title: "Web Development Roadmap", duration: "3 months" },
    ],
    summerCamps: [
      { id: 1, title: "Tech Summit 2025", dates: "July-August", location: "Online" },
      { id: 2, title: "Code Bootcamp", dates: "June-July", location: "Mexico City" },
    ],
  },
  Emprendimiento: {
    internships: [{ id: 1, title: "Startup Operations", company: "LaunchPad", duration: "3 months" }],
    courses: [
      { id: 1, title: "Lean Startup Methodology", provider: "Coursera", duration: "4 weeks" },
      { id: 2, title: "Business Model Canvas", provider: "Udemy", duration: "3 weeks" },
    ],
    studyPlans: [{ id: 1, title: "Entrepreneurship Essentials", duration: "3 months" }],
    summerCamps: [
      { id: 1, title: "Startup Bootcamp LATAM", dates: "July-August", location: "Colombia" },
      { id: 2, title: "Innovation Challenge", dates: "June-July", location: "Remote" },
    ],
  },
  "Gestión & Negocios": {
    internships: [
      { id: 1, title: "Business Analyst", company: "Consulting Firm", duration: "6 months" },
      { id: 2, title: "Project Management", company: "Fortune 500", duration: "3 months" },
    ],
    courses: [
      { id: 1, title: "Project Management Professional", provider: "LinkedIn Learning", duration: "8 weeks" },
      { id: 2, title: "Business Analytics", provider: "DataCamp", duration: "6 weeks" },
    ],
    studyPlans: [
      { id: 1, title: "MBA Preparation", duration: "6 months" },
      { id: 2, title: "Leadership Development", duration: "3 months" },
    ],
    summerCamps: [{ id: 1, title: "Leadership Summit", dates: "July-August", location: "Buenos Aires" }],
  },
}

export default function OpportunitiesByPathway() {
  const pathwayNames = Object.keys(OPPORTUNITIES_BY_PATHWAY)

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Oportunidades por Camino</h2>

      <Tabs defaultValue={pathwayNames[0]} className="w-full">
        <TabsList className="grid w-full gap-2" style={{ gridTemplateColumns: `repeat(${pathwayNames.length}, 1fr)` }}>
          {pathwayNames.map((pathway) => (
            <TabsTrigger key={pathway} value={pathway} className="text-xs sm:text-sm">
              {pathway}
            </TabsTrigger>
          ))}
        </TabsList>

        {pathwayNames.map((pathwayName) => {
          const opportunities = OPPORTUNITIES_BY_PATHWAY[pathwayName as keyof typeof OPPORTUNITIES_BY_PATHWAY]

          return (
            <TabsContent key={pathwayName} value={pathwayName} className="space-y-6">
              {/* Internships */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Prácticas Profesionales</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {opportunities.internships.map((item) => (
                    <Card key={item.id} className="p-4">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.company} • {item.duration}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Courses */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Cursos</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {opportunities.courses.map((item) => (
                    <Card key={item.id} className="p-4">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.provider} • {item.duration}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Study Plans */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Planes de Estudio</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {opportunities.studyPlans.map((item) => (
                    <Card key={item.id} className="p-4">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.duration}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Summer Camps */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Campamentos de Verano</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {opportunities.summerCamps.map((item) => (
                    <Card key={item.id} className="p-4">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.dates} • {item.location}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
