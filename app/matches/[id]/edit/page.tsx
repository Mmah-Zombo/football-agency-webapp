"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { MatchForm } from "@/components/match-form"
import { getMatchById, updateMatch } from "@/lib/matches-store"
import type { Match } from "@/lib/data"

export default function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const match = getMatchById(Number(id))

  if (!match) {
    notFound()
  }

  const handleSubmit = (data: Omit<Match, "id">) => {
    updateMatch(Number(id), data)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Edit Match" description={`Update details for ${match.homeTeam} vs ${match.awayTeam}`} />
        <div className="p-6">
          <MatchForm match={match} onSubmit={handleSubmit} title="Edit Match Details" />
        </div>
      </main>
    </div>
  )
}
