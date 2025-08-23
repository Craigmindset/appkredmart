"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, UserX, Store, Package, ShoppingCart, DollarSign, Loader2 } from "lucide-react"
import { useMerchants, useMerchantStats, merchantsService } from "@/lib/services/admin/merchants"
import type { MerchantResponse } from "@/lib/services/admin/merchants"

export default function MerchantAdminPage() {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [modalMerchant, setModalMerchant] = useState<MerchantResponse | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  // Use the real merchants service
  const { merchants, total, totalPages, loading, error, refetch } = useMerchants({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy: "createdAt"
  })

  // Use the real merchant stats service
  const { stats, loading: statsLoading, error: statsError } = useMerchantStats()

  const handleDeactivate = async (merchantId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active"
      await merchantsService.updateMerchantStatus(merchantId, newStatus as "Active" | "Inactive" | "Suspended")
      refetch() // Refresh the data after status update
    } catch (err) {
      console.error("Failed to update merchant status:", err)
    }
  }

  const handleViewOrders = (merchantId: string) => {
    // This would typically navigate to a detailed orders view
    console.log(`Viewing orders for merchant: ${merchantId}`)
  }

  // Calculate summary stats with fallbacks
  const totalMerchants = stats?.totalMerchants || merchants.length
  const activeMerchants = stats?.activeMerchants || merchants.filter((m) => m.status === "Active").length
  const totalInventory = stats?.totalInventory || merchants.reduce((sum, m) => sum + (m.totalInventory || 0), 0)
  const totalRevenue = stats?.totalRevenue || merchants.reduce((sum, m) => sum + (m.totalMarkup || 0), 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
            <Store className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalMerchants}
            </div>
            <p className="text-xs text-muted-foreground">{activeMerchants} active merchants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalInventory.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Products across all merchants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                merchants.reduce((sum, m) => sum + (m.totalOrders || 0), 0).toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground">All-time orders processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `₦${totalRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">Total markup earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Merchants Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Merchant Management</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search merchants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Button onClick={() => alert("Add New Merchant functionality not implemented yet.")}>
                + Add Merchant
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SN</TableHead>
                  <TableHead>Merchant ID</TableHead>
                  <TableHead>Merchant Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Inventory</TableHead>
                  <TableHead>Total Sold</TableHead>
                  <TableHead>Total Markup</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading merchants...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="text-red-500">
                        Error loading merchants: {error.message || 'Unknown error'}
                        <div className="mt-2">
                          <Button variant="outline" onClick={() => refetch()}>
                            Retry
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : merchants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <p className="text-muted-foreground">No merchants found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  merchants.map((merchant, idx) => (
                    <TableRow key={merchant.id}>
                      <TableCell>{((currentPage - 1) * itemsPerPage) + idx + 1}</TableCell>
                      <TableCell className="font-medium">{merchant.id}</TableCell>
                      <TableCell>{merchant.firstName} {merchant.lastName}</TableCell>
                      <TableCell>{merchant.role || "N/A"}</TableCell>
                      <TableCell>
                        <div className="font-medium">{merchant.email}</div>
                        <div className="text-xs text-muted-foreground">{merchant.phone}</div>
                      </TableCell>
                      <TableCell>{(merchant.totalInventory || 0).toLocaleString()}</TableCell>
                      <TableCell>{(merchant.totalSold || 0).toLocaleString()}</TableCell>
                      <TableCell>₦{(merchant.totalMarkup || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={merchant.status === "Active" ? "default" : "secondary"}
                          className={
                            merchant.status === "Active" 
                              ? "bg-green-100 text-green-800 hover:bg-green-200" 
                              : merchant.status === "Inactive"
                              ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }
                        >
                          {merchant.status || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setModalMerchant(merchant)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Merchant Doc
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewOrders(merchant.id)}>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeactivate(merchant.id, merchant.status || "Active")}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              {merchant.status === "Active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end items-center mt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages || 0}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages || loading || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Modal for Merchant CAC Doc */}
          {modalMerchant && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setModalMerchant(null)}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Merchant CAC Document</h2>
                <iframe
                  src={modalMerchant.cacDocUrl}
                  title="CAC Document"
                  className="w-full h-80 border rounded mb-4"
                />
                <a
                  href={modalMerchant.cacDocUrl}
                  download
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download Document
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}