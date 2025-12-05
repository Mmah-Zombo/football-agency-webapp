"use client"

import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { MatchForm } from "@/components/match-form"
import { addMatch } from "@/lib/matches-store"
import type { Match } from "@/lib/data"

export default function AddMatchPage() {
  const handleSubmit = (data: Omit<Match, "id">) => {
    addMatch(data)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Add Match" description="Schedule a new match involving your managed players" />
        <div className="p-6">
          <MatchForm onSubmit={handleSubmit} title="New Match Details" />
        </div>
      </main>
    </div>
  )
}
