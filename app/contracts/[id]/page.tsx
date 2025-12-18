import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  Banknote,
  User,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getContracts,
  getContractById,
  getContractByPlayerId,
  addContractAction,
  updateContractAction,
  Contract
} from '@/lib/server/contracts-excel.server'
import { getPlayerById, getPlayers, Player } from "@/lib/server/players-excel.server"
import { getClubById } from "@/lib/server/clubs-excel.server"

export default async function ContractDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const contracts = await getContracts()

  const { id } = await params
  const contract = contracts.find((p) => p.id === Number.parseInt(id))

  if (!contract) {
    notFound()
  }

  const players = await getPlayers()

  const player = await getPlayerById(contract.playerId)

  const club = await getClubById(contract.clubId)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4" />
      case "Expiring Soon":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default" as const
      case "Expiring Soon":
        return "destructive" as const
      default:
        return "secondary" as const
    }
  }

  // Calculate contract duration
  const startDate = new Date(contract.startDate)
  const endDate = new Date(contract.endDate)
  const durationMonths = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const durationYears = Math.floor(durationMonths / 12)
  const remainingMonths = durationMonths % 12

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader
          title={`Contract CTR-${contract.id.toString().padStart(4, "0")}`}
          description="Contract details and information"
        >
          <div className="flex gap-2">
            <Link href="/contracts">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={`/contracts/${contract.id}/edit`}>
              <Button className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Contract
              </Button>
            </Link>
          </div>
        </PageHeader>

        <div className="p-6 space-y-6">
          {/* Contract Summary Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground">
                      CTR-{contract.id.toString().padStart(4, "0")}
                    </h2>
                    <p className="text-muted-foreground">
                      {contract.playerName} - {contract.clubName}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(contract.status)} className="gap-1 text-sm px-3 py-1">
                  {getStatusIcon(contract.status)}
                  {contract.status}
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Banknote className="h-4 w-4" />
                    Contract Fee
                  </div>
                  <p className="text-2xl font-bold text-primary">{contract.fee}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </div>
                  <p className="text-lg font-semibold text-card-foreground">{contract.startDate}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    End Date
                  </div>
                  <p className="text-lg font-semibold text-card-foreground">{contract.endDate}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </div>
                  <p className="text-lg font-semibold text-card-foreground">
                    {durationYears > 0 && `${durationYears} year${durationYears > 1 ? "s" : ""}`}
                    {durationYears > 0 && remainingMonths > 0 && ", "}
                    {remainingMonths > 0 && `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Player Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Player Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {player ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={'/uploads/players/'+player.image || "/placeholder.svg?height=80&width=80&query=football player"}
                      alt={player.name}
                      className="h-20 w-20 rounded-lg object-cover bg-muted"
                    />
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-card-foreground">{player.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Age: {player.age}</p>
                        <p>Position: {player.position}</p>
                        <p>Nationality: {player.nationality}</p>
                        <p>Market Value: {player.marketValue}</p>
                      </div>
                      <Link href={`/players/${player.id}`}>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          View Player Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Player information not available</p>
                )}
              </CardContent>
            </Card>

            {/* Club Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Club Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {club ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={club.logo || "/placeholder.svg?height=80&width=80&query=football club logo"}
                      alt={club.name}
                      className="h-20 w-20 rounded-lg object-cover bg-muted"
                    />
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-card-foreground">{club.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Location: {club.location}</p>
                        <p>League: {club.league}</p>
                        <p>Players Managed: {club.playersManaged}</p>
                      </div>
                      <Link href={`/clubs/${club.id}`}>
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          View Club Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Club information not available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
