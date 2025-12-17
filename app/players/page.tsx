"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlayersList } from "@/components/players-list"
import { getPlayers } from "@/lib/players-store"
import { Plus } from "lucide-react"
import type { Player } from "@/lib/data"

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    // Load players on mount
    setPlayers(getPlayers())

    // Set up polling to check for new players every second
    const interval = setInterval(() => {
      setPlayers(getPlayers())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Players" description="Manage your represented football players">
          <Button className="gap-2" asChild>
            <Link href="/players/add">
              <Plus className="h-4 w-4" />
              Add Player
            </Link>
          </Button>
        </PageHeader>

        <div className="p-6">
          <PlayersList players={players} />
        </div>
      </main>
    </div>
  )
}
