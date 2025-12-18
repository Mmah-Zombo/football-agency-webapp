"use client"

import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Mail } from "lucide-react"
import Link from "next/link"
import { getClubs } from "@/lib/server/clubs-excel.server"
import type { Club } from "@/lib/server/clubs-excel.server"
import { useEffect, useState } from "react"

export default function ClubsPage() {
 const [clubs, setClubs] = useState<Club[]>([])
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const dbClubs = await getClubs()
      if (!mounted) return
      setClubs(dbClubs ?? [])
    })()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Clubs" description="Partner clubs and organizations">
          <Link href="/clubs/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Club
            </Button>
          </Link>
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
                      className="h-20 w-20 rounded-lg object-cover bg-muted"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{club.name}</h3>
                      <p className="text-sm text-muted-foreground">{club.league}</p>
                      <p className="text-sm text-muted-foreground">{club.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-card-foreground">{club.playersManaged}</p>
                      <p className="text-xs text-muted-foreground">Players Managed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-card-foreground">{club.activeContracts}</p>
                      <p className="text-xs text-muted-foreground">Active Contracts</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/clubs/${club.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View Details
                      </Button>
                    </Link>
                    <a
                      href={`mailto:${club.email}?subject=Partnership%20Inquiry&body=Dear%20${encodeURIComponent(club.name)}%20Team...`}
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full gap-2">
                        <Mail className="h-3 w-3" />
                        Contact
                      </Button>
                    </a>
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