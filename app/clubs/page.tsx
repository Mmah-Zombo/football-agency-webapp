import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { clubs } from "@/lib/data"
import { Plus, MapPin, Trophy } from "lucide-react"

export default function ClubsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Clubs" description="Partner clubs and organizations">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Club
          </Button>
        </PageHeader>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={club.logo || "/placeholder.svg"}
                      alt={club.name}
                      className="h-16 w-16 rounded-lg object-cover bg-muted"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-card-foreground">{club.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {club.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-4 w-4 text-primary" />
                    <Badge variant="outline">{club.league}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{club.playersManaged}</p>
                      <p className="text-xs text-muted-foreground">Players Managed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-card-foreground">{club.activeContracts}</p>
                      <p className="text-xs text-muted-foreground">Active Contracts</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
