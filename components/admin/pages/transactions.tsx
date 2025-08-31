"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminGetTransactions } from "@/lib/services/transactions/use-admin-get-transactions";
import { safeParseJson, upperCaseText } from "@/lib/utils";
import { Download, MoreHorizontal, Search, Send } from "lucide-react";
import { useMemo, useState } from "react";

// --- MOCK DATA ---
const mockOrdersData = Array.from({ length: 50 }, (_, i) => ({
  transactionId: `TRN${1000 + i}`,
  orderId: `ORD${2000 + i}`,
  merchant: i % 2 === 0 ? "Slot" : "Gbam Inc.",
  username: `user${i + 1}`,
  productName: `Vintage T-Shirt ${i + 1}`,
  qty: (i % 5) + 1,
  paymentStatus: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Pending" : "Failed",
  paymentMethod: i % 3 === 0 ? "Wallet" : i % 3 === 1 ? "BNPL" : "Card",
  deliveryStatus:
    i % 3 === 0 ? "Delivered" : i % 3 === 1 ? "Shipped" : "Processing",
  amount: 5000 + i * 100,
}));

const mockLoansData = Array.from({ length: 30 }, (_, i) => ({
  loanId: `LOAN${3000 + i}`,
  applicantName: `Applicant ${i + 1}`,
  provider: `Provider ${String.fromCharCode(65 + (i % 3))}`,
  loanAmount: 50000 + i * 1000,
  repaymentAmount: 55000 + i * 1100,
  interest: "10%",
  status:
    i % 4 === 0
      ? "Approved"
      : i % 4 === 1
      ? "Pending"
      : i % 4 === 2
      ? "Rejected"
      : "Disbursed",
}));

const mockMerchantsData = Array.from({ length: 40 }, (_, i) => ({
  transactionId: `TRNM${4000 + i}`,
  merchantId: `MERCH${5000 + (i % 2)}`,
  merchantName: i % 2 === 0 ? "Slot" : "Gbam Inc.",
  productSold: `Smartwatch Series ${i + 1}`,
  category: `Electronics`,
  amount: 10000 + i * 1000,
  transactionDate: new Date(
    Date.now() - i * 24 * 60 * 60 * 1000
  ).toLocaleDateString(),
  settleStatus:
    i % 4 === 0
      ? "Paid"
      : i % 4 === 1
      ? "Unpaid"
      : i % 4 === 2
      ? "Pending"
      : "Dispute",
}));

const mockWalletsData = Array.from({ length: 60 }, (_, i) => ({
  transactionId: `TRNW${6000 + i}`,
  username: `user${i + 1}`,
  transactionType:
    i % 4 === 0
      ? "Airtime"
      : i % 4 === 1
      ? "Data"
      : i % 4 === 2
      ? "Purchase"
      : "Funding",
  amount: 500 + i * 50,
  date: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toLocaleString(),
  status: i % 3 === 0 ? "Success" : i % 3 === 1 ? "Failed" : "Pending",
}));

const loanProviders = ["All", "Provider A", "Provider B", "Provider C"];
const merchantNames = ["All", "Slot", "Gbam Inc."];
const ITEMS_PER_PAGE = 20;

// Currency formatter for Naira
const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

// --- TABLE COMPONENTS ---

const OrdersTable = ({
  searchQuery,
  currentPage,
}: {
  searchQuery: string;
  currentPage: number;
}) => {
  const { data: transationData, isPending } = useAdminGetTransactions({
    search: searchQuery,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const orderTransactions = transationData?.data || [];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead>Merchant</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Delivery</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending &&
          !orderTransactions.length &&
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-b">
              {Array.from({ length: 10 }).map((_, j) => (
                <TableCell key={j} className="p-2">
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        {orderTransactions.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.order.transaction[0]?.ref}</TableCell>
            <TableCell>{order.order.orderId}</TableCell>
            <TableCell>
              <div className="flex gap-1">
                {order.order.merchantOrders.map((merchant) => (
                  <Badge>{merchant.merchant.company}</Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {order.user.firstname} {order.user.lastname}
            </TableCell>
            <TableCell>{safeParseJson(order.meta)?.details}</TableCell>
            <TableCell>
              {order.order.items.reduce((acc, item) => item.quantity + acc, 0)}
            </TableCell>
            <TableCell className="font-medium">
              {formatNaira(order.amount)}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  upperCaseText(order.order.paymentStatus) === "Paid"
                    ? "default"
                    : upperCaseText(order.order.paymentStatus) === "Pending"
                    ? "secondary"
                    : "destructive"
                }
                className={
                  upperCaseText(order.order.paymentStatus) === "Paid"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : upperCaseText(order.order.paymentStatus) === "Pending"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : ""
                }
              >
                {upperCaseText(order.order.paymentStatus)}
              </Badge>
              <div className="text-xs text-muted-foreground">
                {upperCaseText(order.order.paymentMethod)}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  upperCaseText(order.order.delivery) === "Delivered"
                    ? "default"
                    : "outline"
                }
                className={
                  upperCaseText(order.order.delivery) === "Delivered"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : ""
                }
              >
                {upperCaseText(order.order.delivery)}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      alert(`Resending receipt for ${order.order.orderId}`)
                    }
                  >
                    Resend Receipt
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      alert(`Downloading receipt for ${order.order.orderId}`)
                    }
                  >
                    Download Receipt
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const LoansTable = ({ data, searchQuery, currentPage }) => {
  const [providerFilter, setProviderFilter] = useState("All");
  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          (providerFilter === "All" || item.provider === providerFilter) &&
          item.loanId.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [data, searchQuery, providerFilter]
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="my-4">
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by provider..." />
          </SelectTrigger>
          <SelectContent>
            {loanProviders.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loan ID</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Repayment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((loan) => (
            <TableRow key={loan.loanId}>
              <TableCell>{loan.loanId}</TableCell>
              <TableCell>{loan.applicantName}</TableCell>
              <TableCell>{loan.provider}</TableCell>
              <TableCell className="font-medium">
                {formatNaira(loan.loanAmount)}
              </TableCell>
              <TableCell className="font-medium">
                {formatNaira(loan.repaymentAmount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    loan.status === "Approved" || loan.status === "Disbursed"
                      ? "default"
                      : loan.status === "Pending"
                      ? "secondary"
                      : "destructive"
                  }
                  className={
                    loan.status === "Approved" || loan.status === "Disbursed"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : loan.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : ""
                  }
                >
                  {loan.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Send className="mr-2 h-4 w-4" />
                        <span>Broadcast</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() =>
                              alert(`Broadcast sent to ${loan.applicantName}`)
                            }
                          >
                            To this user
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              alert(
                                `Broadcast sent to all users with loans from ${loan.provider}`
                              )
                            }
                          >
                            To all users
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const MerchantsTable = ({
  data,
  searchQuery,
  currentPage,
  onFilterByMerchant,
}) => {
  const [merchantFilter, setMerchantFilter] = useState("All");
  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          (merchantFilter === "All" || item.merchantName === merchantFilter) &&
          (item.transactionId
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
            item.merchantId.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [data, searchQuery, merchantFilter]
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="my-4">
        <Select value={merchantFilter} onValueChange={setMerchantFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by merchant..." />
          </SelectTrigger>
          <SelectContent>
            {merchantNames.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Product Sold</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Settle Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((merchant) => (
            <TableRow key={merchant.transactionId}>
              <TableCell>{merchant.transactionId}</TableCell>
              <TableCell>
                <div>{merchant.merchantName}</div>
                <div className="text-xs text-muted-foreground">
                  {merchant.merchantId}
                </div>
              </TableCell>
              <TableCell>
                <div>{merchant.productSold}</div>
                <div className="text-xs text-muted-foreground">
                  {merchant.category}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {formatNaira(merchant.amount)}
              </TableCell>
              <TableCell>{merchant.transactionDate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    merchant.settleStatus === "Paid"
                      ? "default"
                      : merchant.settleStatus === "Pending"
                      ? "secondary"
                      : merchant.settleStatus === "Unpaid"
                      ? "outline"
                      : "destructive"
                  }
                  className={
                    merchant.settleStatus === "Paid"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : merchant.settleStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : ""
                  }
                >
                  {merchant.settleStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterByMerchant(merchant.merchantId)}
                >
                  View Merchant
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const WalletsTable = ({ data, searchQuery, currentPage }) => {
  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          item.transactionId
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [data, searchQuery]
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedData.map((wallet) => (
          <TableRow key={wallet.transactionId}>
            <TableCell>{wallet.transactionId}</TableCell>
            <TableCell>{wallet.username}</TableCell>
            <TableCell>{wallet.transactionType}</TableCell>
            <TableCell className="font-medium">
              {formatNaira(wallet.amount)}
            </TableCell>
            <TableCell>{wallet.date}</TableCell>
            <TableCell>
              <Badge
                variant={
                  wallet.status === "Success"
                    ? "default"
                    : wallet.status === "Pending"
                    ? "secondary"
                    : "destructive"
                }
                className={
                  wallet.status === "Success"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : wallet.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : ""
                }
              >
                {wallet.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// --- MAIN COMPONENT ---

export default function TransactionsAdminPage() {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [merchantIdFilter, setMerchantIdFilter] = useState<string | null>(null);

  const handleDownloadStatement = () => {
    // For a real implementation, you would use a library like `react-csv` or `jspdf`
    // to generate a downloadable file from the currently filtered data.
    // The file would be stamped with the current date and a "KREDMART" logo/watermark.
    alert(
      "Statement download initiated. This would generate a CSV/PDF of the current view."
    );
  };

  const handleFilterByMerchant = (merchantId: string) => {
    setActiveTab("merchants");
    setSearchQuery(merchantId);
    alert(`Filtering all transactions for Merchant ID: ${merchantId}`);
  };

  const dataMap = {
    orders: mockOrdersData,
    loans: mockLoansData,
    merchants: mockMerchantsData,
    wallets: mockWalletsData,
  };

  const totalPages = Math.ceil(
    (dataMap[activeTab]?.length || 0) / ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Search, filter, and manage all transactions across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Transaction, Merchant, or Order ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Button
              onClick={handleDownloadStatement}
              className="w-full md:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Statement
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setCurrentPage(1);
          setSearchQuery("");
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
          >
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="loans"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Loans
          </TabsTrigger>
          <TabsTrigger
            value="merchants"
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            Merchants
          </TabsTrigger>
          <TabsTrigger
            value="wallets"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            Wallets
          </TabsTrigger>
        </TabsList>

        <Card className="mt-4">
          <CardContent className="p-0">
            <TabsContent value="orders" className="m-0">
              <OrdersTable
                searchQuery={searchQuery}
                currentPage={currentPage}
              />
            </TabsContent>
            <TabsContent value="loans" className="m-0">
              <LoansTable
                data={mockLoansData}
                searchQuery={searchQuery}
                currentPage={currentPage}
              />
            </TabsContent>
            <TabsContent value="merchants" className="m-0">
              <MerchantsTable
                data={mockMerchantsData}
                searchQuery={searchQuery}
                currentPage={currentPage}
                onFilterByMerchant={handleFilterByMerchant}
              />
            </TabsContent>
            <TabsContent value="wallets" className="m-0">
              <WalletsTable
                data={mockWalletsData}
                searchQuery={searchQuery}
                currentPage={currentPage}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      {/* <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                isActive={currentPage === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((p) => Math.min(totalPages, p + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </div>
  );
}
