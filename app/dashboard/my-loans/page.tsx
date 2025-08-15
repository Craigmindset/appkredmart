"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useLoans, type Loan, type LoanStatus } from "@/store/loans-store"
import { formatNaira } from "@/lib/currency"

function fmtDate(iso?: string) {
  if (!iso) return "—"
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso))
  } catch {
    return "—"
  }
}

const statusVariant: Record<LoanStatus, { className: string; label: string }> = {
  Pending: { className: "bg-amber-100 text-amber-800 hover:bg-amber-100", label: "Pending" },
  Approved: { className: "bg-blue-100 text-blue-800 hover:bg-blue-100", label: "Approved" },
  Disbursed: { className: "bg-sky-100 text-sky-800 hover:bg-sky-100", label: "Disbursed" },
  Active: { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100", label: "Active" },
  Rejected: { className: "bg-rose-100 text-rose-800 hover:bg-rose-100", label: "Rejected" },
}

export default function MyLoansPage() {
  const { toast } = useToast()
  const loans = useLoans((s) => s.loans)
  const seedDemo = useLoans((s) => s.seedDemo)

  const hasActive = useMemo(() => loans.some((l) => l.status === "Active"), [loans])

  const notify = (loan: Loan) => {
    toast({
      title: "Repayment reminder sent",
      description: `We’ll notify you about repayments for ${loan.id}. Next due: ${fmtDate(loan.dueDate)}.`,
    })
  }

  if (loans.length === 0 || !hasActive) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>My Loans</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/loan-request">Request a loan</Link>
            </Button>
            <Button variant="ghost" onClick={seedDemo} className="hidden md:inline-flex">
              Load demo data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {loans.length === 0 ? "No loans yet." : "No active loans at the moment."}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>My Loans</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/loan-request">Apply for another loan</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID / Reference</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className="text-right">Loan Amount</TableHead>
              <TableHead className="text-right">Repayment Amount</TableHead>
              <TableHead className="text-right">Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => {
              const s = statusVariant[loan.status]
              return (
                <TableRow key={loan.id} className={loan.status === "Active" ? "bg-muted/30" : undefined}>
                  <TableCell className="font-medium">{loan.id}</TableCell>
                  <TableCell>{loan.provider}</TableCell>
                  <TableCell className="text-right">{formatNaira(loan.loanAmount)}</TableCell>
                  <TableCell className="text-right">{formatNaira(loan.repaymentAmount)}</TableCell>
                  <TableCell className="text-right">{loan.interestRate}%</TableCell>
                  <TableCell>
                    <Badge className={`px-2 py-0.5 text-[10px] ${s.className}`}>{s.label}</Badge>
                  </TableCell>
                  <TableCell>{fmtDate(loan.startDate)}</TableCell>
                  <TableCell>{fmtDate(loan.dueDate)}</TableCell>
                  <TableCell className="text-right">{formatNaira(loan.balance)}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => notify(loan)}>
                      Get Repayment Notification
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="mt-3 text-xs text-muted-foreground">
          Tip: Click “Get Repayment Notification” to receive reminders ahead of your due date.
        </div>
      </CardContent>
    </Card>
  )
}
