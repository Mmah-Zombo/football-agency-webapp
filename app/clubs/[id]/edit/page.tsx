import { use } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { ClubForm } from "@/components/club-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getClubs } from "@/lib/server/clubs-excel.server"

export default async function EditClubPage({ params }: { params: Promise<{ id: string }> }) {
  const clubs = await getClubs()
  const { id } = await params
  const club = clubs.find((p) => p.id === Number.parseInt(id))

  if (!club) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title={`Edit ${club.name}`} description="Update club information">
          <Link href={`/clubs/${club.id}`}>
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Details
            </Button>
          </Link>
        </PageHeader>

        <div className="p-6">
          <ClubForm club={club} mode="edit" />
        </div>
      </main>
    </div>
  )
}
