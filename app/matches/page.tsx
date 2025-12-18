"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, MapPin, Users, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getUpcomingMatches, getCompletedMatches } from "@/lib/server/matches-excel.server"
import type { Match } from "@/lib/server/matches-excel.server"

export default function MatchesPage() {
  const [upcomingMatches, setUpcoming] = useState<Match[]>([])
  const [completedMatches, setCompleted] = useState<Match[]>([])

  useEffect(() => {
    async function load() {
      setUpcoming(await getUpcomingMatches())
      setCompleted(await getCompletedMatches())
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Matches" description="Track matches involving your managed players">
          <Link href="/matches/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Match
            </Button>
          </Link>
        </PageHeader>

        <div className="p-6 space-y-6">
          {/* Upcoming Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-chart-3" />
                Upcoming Matches ({upcomingMatches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="rounded-xl border border-border p-5 bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {match.date}
                      </Badge>
                      <Badge className="bg-chart-3 text-chart-3-foreground">{match.status}</Badge>
                    </div>

                    <div className="text-center py-4">
                      <p className="text-lg font-bold text-card-foreground">{match.homeTeam}</p>
                      <p className="text-2xl font-bold text-muted-foreground my-2">VS</p>
                      <p className="text-lg font-bold text-card-foreground">{match.awayTeam}</p>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {match.venue}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Users className="h-4 w-4" />
                        {match.managedPlayers.join(", ")}
                      </div>
                    </div>

                    <Link href={`/matches/${match.id}`}>
                      <Button variant="outline" className="w-full mt-4 bg-transparent">
                        View Details
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completed Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Completed Matches ({completedMatches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Match</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Venue</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Result</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Managed Players</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedMatches.map((match) => (
                      <tr
                        key={match.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4 text-muted-foreground">{match.date}</td>
                        <td className="py-4 px-4 font-medium text-card-foreground">
                          {match.homeTeam} vs {match.awayTeam}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">{match.venue}</td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary" className="font-mono font-bold">
                            {match.result}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-primary">{match.managedPlayers.join(", ")}</td>
                        <td className="py-4 px-4">
                          <Link href={`/matches/${match.id}/report`}>
                            <Button variant="ghost" size="sm">
                              View Report
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
