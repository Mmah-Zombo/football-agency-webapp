import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { ContractForm } from "@/components/contract-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AddContractPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="New Contract" description="Create a new player contract">
          <Link href="/contracts">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Contracts
            </Button>
          </Link>
        </PageHeader>

        <div className="p-6">
          <ContractForm mode="add" />
        </div>
      </main>
    </div>
  )
}
