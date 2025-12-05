"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import type { Match } from "@/lib/data"
import { getPlayers } from "@/lib/players-store"

interface MatchFormProps {
  match?: Match
  onSubmit: (data: Omit<Match, "id">) => void
  title: string
}

export function MatchForm({ match, onSubmit, title }: MatchFormProps) {
  const router = useRouter()
  const players = getPlayers()

  const [formData, setFormData] = useState({
    date: match?.date || "",
    homeTeam: match?.homeTeam || "",
    awayTeam: match?.awayTeam || "",
    venue: match?.venue || "",
    managedPlayers: match?.managedPlayers || [],
    result: match?.result || null,
    status: match?.status || ("Upcoming" as Match["status"]),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    router.push("/matches")
  }

  const handlePlayerToggle = (playerName: string) => {
    setFormData((prev) => ({
      ...prev,
      managedPlayers: prev.managedPlayers.includes(playerName)
        ? prev.managedPlayers.filter((p) => p !== playerName)
        : [...prev.managedPlayers, playerName],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link href="/matches">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Match Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="e.g., Old Trafford"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="homeTeam">Home Team</Label>
              <Input
                id="homeTeam"
                value={formData.homeTeam}
                onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
                placeholder="e.g., Manchester FC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="awayTeam">Away Team</Label>
              <Input
                id="awayTeam"
                value={formData.awayTeam}
                onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
                placeholder="e.g., Liverpool FC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Match["status"]) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === "Completed" && (
              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <Input
                  id="result"
                  value={formData.result || ""}
                  onChange={(e) => setFormData({ ...formData, result: e.target.value || null })}
                  placeholder="e.g., 2-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Managed Players Involved</Label>
            <div className="grid gap-2 md:grid-cols-3">
              {players.map((player) => (
                <label
                  key={player.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.managedPlayers.includes(player.name)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.managedPlayers.includes(player.name)}
                    onChange={() => handlePlayerToggle(player.name)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{player.name}</span>
                  <span className="text-xs text-muted-foreground">({player.currentClub})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              {match ? "Update Match" : "Add Match"}
            </Button>
            <Link href="/matches">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
