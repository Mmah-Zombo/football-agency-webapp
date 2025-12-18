import { notFound } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { MatchForm } from "@/components/match-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getMatchById, getMatches } from "@/lib/server/matches-excel.server"

export default async function EditMatchPage({ params }: { params: { id: string } }) {
  const matches = await getMatches()
  const { id } = await params
  const match = matches.find((p) => p.id === Number.parseInt(id))

  if (!match) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader
          title="Edit Match"
          description={`Update details for ${match.homeTeam} vs ${match.awayTeam}`}
        >
          <Link href={`/matches/${match.id}`}>
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Details
            </Button>
          </Link>
        </PageHeader>

        <div className="p-6">
          <MatchForm match={match} mode="edit" />
        </div>
      </main>
    </div>
  )
}