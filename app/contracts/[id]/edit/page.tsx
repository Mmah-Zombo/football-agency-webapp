import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { ContractForm } from "@/components/contract-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getContracts } from "@/lib/server/contracts-excel.server"

export default async function EditContractPage({ params }: { params: Promise<{ id: string }> }) {
    const contracts = await getContracts()
    const { id } = await params
    const contract = contracts.find((p) => p.id === Number.parseInt(id))
  
  if (!contract) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader
          title={`Edit Contract CTR-${contract.id.toString().padStart(4, "0")}`}
          description="Update contract details"
        >
          <Link href={`/contracts/${contract.id}`}>
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Details
            </Button>
          </Link>
        </PageHeader>

        <div className="p-6">
          <ContractForm contract={contract} mode="edit" />
        </div>
      </main>
    </div>
  )
}
