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
import { getPlayers, type Player } from "@/lib/server/players-excel.server"
import {
  addContractAction,
  updateContractAction,
  getContractById,
} from "@/lib/server/contracts-excel.server"

// Use the same type from server
import type { Contract } from "@/lib/server/contracts-excel.server"
import { Club, getClubs } from "@/lib/server/clubs-excel.server"

interface ContractFormProps {
  contract?: Contract
  mode: "add" | "edit"
}

export function ContractForm({ contract, mode }: ContractFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  // Load players on mount
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
  const [formData, setFormData] = useState({
    playerId: contract?.playerId?.toString() || "",
    playerName: contract?.playerName || "",
    clubId: contract?.clubId?.toString() || "",
    clubName: contract?.clubName || "",
    startDate: contract?.startDate || "",
    endDate: contract?.endDate || "",
    fee: contract?.fee || "",
    status: contract?.status || "Active",
  })

  const handlePlayerChange = (playerId: string) => {
    const player = players.find((p) => p.id === Number(playerId))
    setFormData((prev) => ({
      ...prev,
      playerId,
      playerName: player?.name || "",
    }))
  }

  const handleClubChange = (clubId: string) => {
    const club = clubs.find((c) => c.id === Number(clubId))
    setFormData((prev) => ({
      ...prev,
      clubId,
      clubName: club?.name || "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)

    const contractData = {
      playerId: Number(formData.playerId),
      playerName: formData.playerName,
      clubId: Number(formData.clubId),
      clubName: formData.clubName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      fee: formData.fee,
      status: formData.status as Contract["status"],
    }

    try {
      if (mode === "add") {
        await addContractAction(contractData)
      } else if (contract) {
        await updateContractAction(contract.id, contractData)
      }

      router.push("/contracts")
      router.refresh()
    } catch (error) {
      console.error("Failed to save contract:", error)
      // You could add a toast notification here
      alert("Failed to save contract. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
              <Label>Player</Label>
              <Select
                value={formData.playerId}
                onValueChange={handlePlayerChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a player" />
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
              <Label>Club</Label>
              <Select
                value={formData.clubId}
                onValueChange={handleClubChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a club" />
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
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Contract Fee</Label>
              <Input
                placeholder="e.g. €15M"
                value={formData.fee}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fee: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as Contract["status"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
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

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : mode === "add"
                  ? "Create Contract"
                  : "Save Changes"}
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