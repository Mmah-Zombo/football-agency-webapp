"use client"

import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlayersList } from "@/components/players-list"
import { usePlayers } from "@/lib/players-store"  // ← uses the safe hook
import { Plus } from "lucide-react"
import { getPlayers, getPlayerById, type Player } from '@/lib/players'
import { useEffect, useState } from "react"

export default function PlayersPage() {
 const [players, setPlayers] = useState<Player[]>([])
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const dbplayers = await getPlayers()
      if (!mounted) return
      setPlayers(dbplayers ?? [])
    })()
    return () => {
      mounted = false
    }
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