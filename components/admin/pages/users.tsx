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
  Users,
  ShoppingCart,
  CreditCard,
  Wallet,
  Search,
  MoreHorizontal,
  MessageCircle,
  UserX,
  Download,
} from "lucide-react";
import { useFetchUsers } from "@/lib/services/merchant/use-fetch-users";

// Demo user data
const demoUsers = [
  {
    id: "USR001",
    username: "john_doe",
    email: "john@example.com",
    phone: "+234 801 234 5678",
    totalOrders: 15,
    loanStatus: "Active",
    walletAccount: "KW123456789",
    status: "Active",
  },
  {
    id: "USR002",
    username: "jane_smith",
    email: "jane@example.com",
    phone: "+234 802 345 6789",
    totalOrders: 8,
    loanStatus: "Pending",
    walletAccount: "KW234567890",
    status: "Active",
  },
  {
    id: "USR003",
    username: "mike_johnson",
    email: "mike@example.com",
    phone: "+234 803 456 7890",
    totalOrders: 23,
    loanStatus: "Completed",
    walletAccount: "KW345678901",
    status: "Active",
  },
  {
    id: "USR004",
    username: "sarah_wilson",
    email: "sarah@example.com",
    phone: "+234 804 567 8901",
    totalOrders: 3,
    loanStatus: "None",
    walletAccount: "KW456789012",
    status: "Inactive",
  },
  {
    id: "USR005",
    username: "david_brown",
    email: "david@example.com",
    phone: "+234 805 678 9012",
    totalOrders: 12,
    loanStatus: "Defaulted",
    walletAccount: "KW567890123",
    status: "Active",
  },
];

export default function UsersAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // const [users, setUsers] = useState(demoUsers);
  const { data, loading } = useFetchUsers();

  const users = data?.data || [];

  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.id.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleMessageUser = (userId: string) => {
    console.log("Message user:", userId);
    // Implement messaging functionality
  };

  const handleDeactivateUser = (userId: string) => {
    // setUsers(
    //   users.map((user) =>
    //     user.id === userId
    //       ? {
    //           ...user,
    //           status: user.status === "Active" ? "Inactive" : "Active",
    //         }
    //       : user
    //   )
    // );
  };

  const exportToCSV = () => {
    const headers = [
      "SN",
      "User ID",
      "Username",
      "Email",
      "Phone",
      "Total Orders",
      "Loan Status",
      "Wallet Account",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...users.map((user, index) =>
        [
          index + 1,
          user.id,
          `${user.firstname} ${user.lastname}`,
          user.email,
          user.phone,
          user._count.orders,
          user.loanApplications[0]?.status || "None",
          user.wallet.accountNumber || "None",
          user.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getLoanStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Defaulted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  // Summary statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "ACTIVE").length;
  const totalOrders = users.reduce((sum, u) => sum + u._count.orders, 0);
  const activeLoans = users.filter(
    (u) => u.loanApplications && u.loanApplications[0]?.status === "Active"
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalOrders}
            </div>
            <p className="text-xs text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {activeLoans}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wallet Accounts
            </CardTitle>
            <Wallet className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              All users have wallets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage all registered users
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username, email, or user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">SN</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Loan Status</TableHead>
                  <TableHead>Wallet Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {user.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell className="text-center">
                      {user._count.orders}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getLoanStatusColor(
                          user.loanApplications[0]?.status
                        )}
                      >
                        {user.loanApplications[0]?.status || "None"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {user.wallet.accountNumber || "None"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleMessageUser(user.id)}
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Message User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            {user.status === "ACTIVE"
                              ? "Deactivate"
                              : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {users?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No users found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
