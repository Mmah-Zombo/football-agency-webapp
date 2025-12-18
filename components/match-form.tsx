// components/match-form.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { addMatchAction, updateMatchAction } from "@/lib/server/matches-excel.server"
import type { Match } from "@/lib/server/matches-excel.server"

import { getPlayers, type Player } from "@/lib/server/players-excel.server"
import { getClubs, type Club } from "@/lib/server/clubs-excel.server"

interface MatchFormProps {
  match?: Match
  mode: "add" | "edit"
}

export function MatchForm({ match, mode }: MatchFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [players, setPlayers] = useState<Player[]>([])
  const [clubs, setClubs] = useState<Club[]>([])

  useEffect(() => {
    async function loadData() {
      const [loadedPlayers, loadedClubs] = await Promise.all([
        getPlayers(),
        getClubs(),
      ])
      setPlayers(loadedPlayers)
      setClubs(loadedClubs)
    }
    loadData()
  }, [])

  const [formData, setFormData] = useState({
    homeTeam: match?.homeTeam || "",
    awayTeam: match?.awayTeam || "",
    date: match?.date || "",
    venue: match?.venue || "",
    status: match?.status || "Upcoming",
    result: match?.result || "",
    managedPlayers: match?.managedPlayers || [],
  })

  const handlePlayerToggle = (playerName: string) => {
    setFormData(prev => ({
      ...prev,
      managedPlayers: prev.managedPlayers.includes(playerName)
        ? prev.managedPlayers.filter(p => p !== playerName)
        : [...prev.managedPlayers, playerName],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (formData.homeTeam === formData.awayTeam) {
      alert("Home team and away team cannot be the same club.")
      return
    }

    setIsSubmitting(true)

    const data: Omit<Match, "id"> = {
      homeTeam: formData.homeTeam,
      awayTeam: formData.awayTeam,
      date: formData.date,
      venue: formData.venue,
      status: formData.status,
      result: formData.status === "Completed" ? formData.result : undefined,
      managedPlayers: formData.managedPlayers,
    }

    try {
      if (mode === "add") {
        await addMatchAction(data)
      } else if (match) {
        await updateMatchAction(match.id, data)
      }

      router.push("/matches")
      router.refresh()
    } catch (error) {
      console.error("Failed to save match:", error)
      alert("Failed to save match. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>{mode === "add" ? "Add New Match" : "Edit Match"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Home Team</Label>
              <Select
                value={formData.homeTeam}
                onValueChange={value => setFormData(prev => ({ ...prev, homeTeam: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select home team" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map(club => (
                    <SelectItem
                      key={club.id}
                      value={club.name}
                      disabled={club.name === formData.awayTeam}
                    >
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Away Team</Label>
              <Select
                value={formData.awayTeam}
                onValueChange={value => setFormData(prev => ({ ...prev, awayTeam: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select away team" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map(club => (
                    <SelectItem
                      key={club.id}
                      value={club.name}
                      disabled={club.name === formData.homeTeam}
                    >
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Venue</Label>
              <Input
                value={formData.venue}
                onChange={e => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={value => setFormData(prev => ({ ...prev, status: value as Match["status"] }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === "Completed" && (
              <div className="space-y-2">
                <Label>Result (e.g. 2-1)</Label>
                <Input
                  value={formData.result}
                  onChange={e => setFormData(prev => ({ ...prev, result: e.target.value }))}
                  placeholder="2-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label>Managed Players in this Match</Label>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {players.length === 0 ? (
                <p className="text-sm text-muted-foreground col-span-full">Loading players...</p>
              ) : (
                players.map(player => (
                  <label
                    key={player.id}
                    className="flex items-center gap-3 cursor-pointer rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.managedPlayers.includes(player.name)}
                      onChange={() => handlePlayerToggle(player.name)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-sm">{player.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {player.position} • {player.currentClub}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "add" ? "Add Match" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}