// app/matches/[id]/page.tsx
import { notFound } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Users, Clock, Edit, Trophy } from "lucide-react"

import { getMatchById } from "@/lib/server/matches-excel.server"
import { getPlayers, type Player } from "@/lib/server/players-excel.server"
import { getClubs, type Club } from "@/lib/server/clubs-excel.server"

interface MatchDetailsPageProps {
  params: { id: string }
}

export default async function MatchDetailsPage({ params }: MatchDetailsPageProps) {
  const { id } = await params
  const match = await getMatchById(Number.parseInt(id))

  if (!match) {
    notFound()
  }

  const [players, clubs] = await Promise.all([
    getPlayers(),
    getClubs(),
  ])

  const involvedPlayers = players.filter((p) => match.managedPlayers.includes(p.name))

  // Find club objects for home and away teams
  const homeClub = clubs.find((c) => c.name === match.homeTeam)
  const awayClub = clubs.find((c) => c.name === match.awayTeam)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-chart-3 text-chart-3-foreground"
      case "In Progress":
        return "bg-chart-1 text-white"
      case "Completed":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Match Details" description="View upcoming match information">
          <div className="flex gap-2">
            <Link href="/matches">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Matches
              </Button>
            </Link>
            <Link href={`/matches/${match.id}/edit`}>
              <Button className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Match
              </Button>
            </Link>
          </div>
        </PageHeader>

        <div className="p-6 space-y-6">
          {/* Match Overview Card */}
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">
                <Badge className={`${getStatusColor(match.status)} text-sm px-4 py-1`}>
                  {match.status}
                </Badge>
              </div>
              <CardTitle className="text-3xl">
                {match.homeTeam} vs {match.awayTeam}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-8">
                <div className="flex items-center justify-center gap-12 w-full max-w-3xl">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-4 flex-1">
                    <div className="relative">
                      <img
                        src={homeClub?.logo ? `${homeClub.logo}` : "/placeholder.svg?height=120&width=120&text=Club+Logo"}
                        alt={match.homeTeam}
                        className="h-32 w-32 rounded-xl object-cover border-4 border-border bg-muted shadow-lg"
                      />
                    </div>
                    <span className="text-2xl font-bold text-center">{match.homeTeam}</span>
                    <Badge variant="outline" className="text-sm">Home</Badge>
                  </div>

                  {/* VS */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-5xl font-black text-muted-foreground">VS</div>
                    {match.result && (
                      <div className="text-4xl font-bold text-primary">{match.result}</div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-4 flex-1">
                    <div className="relative">
                      <img
                        src={awayClub?.logo ? `${awayClub.logo}` : "/placeholder.svg?height=120&width=120&text=Club+Logo"}
                        alt={match.awayTeam}
                        className="h-32 w-32 rounded-xl object-cover border-4 border-border bg-muted shadow-lg"
                      />
                    </div>
                    <span className="text-2xl font-bold text-center">{match.awayTeam}</span>
                    <Badge variant="outline" className="text-sm">Away</Badge>
                  </div>
                </div>
              </div>

              {/* Match Info */}
              <div className="grid gap-4 md:grid-cols-3 pt-8 border-t border-border">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{match.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{match.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="font-medium">{match.venue}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managed Players */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Managed Players in this Match ({involvedPlayers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {involvedPlayers.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {involvedPlayers.map((player) => (
                    <Link key={player.id} href={`/players/${player.id}`}>
                      <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                        <img
                          src={player.image ? `/uploads/players/${player.image}` : "/placeholder.svg?height=48&width=48&text=Player"}
                          alt={player.name}
                          className="h-12 w-12 rounded-full object-cover border-2 border-border"
                        />
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {player.position} • {player.currentClub}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No managed players involved in this match.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pre-Match Notes */}
          {match.status === "Upcoming" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-chart-3" />
                  Pre-Match Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
                    <p className="text-sm text-muted-foreground mb-2">Key Points to Watch</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Monitor player performance for upcoming contract negotiations</li>
                      <li>Track minutes played and overall fitness</li>
                      <li>Note any standout performances for media highlights</li>
                      <li>Assess player chemistry with teammates</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Detailed match report will be available after the match is completed.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}