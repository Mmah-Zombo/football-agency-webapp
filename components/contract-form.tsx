"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Contract } from "@/lib/data"
import { addContract, updateContract } from "@/lib/contracts-store"
import { getPlayers, getPlayerById, type Player } from '@/lib/players'
import { getClubs } from "@/lib/clubs-store"

interface ContractFormProps {
  contract?: Contract
  mode: "add" | "edit"
}

export async function ContractForm({ contract, mode }: ContractFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const players = await getPlayers()
  const clubs = getClubs()

  const [formData, setFormData] = useState({
    playerId: contract?.playerId?.toString() || "",
    playerName: contract?.playerName || "",
    clubId: contract?.clubId?.toString() || "",
    clubName: contract?.clubName || "",
    startDate: contract?.startDate || "",
    endDate: contract?.endDate || "",
    fee: contract?.fee || "",
    status: contract?.status || ("Active" as Contract["status"]),
  })

  const handlePlayerChange = (playerId: string) => {
    const player = players.find((p) => p.id === Number.parseInt(playerId))
    setFormData({
      ...formData,
      playerId,
      playerName: player?.name || "",
    })
  }

  const handleClubChange = (clubId: string) => {
    const club = clubs.find((c) => c.id === Number.parseInt(clubId))
    setFormData({
      ...formData,
      clubId,
      clubName: club?.name || "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const contractData = {
      playerId: Number.parseInt(formData.playerId),
      playerName: formData.playerName,
      clubId: Number.parseInt(formData.clubId),
      clubName: formData.clubName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      fee: formData.fee,
      status: formData.status as Contract["status"],
    }

    if (mode === "add") {
      addContract(contractData)
    } else if (contract) {
      updateContract(contract.id, contractData)
    }

    router.push("/contracts")
    router.refresh()
  }

  const statuses: Contract["status"][] = ["Active", "Expiring Soon", "Expired"]

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "add" ? "Create New Contract" : "Edit Contract"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="player">Player</Label>
              <Select value={formData.playerId} onValueChange={handlePlayerChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select player" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="club">Club</Label>
              <Select value={formData.clubId} onValueChange={handleClubChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select club" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club) => (
                    <SelectItem key={club.id} value={club.id.toString()}>
                      {club.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee">Contract Fee</Label>
              <Input
                id="fee"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                placeholder="e.g., €15M"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Contract["status"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "add" ? "Create Contract" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
