import Link from "next/link"
import { notFound } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlayerForm } from "@/components/player-form"
import { getPlayers, Player} from "@/lib/server/players-excel.server"
import { ArrowLeft } from "lucide-react"

interface EditPlayerPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPlayerPage({ params }: EditPlayerPageProps) {
  const players = await getPlayers()
  const { id } = await params
  const player = players.find((p) => p.id === Number.parseInt(id))

  if (!player) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Edit Player" description={`Editing ${player.name}'s profile`}>
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href={`/players/${player.id}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
        </PageHeader>

        <div className="p-6">
          <PlayerForm player={player} mode="edit" />
        </div>
      </main>
    </div>
  )
}
