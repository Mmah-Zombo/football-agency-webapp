"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Club } from "@/lib/data"
import { addClub, updateClub } from "@/lib/clubs-store"

interface ClubFormProps {
  club?: Club
  mode: "add" | "edit"
}

export function ClubForm({ club, mode }: ClubFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (optional)</Label>
              <Input
                id="logo"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                placeholder="Enter logo URL"
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
