import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { MatchForm } from "@/components/match-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddMatchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Add Match" description="Schedule a new match involving your managed players">
          <Link href="/matches">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Matches
            </Button>
          </Link>
        </PageHeader>

        <div className="p-6">
          <MatchForm mode="add" />
        </div>
      </main>
    </div>
  )
}