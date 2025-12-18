"use client"

import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import {
  getContracts,
  getContractById,
  getContractByPlayerId,
  addContractAction,
  updateContractAction,
  Contract
} from '@/lib/server/contracts-excel.server'
import { useEffect, useState } from "react"

export default function ContractsPage() {
  // const contracts = await getContracts()
  const [contracts, setContracts] = useState<Contract[]>([])
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const dbcontracts = await getContracts()
      if (!mounted) return
      setContracts(dbcontracts ?? [])
    })()
    return () => {
      mounted = false
    }
  }, [])
  const activeContracts = contracts.filter((c: any) => c.status === "Active")
  const expiringContracts = contracts.filter((c: any) => c.status === "Expiring Soon")
  const totalValue = contracts.reduce((acc: any, c: any) => {
    const value = Number.parseInt(c.fee.replace(/[€$£M]/g, "")) || 0
    return acc + value
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <PageHeader title="Contracts" description="Manage player contracts and agreements">
          <Link href="/contracts/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Contract
            </Button>
          </Link>
        </PageHeader>

        <div className="p-6 space-y-6">
          {/* Contract Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Contracts</p>
                    <p className="text-2xl font-bold text-card-foreground">{activeContracts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-destructive/10 p-3">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expiring Soon</p>
                    <p className="text-2xl font-bold text-card-foreground">{expiringContracts.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-chart-2/10 p-3">
                    <FileText className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Contract Value</p>
                    <p className="text-2xl font-bold text-card-foreground">€{totalValue}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contracts Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contract ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Player</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Club</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Start Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">End Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fee</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr
                        key={contract.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-sm text-card-foreground">
                              CTR-{contract.id.toString().padStart(4, "0")}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-card-foreground">{contract.playerName}</td>
                        <td className="py-4 px-4 text-muted-foreground">{contract.clubName}</td>
                        <td className="py-4 px-4 text-muted-foreground">{contract.startDate}</td>
                        <td className="py-4 px-4 text-muted-foreground">{contract.endDate}</td>
                        <td className="py-4 px-4 font-semibold text-primary">{contract.fee}</td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              contract.status === "Active"
                                ? "default"
                                : contract.status === "Expiring Soon"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="gap-1"
                          >
                            {contract.status === "Active" && <CheckCircle className="h-3 w-3" />}
                            {contract.status === "Expiring Soon" && <Clock className="h-3 w-3" />}
                            {contract.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Link href={`/contracts/${contract.id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                            <Link href={`/contracts/${contract.id}/edit`}>
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
