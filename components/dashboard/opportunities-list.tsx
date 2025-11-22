import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const MOCK_OPPORTUNITIES = {
  internships: [
    {
      id: 1,
      title: "Summer Internship - Tech Startup",
      company: "StartupXYZ",
      duration: "3 months",
      location: "Remote",
    },
    {
      id: 2,
      title: "Product Management Internship",
      company: "TechCorp",
      duration: "6 months",
      location: "Hybrid",
    },
  ],
  courses: [
    {
      id: 1,
      title: "Advanced Web Development",
      provider: "Coursera",
      duration: "8 weeks",
      level: "Intermediate",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      provider: "DataCamp",
      duration: "6 weeks",
      level: "Beginner",
    },
  ],
  studyPlans: [
    {
      id: 1,
      title: "Full Stack Developer Roadmap",
      duration: "6 months",
      topics: "Frontend, Backend, Databases",
    },
    {
      id: 2,
      title: "Product Manager Track",
      duration: "3 months",
      topics: "Strategy, Analytics, Design",
    },
  ],
  summerCamps: [
    {
      id: 1,
      title: "Leadership Summit 2024",
      dates: "July - August",
      location: "Mexico City",
    },
    {
      id: 2,
      title: "AI & Innovation Camp",
      dates: "June - July",
      location: "Online",
    },
  ],
}

export default function OpportunitiesList() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Available Opportunities</h2>

      <Tabs defaultValue="internships" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="internships">Internships</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="studyPlans">Study Plans</TabsTrigger>
          <TabsTrigger value="summerCamps">Summer Camps</TabsTrigger>
        </TabsList>

        <TabsContent value="internships" className="space-y-3">
          {MOCK_OPPORTUNITIES.internships.map((item) => (
            <Card key={item.id} className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.company} • {item.duration} • {item.location}
              </p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="courses" className="space-y-3">
          {MOCK_OPPORTUNITIES.courses.map((item) => (
            <Card key={item.id} className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.provider} • {item.level} • {item.duration}
              </p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="studyPlans" className="space-y-3">
          {MOCK_OPPORTUNITIES.studyPlans.map((item) => (
            <Card key={item.id} className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.duration} • {item.topics}
              </p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="summerCamps" className="space-y-3">
          {MOCK_OPPORTUNITIES.summerCamps.map((item) => (
            <Card key={item.id} className="p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.dates} • {item.location}
              </p>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
