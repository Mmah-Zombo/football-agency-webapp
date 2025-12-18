import { use } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getClubById, getClubs } from "@/lib/server/clubs-excel.server"
import { getContracts } from "@/lib/server/contracts-excel.server" // if you migrated contracts too
import { ArrowLeft, MapPin, Trophy, Mail, Phone, Globe, Calendar, Users, FileText, Edit } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ClubDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const clubs = await getClubs()

  const { id } = await params
  const club = clubs.find((p: any) => p.id === Number.parseInt(id))

  if (!club) {
    notFound()
  }

  const unfilteredContracts = await getContracts()
  const contracts = unfilteredContracts.filter((c: any) => c.clubId === club.id)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title={club.name} description="Club details and information">
          <div className="flex gap-2">
            <Link href="/clubs">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={`/clubs/${club.id}/edit`}>
              <Button className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Club
              </Button>
            </Link>
          </div>
        </PageHeader>

        <div className="p-6 space-y-6">
          {/* Club Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={club.logo || "/placeholder.svg?height=128&width=128&query=football club logo"}
                  alt={club.name}
                  className="h-32 w-32 rounded-xl object-cover bg-muted"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-card-foreground">{club.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4" />
                      {club.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Trophy className="h-3 w-3" />
                      {club.league}
                    </Badge>
                    {/* {club.founded && (
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        Founded {club.founded}
                      </Badge>
                    )} */}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-2xl font-bold text-card-foreground">{club.playersManaged}</p>
                      <p className="text-xs text-muted-foreground">Players Managed</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/50">
                      <FileText className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-2xl font-bold text-card-foreground">{club.activeContracts}</p>
                      <p className="text-xs text-muted-foreground">Active Contracts</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {club.email && (
                  <a
                    href={`mailto:${club.email}?subject=Partnership%20Inquiry%20-%20Football%20Agent`}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-card-foreground">{club.email}</p>
                    </div>
                  </a>
                )}
                {club.phone && (
                  <a
                    href={`tel:${club.phone}`}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-card-foreground">{club.phone}</p>
                    </div>
                  </a>
                )}
                {club.website && (
                  <a
                    href={`https://${club.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="rounded-full bg-primary/10 p-2">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <p className="font-medium text-card-foreground">{club.website}</p>
                    </div>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Club Contracts */}
          {contracts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Contracts with {club.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Player</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Start Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">End Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fee</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract) => (
                        <tr
                          key={contract.id}
                          className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-4 font-medium text-card-foreground">{contract.playerName}</td>
                          <td className="py-4 px-4 text-muted-foreground">{contract.startDate}</td>
                          <td className="py-4 px-4 text-muted-foreground">{contract.endDate}</td>
                          <td className="py-4 px-4 font-semibold text-primary">{contract.fee}</td>
                          <td className="py-4 px-4">
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
          )}
        </div>
      </main>
    </div>
  )
}
