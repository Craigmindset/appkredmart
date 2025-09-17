"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  UserX,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import {
  MerchantDto,
  useFetchMerchants,
} from "@/lib/services/merchant/use-fetch-merchants";

export default function MerchantAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMerchant, setModalMerchant] = useState<null | MerchantDto>(null);
  const { data, loading } = useFetchMerchants();
  const merchants = data?.data || [];

  const handleViewOrders = (merchantId: string) => {
    // This would typically navigate to a detailed orders view
    console.log(`Viewing orders for merchant: ${merchantId}`);
  };

  console.log({ merchants });
  // Calculate summary stats
  const totalMerchants = merchants?.length;
  const activeMerchants = merchants?.filter(
    (m) => m.firstname === "Active"
  ).length;
  const totalInventory = merchants?.reduce(
    (sum, m) => sum + m?.products.length,
    0
  );
  // const totalRevenue = merchants?.reduce((sum, m) => sum + m?.totalMarkup, 0);
  const totalRevenue = 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Merchants
            </CardTitle>
            <Store className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMerchants}</div>
            <p className="text-xs text-blue-100">
              {activeMerchants} active merchants
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory
            </CardTitle>
            <Package className="h-4 w-4 text-green-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalInventory?.toLocaleString()}
            </div>
            <p className="text-xs text-green-100">
              Products across all merchants
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {merchants
                ?.reduce((sum, m) => {
                  const productOrders = m?.products?.reduce(
                    (pSum, p) => pSum + (p?.orderItem?.length ?? 0),
                    0
                  );
                  return sum + productOrders;
                }, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-white">All-time orders processed</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalRevenue?.toLocaleString()}
            </div>
            <p className="text-xs text-white">Total markup earned</p>
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
                  <TableHead>SN</TableHead>
                  <TableHead>Merchant ID</TableHead>
                  <TableHead>Merchant Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Inventory</TableHead>
                  <TableHead>Total Sold</TableHead>
                  <TableHead>Total Markup (%)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {merchants?.map((merchant, idx) => (
                  <TableRow key={merchant.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell className="font-medium">{merchant.id}</TableCell>
                    <TableCell>
                      {merchant.firstname} {merchant.lastname}
                    </TableCell>
                    <TableCell>
                      {merchant.position?.charAt(0).toUpperCase()}
                      {merchant.position?.slice(1)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{merchant.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {merchant.phone}
                      </div>
                    </TableCell>
                    <TableCell>{merchant?.products.length}</TableCell>
                    <TableCell>
                      {/* {merchant?.totalSold?.toLocaleString()} */}0
                    </TableCell>
                    <TableCell>
                      {/* ₦ */}
                      {merchant?.products.reduce((sum, p) => sum + p.markup, 0)}
                      %
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
                          <DropdownMenuItem
                            onClick={() => setModalMerchant(merchant)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Merchant Doc
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {merchants?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No merchants found matching your search.
              </p>
            </div>
          )}

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
                <h2 className="text-xl font-bold mb-4">
                  Merchant CAC Document
                </h2>
                <iframe
                  src={modalMerchant?.documentMedia.original}
                  title="CAC Document"
                  className="w-full h-80 border rounded mb-4"
                />
                <a
                  href={modalMerchant?.documentMedia.original}
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
  );
}
