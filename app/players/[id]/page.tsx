import Link from "next/link"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { getPlayers, Player} from "@/lib/server/players-excel.server"
import { getContractByPlayerId } from "@/lib/server/contracts-excel.server"

interface PlayerDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  const players = await getPlayers()

  const { id } = await params
  const player = players.find((p) => p.id === Number.parseInt(id))
  // const contracts = await getContractByPlayerId(Number.parseInt(id))

  if (!player) {
    notFound()
  }

  // Find player's contract if any
  const playerContract = await getContractByPlayerId(Number.parseInt(id))

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Player Profile" description={`Viewing details for ${player.name}`}>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent" asChild>
              <Link href="/players">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button className="gap-2" asChild>
              <Link href={`/players/${player.id}/edit`}>
                <Edit className="h-4 w-4" />
                Edit Player
              </Link>
            </Button>
          </div>
        </PageHeader>

        <div className="p-6 space-y-6">
          {/* Player Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={'/uploads/players/'+player.image || "/placeholder.svg"}
                  alt={player.name}
                  className="h-40 w-40 rounded-xl object-cover border-4 border-primary/20 bg-muted"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-foreground">{player.name}</h1>
                      <Badge
                        variant={
                          player.status === "Under Contract"
                            ? "default"
                            : player.status === "Available"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-sm"
                      >
                        {player.status}
                      </Badge>
                    </div>
                    <p className="text-lg text-muted-foreground mt-1">{player.position}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="font-semibold">{player.age} years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nationality</p>
                        <p className="font-semibold">{player.nationality}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Current Club</p>
                        <p className="font-semibold">{player.currentClub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Market Value</p>
                        <p className="font-semibold text-primary">{player.marketValue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
              </CardHeader>
              <CardContent>
                {playerContract ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Club</span>
                      <span className="font-medium">{playerContract.clubName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date</span>
                      <span className="font-medium">{new Date(playerContract.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Date</span>
                      <span className="font-medium">{new Date(playerContract.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contract Fee</span>
                      <span className="font-bold text-primary">{playerContract.fee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      <Badge
                        variant={
                          playerContract.status === "Active"
                            ? "default"
                            : playerContract.status === "Expiring Soon"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {playerContract.status}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No active contract</p>
                    <Button variant="outline" className="mt-4 bg-transparent" asChild>
                      <Link href="/contracts">Add Contract</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Player Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position</span>
                    <span className="font-medium">{player.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Represented Since</span>
                    <span className="font-medium">2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Career Matches</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Career Goals</span>
                    <span className="font-medium">
                      {player.position === "Forward" ? "42" : player.position === "Midfielder" ? "18" : "3"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
