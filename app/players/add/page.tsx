import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlayerForm } from "@/components/player-form"
import { ArrowLeft } from "lucide-react"

export default function AddPlayerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Add New Player" description="Register a new player in your agency">
          <Button variant="outline" className="gap-2 bg-transparent" asChild>
            <Link href="/players">
              <ArrowLeft className="h-4 w-4" />
              Back to Players
            </Link>
          </Button>
        </PageHeader>

        <div className="p-6">
          <PlayerForm mode="add" />
        </div>
      </main>
    </div>
  )
}
