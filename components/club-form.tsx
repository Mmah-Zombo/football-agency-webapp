"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Club } from "@/lib/data"
import { addClub, updateClub } from "@/lib/clubs-store"
import { Upload, X } from "lucide-react"

interface ClubFormProps {
  club?: Club
  mode: "add" | "edit"
}

export function ClubForm({ club, mode }: ClubFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string>(club?.logo || "")

  const [formData, setFormData] = useState({
    name: club?.name || "",
    location: club?.location || "",
    league: club?.league || "",
    playersManaged: club?.playersManaged?.toString() || "0",
    activeContracts: club?.activeContracts?.toString() || "0",
    logo: club?.logo || "",
    email: club?.email || "",
    phone: club?.phone || "",
    website: club?.website || "",
    founded: club?.founded || "",
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setFormData({ ...formData, logo: base64String })
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImagePreview("")
    setFormData({ ...formData, logo: "" })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const clubData = {
      name: formData.name,
      location: formData.location,
      league: formData.league,
      playersManaged: Number.parseInt(formData.playersManaged),
      activeContracts: Number.parseInt(formData.activeContracts),
      logo: formData.logo || "/generic-football-club-logo.png",
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      founded: formData.founded,
    }

    if (mode === "add") {
      addClub(clubData)
    } else if (club) {
      updateClub(club.id, clubData)
    }

    router.push("/clubs")
    router.refresh()
  }

  const leagues = [
    "Premier League",
    "La Liga",
    "Bundesliga",
    "Serie A",
    "Ligue 1",
    "Scottish Premiership",
    "Eredivisie",
    "Primeira Liga",
  ]

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "add" ? "Add New Club" : "Edit Club"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Club Logo</Label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Club logo preview"
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
                <p className="text-xs text-muted-foreground">Upload a club logo (Max 5MB, JPG, PNG, or GIF)</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Club Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter club name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="league">League</Label>
              <Input
                id="league"
                value={formData.league}
                onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                placeholder="Enter league name"
                list="leagues"
                required
              />
              <datalist id="leagues">
                {leagues.map((league) => (
                  <option key={league} value={league} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label htmlFor="founded">Founded Year</Label>
              <Input
                id="founded"
                value={formData.founded}
                onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                placeholder="e.g., 1899"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@club.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 123 456 7890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="www.club.com"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "add" ? "Add Club" : "Save Changes"}
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
