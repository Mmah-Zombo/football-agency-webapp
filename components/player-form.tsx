"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Player } from "@/lib/data"
import { addPlayer, updatePlayer } from "@/lib/players-store"
import { Upload, X } from "lucide-react"

interface PlayerFormProps {
  player?: Player
  mode: "add" | "edit"
}

export function PlayerForm({ player, mode }: PlayerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string>(player?.image || "")

  const [formData, setFormData] = useState({
    name: player?.name || "",
    age: player?.age?.toString() || "",
    position: player?.position || "",
    nationality: player?.nationality || "",
    currentClub: player?.currentClub || "",
    marketValue: player?.marketValue || "",
    status: player?.status || ("Available" as Player["status"]),
    image: player?.image || "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setFormData({ ...formData, image: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview("")
    setFormData({ ...formData, image: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const playerData = {
      name: formData.name,
      age: Number.parseInt(formData.age),
      position: formData.position,
      nationality: formData.nationality,
      currentClub: formData.currentClub,
      marketValue: formData.marketValue,
      status: formData.status as Player["status"],
      image: formData.image || "/diverse-football-player.png",
    }

    if (mode === "add") {
      addPlayer(playerData)
    } else if (player) {
      updatePlayer(player.id, playerData)
    }

    router.push("/players")
    router.refresh()
  }

  const positions = ["Forward", "Midfielder", "Defender", "Goalkeeper"]
  const statuses: Player["status"][] = ["Available", "Under Contract", "Injured"]

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "add" ? "Add New Player" : "Edit Player"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Player Photo</Label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Player preview"
                    className="h-32 w-32 rounded-lg object-cover border-2 border-border"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="h-32 w-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Upload a player photo (Max 5MB, JPG, PNG, or GIF)</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter player name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="16"
                max="45"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Enter age"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="Enter nationality"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentClub">Current Club</Label>
              <Input
                id="currentClub"
                value={formData.currentClub}
                onChange={(e) => setFormData({ ...formData, currentClub: e.target.value })}
                placeholder="Enter current club"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketValue">Market Value</Label>
              <Input
                id="marketValue"
                value={formData.marketValue}
                onChange={(e) => setFormData({ ...formData, marketValue: e.target.value })}
                placeholder="e.g., €25M"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Player["status"] })}
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
              {isSubmitting ? "Saving..." : mode === "add" ? "Add Player" : "Save Changes"}
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
