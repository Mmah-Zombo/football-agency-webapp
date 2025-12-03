"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuthStore, type UserRole, roleLabels, roleDescriptions } from "@/lib/auth-store"
import { Eye, EyeOff, ArrowLeft, Loader2, Check } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuthStore()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<UserRole>("agent")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setIsLoading(true)

    try {
      const success = await register(name, email, password, role)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Registration failed. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Passwords match", met: password === confirmPassword && password.length > 0 },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-foreground items-center justify-center p-12">
        <div className="max-w-md text-background space-y-6">
          <div className="h-12 w-12 rounded-lg bg-background flex items-center justify-center">
            <span className="text-foreground font-bold text-xl">FA</span>
          </div>
          <h2 className="text-3xl font-bold">Start your journey with FootballAgents today.</h2>
          <p className="text-background/70 leading-relaxed">
            Create your account and get access to powerful tools designed specifically for football professionals.
            Manage players, contracts, and club relationships all in one place.
          </p>
          <ul className="space-y-3 pt-4">
            {[
              "Complete player management system",
              "Contract tracking and alerts",
              "Club relationship tools",
              "Match analytics dashboard",
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-background/20 flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-background/90 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground">Get started with your free trial. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Password requirements */}
              {password && (
                <div className="space-y-2 pt-2">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center ${
                          req.met ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        {req.met && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                      </div>
                      <span className={`text-xs ${req.met ? "text-foreground" : "text-muted-foreground"}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 pt-2">
                <Label>Select your role</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} className="grid gap-3">
                  {(Object.keys(roleLabels) as UserRole[]).map((roleKey) => (
                    <Label
                      key={roleKey}
                      htmlFor={`reg-${roleKey}`}
                      className={`flex flex-col gap-1 rounded-lg border p-4 cursor-pointer transition-colors ${
                        role === roleKey
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value={roleKey} id={`reg-${roleKey}`} />
                        <span className="font-medium text-sm">{roleLabels[roleKey]}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">{roleDescriptions[roleKey]}</p>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="#" className="underline hover:text-foreground">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
