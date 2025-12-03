import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dashboardStats, players, contracts, matches } from "@/lib/data"
import { Users, FileText, Calendar, Building2, TrendingUp, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const recentContracts = contracts.slice(0, 3)
  const upcomingMatches = matches.filter((m) => m.status === "Upcoming").slice(0, 3)
  const topPlayers = players.slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Dashboard" description="Overview of your football management operations" />

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Players"
              value={dashboardStats.totalPlayers}
              icon={Users}
              trend="+2 this month"
              trendUp={true}
            />
            <StatCard
              title="Active Contracts"
              value={dashboardStats.activeContracts}
              icon={FileText}
              trend={`${dashboardStats.expiringContracts} expiring soon`}
              trendUp={false}
            />
            <StatCard title="Upcoming Matches" value={dashboardStats.upcomingMatches} icon={Calendar} />
            <StatCard
              title="Partner Clubs"
              value={dashboardStats.totalClubs}
              icon={Building2}
              trend="Total contract value: €59M"
              trendUp={true}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Players */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPlayers.map((player) => (
                    <div key={player.id} className="flex items-center gap-4">
                      <img
                        src={player.image || "/placeholder.svg"}
                        alt={player.name}
                        className="h-12 w-12 rounded-full object-cover bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground truncate">{player.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.position} • {player.currentClub}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{player.marketValue}</p>
                        <Badge
                          variant={
                            player.status === "Under Contract"
                              ? "default"
                              : player.status === "Available"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {player.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMatches.map((match) => (
                    <div key={match.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{match.date}</Badge>
                        <Badge variant="secondary">{match.status}</Badge>
                      </div>
                      <p className="font-medium text-card-foreground">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                      <p className="text-sm text-muted-foreground">{match.venue}</p>
                      <p className="text-xs text-primary mt-2">Players: {match.managedPlayers.join(", ")}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contracts Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-chart-5" />
                Contract Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Player</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Club</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">End Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fee</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContracts.map((contract) => (
                      <tr key={contract.id} className="border-b border-border last:border-0">
                        <td className="py-3 px-4 font-medium text-card-foreground">{contract.playerName}</td>
                        <td className="py-3 px-4 text-muted-foreground">{contract.clubName}</td>
                        <td className="py-3 px-4 text-muted-foreground">{contract.endDate}</td>
                        <td className="py-3 px-4 font-medium text-primary">{contract.fee}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              contract.status === "Active"
                                ? "default"
                                : contract.status === "Expiring Soon"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {contract.status}
                          </Badge>
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
