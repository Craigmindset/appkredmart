"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, LayoutDashboard, CreditCard, ShoppingBag, TrendingUp, Users, Package } from "lucide-react"
import Link from "next/link"

interface WelcomeProps {
  username?: string
}

export default function Welcome({ username = "User" }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KredMart
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Welcome back,
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {username}!
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to continue your journey? Choose what you'd like to do next and let's make it happen.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Dashboard Card */}
          <Card className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  Popular
                </Badge>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                Continue to Dashboard
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Access your personal dashboard to view orders, track deliveries, and manage your account.
              </p>

              <Link href="/dashboard/overview">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 group-hover:shadow-lg transition-all duration-300">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Loan Card */}
          <Card className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                  Fast Approval
                </Badge>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors">Request a Loan</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Get instant access to credit for your purchases with our quick and easy loan application process.
              </p>

              <Link href="/create-wallet">
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 group-hover:shadow-lg transition-all duration-300">
                  Apply for Loan
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Shopping Card */}
          <Card className="group relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                  New Arrivals
                </Badge>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors">
                Continue Shopping
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Explore our latest products and exclusive deals. Find everything you need in one place.
              </p>

              <Link href="/store">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 group-hover:shadow-lg transition-all duration-300">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 mb-3">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">2.5K+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">98%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mb-3">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">10K+</div>
            <div className="text-sm text-gray-600">Products Available</div>
          </div>
        </div>
      </div>
    </div>
  )
}
