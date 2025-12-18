// components/club-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addClubAction, updateClubAction, saveClubLogoAction } from "@/lib/server/clubs-excel.server"
import type { Club } from "@/lib/server/clubs-excel.server"

interface ClubFormProps {
  club?: Club
  mode: "add" | "edit"
}

export function ClubForm({ club, mode }: ClubFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(club?.logo || null)

  const [formData, setFormData] = useState({
    name: club?.name || "",
    location: club?.location || "",
    league: club?.league || "",
    email: club?.email || "",
    phone: club?.phone || "",
    website: club?.website || "",
    playersManaged: club?.playersManaged?.toString() || "0",
    activeContracts: club?.activeContracts?.toString() || "0",
    logo: club?.logo || ""
  })

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)

    // Upload and get permanent path
    const uploadedPath = await saveClubLogoAction(file)
    setFormData(prev => ({ ...prev, logo: uploadedPath }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const data = {
      name: formData.name,
      location: formData.location,
      league: formData.league,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      playersManaged: Number(formData.playersManaged),
      activeContracts: Number(formData.activeContracts),
    }

    try {
      if (mode === "add") {
        await addClubAction(data, formData.logo || "")
      } else if (club) {
        await updateClubAction(club.id, data, formData.logo)
      }
      router.push("/clubs")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to save club")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{mode === "add" ? "Add New Club" : "Edit Club"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Club Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>League</Label>
              <Input
                value={formData.league}
                onChange={e => setFormData(prev => ({ ...prev, league: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                value={formData.website}
                onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Players Managed</Label>
              <Input
                type="number"
                value={formData.playersManaged}
                onChange={e => setFormData(prev => ({ ...prev, playersManaged: e.target.value }))}
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Active Contracts</Label>
              <Input
                type="number"
                value={formData.activeContracts}
                onChange={e => setFormData(prev => ({ ...prev, activeContracts: e.target.value }))}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Club Logo</Label>
            {logoPreview && (
              <img src={logoPreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg mb-4" />
            )}
            <Input type="file" accept="image/*" onChange={handleLogoChange} />
          </div>

          <div className="flex gap-4 pt-6">
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