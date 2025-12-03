import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { ClubForm } from "@/components/club-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddClubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Add Club" description="Register a new partner club">
          <Link href="/clubs">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Clubs
            </Button>
          </Link>
        </PageHeader>

        <div className="p-6">
          <ClubForm mode="add" />
        </div>
      </main>
    </div>
  )
}
