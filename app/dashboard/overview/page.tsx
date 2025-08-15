"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CreditCard,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
} from "lucide-react"
import Link from "next/link"

export default function OverviewPage() {
  const stats = [
    {
      title: "Total Balance",
      value: "₦125,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      description: "Available wallet balance",
    },
    {
      title: "Active Loans",
      value: "2",
      change: "No change",
      trend: "neutral",
      icon: CreditCard,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      description: "Currently active loans",
    },
    {
      title: "Total Orders",
      value: "24",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      gradient: "from-purple-500 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      description: "Orders this month",
    },
    {
      title: "Pending Deliveries",
      value: "3",
      change: "-2 from last week",
      trend: "down",
      icon: Package,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
      description: "Awaiting delivery",
    },
  ]

  const recentTransactions = [
    {
      id: "TXN001",
      type: "Purchase",
      description: "iPhone 14 Pro Max",
      amount: "-₦450,000",
      status: "Completed",
      date: "2024-01-15",
      method: "Wallet",
    },
    {
      id: "TXN002",
      type: "Loan",
      description: "Personal Loan Disbursement",
      amount: "+₦200,000",
      status: "Completed",
      date: "2024-01-14",
      method: "Bank Transfer",
    },
    {
      id: "TXN003",
      type: "Purchase",
      description: "MacBook Air M2",
      amount: "-₦680,000",
      status: "Processing",
      date: "2024-01-13",
      method: "BNPL",
    },
    {
      id: "TXN004",
      type: "Wallet Top-up",
      description: "Wallet funding",
      amount: "+₦100,000",
      status: "Completed",
      date: "2024-01-12",
      method: "Card",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Kred! 👋</h1>
            <p className="text-blue-100">Here's what's happening with your account today.</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-700">{stat.title}</CardTitle>
              <div
                className={`h-10 w-10 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1 text-xs ${
                    stat.trend === "up" ? "text-emerald-600" : stat.trend === "down" ? "text-red-600" : "text-slate-600"
                  }`}
                >
                  {stat.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                  {stat.trend === "down" && <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Recent Transactions</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Your latest account activity</p>
            </div>
            <Link href="/dashboard/transactions">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
              >
                View All
                <Eye className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          transaction.type === "Purchase"
                            ? "bg-purple-100 text-purple-700"
                            : transaction.type === "Loan"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {transaction.type}
                      </Badge>
                      <span className="text-sm font-medium text-slate-900">{transaction.description}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>{transaction.id}</span>
                      <span>{transaction.date}</span>
                      <span>{transaction.method}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-semibold ${
                        transaction.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900"
                      }`}
                    >
                      {transaction.amount}
                    </div>
                    <Badge
                      variant={transaction.status === "Completed" ? "default" : "secondary"}
                      className={`text-xs mt-1 ${
                        transaction.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/loan-request">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Request Loan</h3>
                  <p className="text-sm text-slate-600">Quick access to credit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/store">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Shop Now</h3>
                  <p className="text-sm text-slate-600">Browse our products</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/wallet">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Manage Wallet</h3>
                  <p className="text-sm text-slate-600">Top up or withdraw</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
