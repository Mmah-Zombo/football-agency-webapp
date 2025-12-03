import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { players } from "@/lib/data"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function PlayersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Players" description="Manage your represented football players">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Player
          </Button>
        </PageHeader>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search players by name, position, or club..." className="pl-10" />
          </div>

          {/* Players Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <Card key={player.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={player.image || "/placeholder.svg"}
                        alt={player.name}
                        className="h-20 w-20 rounded-full object-cover border-4 border-card bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-card-foreground truncate">{player.name}</h3>
                        <p className="text-sm text-muted-foreground">{player.position}</p>
                        <Badge
                          variant={
                            player.status === "Under Contract"
                              ? "default"
                              : player.status === "Available"
                                ? "secondary"
                                : "destructive"
                          }
                          className="mt-2"
                        >
                          {player.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Age</span>
                      <span className="font-medium text-card-foreground">{player.age} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nationality</span>
                      <span className="font-medium text-card-foreground">{player.nationality}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Club</span>
                      <span className="font-medium text-card-foreground">{player.currentClub}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Market Value</span>
                      <span className="font-bold text-primary">{player.marketValue}</span>
                    </div>
                    <div className="pt-3 border-t border-border flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        View Profile
                      </Button>
                      <Button size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
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
