"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, UserX, Store, Package, ShoppingCart, DollarSign } from "lucide-react"

// Demo merchant data
const merchantsData = [
  {
    id: "KM001234",
    name: "TechHub Electronics",
    email: "techhub@example.com",
    phone: "+234 801 234 5678",
    totalInventory: 245,
    totalOrders: 1250,
    totalSold: 980,
    totalMarkup: 125000,
    status: "Active",
    joinDate: "2024-01-15",
    category: "Electronics",
  },
  {
    id: "KM001235",
    name: "Fashion Forward",
    email: "fashion@example.com",
    phone: "+234 802 345 6789",
    totalInventory: 180,
    totalOrders: 890,
    totalSold: 720,
    totalMarkup: 89000,
    status: "Active",
    joinDate: "2024-02-20",
    category: "Fashion",
  },
  {
    id: "KM001236",
    name: "Home Essentials",
    email: "home@example.com",
    phone: "+234 803 456 7890",
    totalInventory: 320,
    totalOrders: 1580,
    totalSold: 1200,
    totalMarkup: 156000,
    status: "Active",
    joinDate: "2024-01-08",
    category: "Home & Kitchen",
  },
  {
    id: "KM001237",
    name: "Mobile World",
    email: "mobile@example.com",
    phone: "+234 804 567 8901",
    totalInventory: 95,
    totalOrders: 650,
    totalSold: 520,
    totalMarkup: 78000,
    status: "Inactive",
    joinDate: "2024-03-12",
    category: "Phones and Tablets",
  },
  {
    id: "KM001238",
    name: "Sports Central",
    email: "sports@example.com",
    phone: "+234 805 678 9012",
    totalInventory: 150,
    totalOrders: 420,
    totalSold: 380,
    totalMarkup: 45000,
    status: "Active",
    joinDate: "2024-02-28",
    category: "Lifestyle",
  },
]

export default function MerchantAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [merchants, setMerchants] = useState(merchantsData)

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeactivate = (merchantId: string) => {
    setMerchants((prev) =>
      prev.map((merchant) =>
        merchant.id === merchantId
          ? { ...merchant, status: merchant.status === "Active" ? "Inactive" : "Active" }
          : merchant,
      ),
    )
  }

  const handleViewOrders = (merchantId: string) => {
    // This would typically navigate to a detailed orders view
    console.log(`Viewing orders for merchant: ${merchantId}`)
  }

  // Calculate summary stats
  const totalMerchants = merchants.length
  const activeMerchants = merchants.filter((m) => m.status === "Active").length
  const totalInventory = merchants.reduce((sum, m) => sum + m.totalInventory, 0)
  const totalRevenue = merchants.reduce((sum, m) => sum + m.totalMarkup, 0)

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
            <div className="text-2xl font-bold">{totalMerchants}</div>
            <p className="text-xs text-muted-foreground">{activeMerchants} active merchants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInventory.toLocaleString()}</div>
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
              {merchants.reduce((sum, m) => sum + m.totalOrders, 0).toLocaleString()}
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
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant ID</TableHead>
                  <TableHead>Merchant Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Total Inventory</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Total Sold</TableHead>
                  <TableHead>Total Markup</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium">{merchant.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{merchant.name}</div>
                        <div className="text-sm text-muted-foreground">{merchant.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{merchant.category}</Badge>
                    </TableCell>
                    <TableCell>{merchant.totalInventory.toLocaleString()}</TableCell>
                    <TableCell>{merchant.totalOrders.toLocaleString()}</TableCell>
                    <TableCell>{merchant.totalSold.toLocaleString()}</TableCell>
                    <TableCell>₦{merchant.totalMarkup.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={merchant.status === "Active" ? "default" : "secondary"}
                        className={
                          merchant.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {merchant.status}
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
                          <DropdownMenuItem onClick={() => handleViewOrders(merchant.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Orders
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeactivate(merchant.id)}
                            className={merchant.status === "Active" ? "text-red-600" : "text-green-600"}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            {merchant.status === "Active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredMerchants.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No merchants found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
