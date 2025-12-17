"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Player } from "@/lib/data"

interface PlayersListProps {
  players: Player[]
}

export function PlayersList({ players }: PlayersListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return players

    const query = searchQuery.toLowerCase()
    return players.filter(
      (player) =>
        player.name.toLowerCase().includes(query) ||
        player.position.toLowerCase().includes(query) ||
        player.currentClub.toLowerCase().includes(query) ||
        player.nationality.toLowerCase().includes(query),
    )
  }, [players, searchQuery])

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search players by name, position, or club..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Found {filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Players Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(filteredPlayers) && filteredPlayers.map((player) => (
          <Card key={player.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={'/uploads/players/'+player.image || "/placeholder.svg"}
                    alt={player.name}
                    className="h-20 w-20 rounded-full object-cover border-4 border-card bg-muted"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-card-foreground truncate">{player.name}</h3>
                    <p className="text-sm text-muted-foreground">{player.position}</p>
                    <Badge
                      variant={
                        player.status === "Under Contract"
                          ? "default"
                          : player.status === "Available"
                            ? "secondary"
                            : "destructive"
                      }
                      className="mt-2"
                    >
                      {player.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-medium text-card-foreground">{player.age} years</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nationality</span>
                  <span className="font-medium text-card-foreground">{player.nationality}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Club</span>
                  <span className="font-medium text-card-foreground">{player.currentClub}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market Value</span>
                  <span className="font-bold text-primary">{player.marketValue}</span>
                </div>
                <div className="pt-3 border-t border-border flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href={`/players/${player.id}`}>View Profile</Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/players/${player.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No players found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
}
