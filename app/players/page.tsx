import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlayersList } from "@/components/players-list"
import { players } from "@/lib/data"
import { Plus } from "lucide-react"

export default function PlayersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Players" description="Manage your represented football players">
          <Button className="gap-2" asChild>
            <Link href="/players/add">
              <Plus className="h-4 w-4" />
              Add Player
            </Link>
          </Button>
        </PageHeader>

        <div className="p-6">
          <PlayersList players={players} />
        </div>
      </main>
    </div>
  )
}
