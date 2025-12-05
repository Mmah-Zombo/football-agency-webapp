"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getMatchById } from "@/lib/matches-store"
import { getPlayers } from "@/lib/players-store"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Target,
  Timer,
  Star,
  TrendingUp,
  FileText,
  Download,
} from "lucide-react"

export default function MatchReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const match = getMatchById(Number(id))

  if (!match || match.status !== "Completed") {
    notFound()
  }

  const players = getPlayers()
  const involvedPlayers = players.filter((p) => match.managedPlayers.includes(p.name))

  // Parse result
  const resultParts = match.result?.split("-") || ["0", "0"]
  const homeScore = Number.parseInt(resultParts[0]) || 0
  const awayScore = Number.parseInt(resultParts[1]) || 0

  // Generate mock player stats for the report
  const generatePlayerStats = (playerName: string) => ({
    name: playerName,
    minutesPlayed: Math.floor(Math.random() * 30) + 60,
    rating: (Math.random() * 2 + 6).toFixed(1),
    passes: Math.floor(Math.random() * 40) + 20,
    passAccuracy: Math.floor(Math.random() * 20) + 75,
    shots: Math.floor(Math.random() * 5),
    tackles: Math.floor(Math.random() * 6),
    duelsWon: Math.floor(Math.random() * 10) + 3,
  })

  const playerStats = involvedPlayers.map((p) => ({
    ...p,
    stats: generatePlayerStats(p.name),
  }))

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Match Report" description="Detailed analysis and player performance">
          <div className="flex gap-2">
            <Link href="/matches">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Matches
              </Button>
            </Link>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </PageHeader>

        <div className="p-6 space-y-6">
          {/* Match Result Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
            <CardContent className="py-8">
              <div className="flex flex-col items-center">
                <Badge variant="outline" className="mb-4 gap-2">
                  <Calendar className="h-3 w-3" />
                  {match.date}
                </Badge>

                <div className="flex items-center justify-center gap-8 w-full max-w-3xl">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-xl font-bold text-center">{match.homeTeam}</span>
                    <span
                      className={`text-5xl font-black ${homeScore > awayScore ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {homeScore}
                    </span>
                    {homeScore > awayScore && <Badge className="bg-primary text-primary-foreground">Winner</Badge>}
                  </div>

                  {/* Separator */}
                  <div className="text-3xl font-bold text-muted-foreground">-</div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-xl font-bold text-center">{match.awayTeam}</span>
                    <span
                      className={`text-5xl font-black ${awayScore > homeScore ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {awayScore}
                    </span>
                    {awayScore > homeScore && <Badge className="bg-primary text-primary-foreground">Winner</Badge>}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-6 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {match.venue}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Match Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Match Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Possession", home: 52, away: 48 },
                  { label: "Total Shots", home: 14, away: 11 },
                  { label: "Shots on Target", home: 6, away: 4 },
                  { label: "Corners", home: 7, away: 5 },
                  { label: "Fouls", home: 12, away: 14 },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    <span className="w-12 text-right font-mono font-bold">{stat.home}</span>
                    <div className="flex-1">
                      <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                        <div
                          className="bg-primary transition-all"
                          style={{ width: `${(stat.home / (stat.home + stat.away)) * 100}%` }}
                        />
                        <div
                          className="bg-chart-2 transition-all"
                          style={{ width: `${(stat.away / (stat.home + stat.away)) * 100}%` }}
                        />
                      </div>
                      <p className="text-center text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                    <span className="w-12 text-left font-mono font-bold">{stat.away}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Player Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Managed Player Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {playerStats.length > 0 ? (
                <div className="space-y-6">
                  {playerStats.map((player) => (
                    <div key={player.id} className="p-6 rounded-xl border border-border bg-card">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg">
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <Link href={`/players/${player.id}`} className="hover:underline">
                              <h4 className="font-bold text-lg">{player.name}</h4>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {player.position} • {player.currentClub}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-chart-3 fill-chart-3" />
                          <span className="text-2xl font-bold">{player.stats.rating}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <Timer className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-lg font-bold">{player.stats.minutesPlayed}'</p>
                          <p className="text-xs text-muted-foreground">Minutes</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <Target className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-lg font-bold">{player.stats.passes}</p>
                          <p className="text-xs text-muted-foreground">Passes ({player.stats.passAccuracy}%)</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <Trophy className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-lg font-bold">{player.stats.shots}</p>
                          <p className="text-xs text-muted-foreground">Shots</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-lg font-bold">{player.stats.duelsWon}</p>
                          <p className="text-xs text-muted-foreground">Duels Won</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No managed players were involved in this match.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Agent Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Agent Notes & Observations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Performance Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    All managed players completed the full 90 minutes with satisfactory performances. No injuries
                    reported. Players showed good fitness levels and professional conduct throughout the match.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="font-medium mb-2">Contract Implications</h4>
                  <p className="text-sm text-muted-foreground">
                    Strong performances may increase negotiating leverage for upcoming contract renewals. Consider
                    scheduling meetings with club representatives to discuss performance bonuses.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/20">
                  <h4 className="font-medium mb-2">Media Opportunities</h4>
                  <p className="text-sm text-muted-foreground">
                    Match highlights featuring managed players are available for promotional use. Post-match interviews
                    may boost player visibility and market value.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
