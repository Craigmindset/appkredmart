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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Percent,
  Search,
  Download,
  FileText,
  Highlighter,
} from "lucide-react";
import { useAdminFetchRevenueSummary } from "@/lib/services/revenue/use-fetch-revenue-summary";
import { useAdminFetchRevenues } from "@/lib/services/revenue/use-fetch-revenue";
import { upperCaseText } from "@/lib/utils";

// All transactions removed for clean state
type Transaction = {
  id: string;
  date: string;
  type: string;
  merchant: string;
  amount: number;
  markup: number;
  vat: number;
  settlement: number;
  status: string;
};
const demoTransactions: Transaction[] = [];

export default function RevenueAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [highlightedRows, setHighlightedRows] = useState<string[]>([]);

  const filteredTransactions = demoTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      transaction.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const toggleHighlight = (transactionId: string) => {
    setHighlightedRows((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Transaction ID",
      "Date",
      "Type",
      "Merchant",
      "Amount (₦)",
      "Markup (₦)",
      "VAT 7.5% (₦)",
      "Settlement (₦)",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((transaction) =>
        [
          transaction.id,
          transaction.date,
          transaction.type,
          transaction.merchant,
          transaction.amount,
          transaction.markup,
          transaction.vat,
          transaction.settlement,
          transaction.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // This would typically use a library like jsPDF
    console.log("Exporting to PDF...");
    alert(
      "PDF export functionality would be implemented here using a library like jsPDF"
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "Settled":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  const { data: summary } = useAdminFetchRevenueSummary();
  const { data: revenues, isPending: revenueLoading } = useAdminFetchRevenues({
    search: searchTerm,
  });

  // Calculate summary statistics
  // const totalTransactions = filteredTransactions.reduce(
  //   (sum, t) => sum + t.amount,
  //   0
  // );
  // const totalMarkup = filteredTransactions.reduce(
  //   (sum, t) => sum + t.markup,
  //   0
  // );
  // const totalVAT = filteredTransactions.reduce((sum, t) => sum + t.vat, 0);
  // const totalSettlement = filteredTransactions.reduce(
  //   (sum, t) => sum + t.settlement,
  //   0
  // );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Markup</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(summary?.totalMarkup || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Platform earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VAT (7.5%)</CardTitle>
            <Percent className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(summary?.totalVats || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tax collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Merchant Settlement
            </CardTitle>
            <Receipt className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(summary?.merchantSettlement || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Paid to merchants</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Revenue Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage all transactions, settlements, and revenue
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={exportToPDF} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID or merchant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="loan">Loans</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Revenue Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Markup</TableHead>
                  <TableHead className="text-right">VAT (7.5%)</TableHead>
                  <TableHead className="text-right">Settlement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenues?.map((revenue) => (
                  <TableRow
                    key={revenue.id}
                    className={
                      highlightedRows.includes(revenue.id) ? "bg-yellow-50" : ""
                    }
                  >
                    <TableCell className="font-mono text-sm">
                      {revenue.id}
                    </TableCell>
                    <TableCell>
                      {new Date(revenue.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{revenue.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {revenue.order?.merchantOrders
                        .map((merchant) => merchant.merchant.company)
                        .join(", ")}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(revenue.amount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-600">
                      {formatCurrency(revenue.totalMarkup)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-orange-600">
                      {formatCurrency(revenue.vat)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-purple-600">
                      {formatCurrency(revenue.merchantSettlement)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(revenue.status)}>
                        {upperCaseText(revenue.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHighlight(revenue.id)}
                        className={
                          highlightedRows.includes(revenue.id)
                            ? "bg-yellow-100"
                            : ""
                        }
                      >
                        <Highlighter className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* {filteredTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className={
                      highlightedRows.includes(transaction.id)
                        ? "bg-yellow-50"
                        : ""
                    }
                  >
                    <TableCell className="font-mono text-sm">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.merchant}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-blue-600">
                      {formatCurrency(transaction.markup)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-orange-600">
                      {formatCurrency(transaction.vat)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-purple-600">
                      {formatCurrency(transaction.settlement)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHighlight(transaction.id)}
                        className={
                          highlightedRows.includes(transaction.id)
                            ? "bg-yellow-100"
                            : ""
                        }
                      >
                        <Highlighter className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </div>

          {!revenueLoading && revenues?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No transactions found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
