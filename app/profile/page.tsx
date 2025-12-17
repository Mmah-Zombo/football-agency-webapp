"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, type UserRole, roleLabels, roleDescriptions } from "@/lib/auth-store"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Shield, Camera, ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, updateProfile } = useAuthStore()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "agent" as UserRole,
    avatar: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      })
      setImagePreview(user.avatar || null)
    }
  }, [isAuthenticated, user, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(formData)
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background pl-64">
      <div className="container max-w-4xl py-8">
        <PageHeader
          title="My Profile"
          description="View and manage your account information"
          action={
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          }
        />

        <div className="grid gap-6 mt-8">
          {/* Profile Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your personal details and role in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-muted overflow-hidden ring-4 ring-background shadow-lg">
                      <img
                        src={imagePreview || "/placeholder.svg?height=96&width=96&query=avatar"}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-md"
                      >
                        <Camera className="h-4 w-4" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{roleLabels[user.role]}</p>
                    <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
                  </div>
                  {!isEditing && (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>

                {isEditing && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          <User className="inline h-4 w-4 mr-2" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <Mail className="inline h-4 w-4 mr-2" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    {/* Role Field */}
                    <div className="space-y-2">
                      <Label htmlFor="role">
                        <Shield className="inline h-4 w-4 mr-2" />
                        Role
                      </Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value as UserRole }))}
                      >
                        <SelectTrigger id="role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roleLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              <div>
                                <div className="font-medium">{label}</div>
                                <div className="text-xs text-muted-foreground">
                                  {roleDescriptions[value as UserRole]}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            avatar: user.avatar || "",
                          })
                          setImagePreview(user.avatar || null)
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Role Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Role & Permissions</CardTitle>
              <CardDescription>What you can do in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{roleLabels[user.role]}</p>
                    <p className="text-sm text-muted-foreground">{roleDescriptions[user.role]}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>System information about your account</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <dt className="text-sm text-muted-foreground">User ID</dt>
                  <dd className="text-sm font-mono">{user.id}</dd>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <dt className="text-sm text-muted-foreground">Account Status</dt>
                  <dd className="text-sm">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                      Active
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between items-center py-2">
                  <dt className="text-sm text-muted-foreground">Member Since</dt>
                  <dd className="text-sm">{new Date().toLocaleDateString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
