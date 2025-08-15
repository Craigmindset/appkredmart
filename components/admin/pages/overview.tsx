"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, Package, UsersIcon, Wallet } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Failed"
type PaymentMethod = "Wallet" | "BNPL" | "Card"
type DeliveryStatus = "In Progress" | "Arriving Today" | "Delivered" | "Canceled"

type OrderRow = {
  orderId: string
  txId: string
  usernames: string
  items: number
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  deliveryStatus: DeliveryStatus
}

type LoanRow = {
  loanId: string
  applicant: string
  provider: string
  loanAmount: number
  repaymentAmount: number
  interest: number // percent
  status: "Pending" | "Approved" | "Disbursed" | "Active" | "Rejected"
}

type MerchantRow = {
  merchantId: string
  merchantName: string
  txId: string
  date: string // ISO
  settleStatus: "Paid" | "Unpaid" | "Pending" | "Dispute"
}

const ordersData: OrderRow[] = [
  {
    orderId: "ADM-ORD-240091",
    txId: "TX-77A91",
    usernames: "adeola, joseph",
    items: 2,
    paymentStatus: "Paid",
    paymentMethod: "Card",
    deliveryStatus: "In Progress",
  },
  {
    orderId: "ADM-ORD-240088",
    txId: "TX-77A77",
    usernames: "sarah",
    items: 1,
    paymentStatus: "Paid",
    paymentMethod: "Wallet",
    deliveryStatus: "Arriving Today",
  },
  {
    orderId: "ADM-ORD-240073",
    txId: "TX-77A65",
    usernames: "kofi",
    items: 1,
    paymentStatus: "Paid",
    paymentMethod: "Card",
    deliveryStatus: "Delivered",
  },
  {
    orderId: "ADM-ORD-240060",
    txId: "TX-77A50",
    usernames: "chioma",
    items: 2,
    paymentStatus: "Pending",
    paymentMethod: "BNPL",
    deliveryStatus: "In Progress",
  },
  {
    orderId: "ADM-ORD-240052",
    txId: "TX-77A41",
    usernames: "matt",
    items: 1,
    paymentStatus: "Refunded",
    paymentMethod: "Card",
    deliveryStatus: "Canceled",
  },
]

const loansData: LoanRow[] = [
  {
    loanId: "ADM-LOAN-1000123",
    applicant: "Adeola K",
    provider: "CreditDirect",
    loanAmount: 200000,
    repaymentAmount: 230000,
    interest: 15,
    status: "Active",
  },
  {
    loanId: "ADM-LOAN-1000456",
    applicant: "Joseph I",
    provider: "FairMoney",
    loanAmount: 100000,
    repaymentAmount: 112000,
    interest: 12,
    status: "Pending",
  },
  {
    loanId: "ADM-LOAN-1000789",
    applicant: "Sarah W",
    provider: "Carbon",
    loanAmount: 350000,
    repaymentAmount: 392000,
    interest: 12,
    status: "Approved",
  },
]

const merchantsData: MerchantRow[] = [
  {
    merchantId: "KM-MER-02341",
    merchantName: "KredMart Electronics",
    txId: "TX-M-0097",
    date: new Date().toISOString(),
    settleStatus: "Paid",
  },
  {
    merchantId: "KM-MER-01422",
    merchantName: "Gadget Hub",
    txId: "TX-M-0096",
    date: new Date(Date.now() - 86400000).toISOString(),
    settleStatus: "Pending",
  },
  {
    merchantId: "KM-MER-01111",
    merchantName: "Smart Home Co.",
    txId: "TX-M-0095",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    settleStatus: "Dispute",
  },
]

function formatCurrency(amount: number) {
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(
      amount,
    )
  } catch {
    return "₦" + amount.toLocaleString()
  }
}

function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    Refunded: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    Failed: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    "In Progress": "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
    "Arriving Today": "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    Canceled: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
    Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    Disbursed: "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
    Active: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
    Rejected: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    Unpaid: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    Dispute: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
  }
  return <Badge className={cn("font-medium", map[value] ?? "bg-muted text-foreground")}>{value}</Badge>
}

export default function OverviewPage() {
  const [tab, setTab] = useState<"orders" | "loans" | "merchants">("orders")

  const totals = useMemo(() => {
    return {
      merchants: merchantsData.length,
      users: 24_120,
      revenue: 0, // demo
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* KPI Cards with distinct header colors */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="bg-emerald-600 text-emerald-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-emerald-50">Merchants</CardTitle>
              <Package className="h-5 w-5 opacity-90" />
            </div>
          </CardHeader>
          <CardContent className="py-6 text-3xl font-semibold">{totals.merchants}</CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-violet-600 text-violet-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-violet-50">Users</CardTitle>
              <UsersIcon className="h-5 w-5 opacity-90" />
            </div>
          </CardHeader>
          <CardContent className="py-6 text-3xl font-semibold">{totals.users.toLocaleString()}</CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-amber-600 text-amber-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-amber-50">Revenue</CardTitle>
              <Wallet className="h-5 w-5 opacity-90" />
            </div>
          </CardHeader>
          <CardContent className="py-6 text-3xl font-semibold">₦0</CardContent>
        </Card>
      </div>

      {/* Recent Transactions with filter */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-3 md:w-auto">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="loans">Loans</TabsTrigger>
                <TabsTrigger value="merchants">Merchants</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Tabs value={tab}>
              {/* Orders Table */}
              <TabsContent value="orders" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Usernames</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Delivery Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersData.map((row) => (
                      <TableRow key={row.txId}>
                        <TableCell className="font-medium">{row.orderId}</TableCell>
                        <TableCell>{row.txId}</TableCell>
                        <TableCell className="capitalize">{row.usernames}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.items}</TableCell>
                        <TableCell>
                          <StatusBadge value={row.paymentStatus} />
                        </TableCell>
                        <TableCell>{row.paymentMethod}</TableCell>
                        <TableCell>
                          <StatusBadge value={row.deliveryStatus} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/admin/dashboard/transactions?type=order&id=${encodeURIComponent(row.txId)}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            View Transaction <ArrowRight className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Loans Table */}
              <TabsContent value="loans" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Applicant Name</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead className="text-right">Loan Amount</TableHead>
                      <TableHead className="text-right">Repayment Amount</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loansData.map((row) => (
                      <TableRow key={row.loanId}>
                        <TableCell className="font-medium">{row.loanId}</TableCell>
                        <TableCell>{row.applicant}</TableCell>
                        <TableCell>{row.provider}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(row.loanAmount)}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatCurrency(row.repaymentAmount)}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.interest}%</TableCell>
                        <TableCell>
                          <StatusBadge value={row.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/admin/dashboard/transactions?type=loan&id=${encodeURIComponent(row.loanId)}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            View Transaction <ArrowRight className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Merchants Table */}
              <TabsContent value="merchants" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant ID</TableHead>
                      <TableHead>Merchant Name</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Transaction Date</TableHead>
                      <TableHead>Settle Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {merchantsData.map((row) => (
                      <TableRow key={row.txId}>
                        <TableCell className="font-medium">{row.merchantId}</TableCell>
                        <TableCell>{row.merchantName}</TableCell>
                        <TableCell>{row.txId}</TableCell>
                        <TableCell className="tabular-nums">{new Date(row.date).toLocaleString()}</TableCell>
                        <TableCell>
                          <StatusBadge value={row.settleStatus} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/admin/dashboard/transactions?type=merchant&id=${encodeURIComponent(row.txId)}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            View Transaction <ArrowRight className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
