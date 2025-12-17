"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import {
  addPlayerAction,
  updatePlayerAction,
  savePlayerImageAction,
} from "@/lib/server/players-excel.server"
import type { Player } from "@/lib/players" // Use the safe client export

interface PlayerFormProps {
  player?: Player
  mode: "add" | "edit"
}

export function PlayerForm({ player, mode }: PlayerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
    player?.image ? `/uploads/players/${player.image}` : null
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file")
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    try {
      let imageFilename = player?.image || ""

      // Upload image if selected
      const uploadedFile = formData.get("image") as File
      if (uploadedFile && uploadedFile.size > 0) {
        const uploadedPath = await savePlayerImageAction(uploadedFile)
        imageFilename = uploadedPath.split("/").pop()! // extract filename only
      }

      // Build player data from form
      const playerData = {
        name: formData.get("name") as string,
        position: formData.get("position") as string,
        nationality: formData.get("nationality") as string,
        age: Number.parseInt(formData.get("age") as string),
        currentClub: formData.get("currentClub") as string,
        marketValue: formData.get("marketValue") as string,
        status: formData.get("status") as string,
        representedSince: "", // You can add this field later if needed
      }

      if (mode === "add") {
        await addPlayerAction(playerData, imageFilename)
      } else if (player) {
        await updatePlayerAction(player.id, playerData, imageFilename)
      }

      router.push("/players")
      router.refresh()
    } catch (error) {
      console.error("Error saving player:", error)
      alert("Failed to save player. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const positions = ["Forward", "Midfielder", "Defender", "Goalkeeper"]
  const statuses = ["Available", "Under Contract", "Injured"] as const

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "add" ? "Add New Player" : "Edit Player"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Player Photo</Label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Player preview"
                    className="h-32 w-32 rounded-lg object-cover border-2 border-border"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
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
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p className="text-xs text-muted-foreground">
                  Upload a player photo (Max 5MB, JPG, PNG, or GIF)
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={player?.name}
                placeholder="Enter player name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="16"
                max="45"
                defaultValue={player?.age}
                placeholder="Enter age"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select name="position" defaultValue={player?.position}>
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
                name="nationality"
                defaultValue={player?.nationality}
                placeholder="Enter nationality"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentClub">Current Club</Label>
              <Input
                id="currentClub"
                name="currentClub"
                defaultValue={player?.currentClub}
                placeholder="Enter current club"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketValue">Market Value</Label>
              <Input
                id="marketValue"
                name="marketValue"
                defaultValue={player?.marketValue}
                placeholder="e.g., €25M"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={player?.status}>
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

          {/* Actions */}
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