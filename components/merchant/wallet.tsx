"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Copy,
  Download,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Send,
  WalletIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useMerchantWallet } from "@/lib/services/wallet/use-merchant-wallet";
import { useMerchantWalletTransactions } from "@/lib/services/wallet/use-merchant-wallet-history";
import { upperCaseText } from "@/lib/utils";
import { formatDate } from "date-fns";
import { useGetBanks } from "@/lib/services/use-get-banks";
import { useAccountNumberValidate } from "@/lib/services/use-account-validate";
import { useMerchantWithdraw } from "@/lib/services/payments/merchant-withdraw";
import { AxiosError } from "axios";
import { useMerchantWithdrawPin } from "@/lib/services/payments/merchant-withdraw-pin";

// Demo transaction data
const demoTransactions = [
  {
    id: "1",
    type: "Credit",
    description: "Sale Payment - ORD-2024-001",
    amount: 1250000,
    date: "2024-01-15",
    time: "14:30",
    status: "Completed",
    reference: "TXN-12345678",
  },
  {
    id: "2",
    type: "Debit",
    description: "Withdrawal to GTBank",
    amount: -500000,
    date: "2024-01-14",
    time: "10:15",
    status: "Completed",
    reference: "TXN-12345677",
  },
  {
    id: "3",
    type: "Credit",
    description: "Sale Payment - ORD-2024-002",
    amount: 980000,
    date: "2024-01-14",
    time: "16:45",
    status: "Completed",
    reference: "TXN-12345676",
  },
  {
    id: "4",
    type: "Debit",
    description: "Platform Fee",
    amount: -25000,
    date: "2024-01-13",
    time: "09:00",
    status: "Completed",
    reference: "TXN-12345675",
  },
  {
    id: "5",
    type: "Credit",
    description: "Sale Payment - ORD-2024-003",
    amount: 750000,
    date: "2024-01-13",
    time: "12:20",
    status: "Completed",
    reference: "TXN-12345674",
  },
];

// Nigerian banks list
const nigerianBanks = [
  "Access Bank",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "Guaranty Trust Bank",
  "United Bank for Africa",
  "Zenith Bank",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "Union Bank",
  "Wema Bank",
  "Polaris Bank",
  "Keystone Bank",
  "FCMB",
  "Heritage Bank",
  "Jaiz Bank",
  "SunTrust Bank",
  "Providus Bank",
  "Titan Trust Bank",
];

export function Wallet() {
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { data: wallet } = useMerchantWallet();
  const { data: transactions } = useMerchantWalletTransactions();
  const { data: banks } = useGetBanks();
  const { mutateAsync: withdrawWalletAsync } = useMerchantWithdraw();
  const { mutateAsync: withdrawWalletPinAsync, isPending: loadingPin } =
    useMerchantWithdrawPin();
  const [withdrawalData, setWithdrawalData] = useState({
    receiverBank: "",
    receiverAccount: "",
    receiverName: "",
    amount: "",
  });
  const {
    mutateAsync,
    data: accountValidated,
    loading: validatingAccountNumber,
  } = useAccountNumberValidate();
  const [transferPin, setTransferPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleWithdrawSubmit = async () => {
    if (
      !withdrawalData.receiverBank ||
      !withdrawalData.receiverAccount ||
      !withdrawalData.amount
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (Number.parseFloat(withdrawalData.amount) > (wallet?.balance || 0)) {
      toast.error("Insufficient balance");
      return;
    }

    // Send withdraw data if successful enable pinModal and disable withdrawModal
    await withdrawWalletAsync({
      amount: withdrawalData.amount,
      receiverAccount: withdrawalData.receiverAccount,
      receiverBank: withdrawalData.receiverBank,
      // currency: "NGN",
      // method: "bank_transfer",
      // accountDetails: JSON.stringify({
      //   bank: withdrawalData.receiverBank,
      //   account_number: withdrawalData.receiverAccount,
      //   account_name: accountValidated?.account_name,
      // }),
      // pin: "", // PIN will be handled in the next modal
    })
      .then((res) => {
        toast.success(
          "Withdrawal initiated. Please enter your PIN to confirm."
        );
        setShowWithdrawModal(false);
        setShowPinModal(true);
      })
      .catch((err) => {
        // Error handling is done in the mutation's onError
        if (err instanceof AxiosError) {
          const message = err.response?.data.message;
          const description = message || "An error occured";

          if (description) {
            toast.error(`An error occured!`, {
              description,
            });
          }
        } else if (err instanceof Error) {
          toast.error(err.message);
        }
      });
  };

  const handleAccountNumberVerification = useCallback(
    async (receiverAccount: string, receiverBank: string) => {
      await mutateAsync({
        account_number: receiverAccount,
        bank_code: receiverBank,
      });
    },
    []
  );

  useEffect(() => {
    if (
      withdrawalData.receiverBank &&
      withdrawalData.receiverAccount &&
      withdrawalData.receiverAccount.length > 9
    ) {
      handleAccountNumberVerification(
        withdrawalData.receiverAccount,
        withdrawalData.receiverBank
      );
    }
  }, [withdrawalData.receiverAccount, withdrawalData.receiverBank]);

  const handlePinSubmit = async () => {
    if (transferPin.length !== 4) {
      toast.error("Please enter a 4-digit PIN");
      return;
    }

    // setIsLoading(true);
    await withdrawWalletPinAsync({ pin: transferPin })
      .then(() => {
        setShowPinModal(false);
        setShowSuccessModal(true);

        // Reset form
        setWithdrawalData({
          receiverBank: "",
          receiverAccount: "",
          receiverName: "",
          amount: "",
        });
        setTransferPin("");
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          const message = err.response?.data.message;
          const description = message || "An error occured";

          if (description) {
            toast.error(`An error occured!`, {
              description,
            });
          }
        } else if (err instanceof Error) {
          toast.error(err.message);
        }
        setTransferPin("");
      });

    // // Simulate PIN verification
    // setTimeout(() => {
    //   if (transferPin === "1234") {
    //     // Demo PIN
    //     setIsLoading(false);
    //     setShowPinModal(false);
    //     setShowSuccessModal(true);

    //     // Reset form
    //     setWithdrawalData({
    //       receiverBank: "",
    //       receiverAccount: "",
    //       receiverName: "",
    //       amount: "",
    //     });
    //     setTransferPin("");

    //     // Auto close success modal and redirect
    //     setTimeout(() => {
    //       setShowSuccessModal(false);
    //       toast.success("Transfer completed successfully");
    //     }, 3000);
    //   } else {
    //     setIsLoading(false);
    //     toast.error("Incorrect PIN. Please try again.");
    //     setTransferPin("");
    //   }
    // }, 2000);
  };

  const downloadReceipt = (transaction: any) => {
    // Simulate receipt download
    toast.success(`Receipt for ${transaction.reference} downloaded`);
  };

  const getTransactionColor = (type: string) => {
    return type === "Credit"
      ? "bg-green-100 text-green-800 hover:bg-green-200"
      : "bg-red-100 text-red-800 hover:bg-red-200";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground mt-2">
          Manage your merchant wallet and transactions
        </p>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Balance Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <WalletIcon className="h-5 w-5" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold">
                    {showBalance
                      ? `₦${(wallet?.balance || 0).toLocaleString()}`
                      : "₦****"}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="h-8 w-8 p-0"
                  >
                    {showBalance ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Available balance
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowWithdrawModal(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        {/*<Card>
          <CardHeader className="pb-4">
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Account Name
              </Label>
              <div className="flex items-center justify-between mt-1 p-2 bg-muted rounded-md">
                <span className="text-sm font-medium truncate">
                  {wallet?.accountName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(wallet?.accountName || "", "Account name")
                  }
                  className="h-6 w-6 p-0 ml-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Account Number
              </Label>
              <div className="flex items-center justify-between mt-1 p-2 bg-muted rounded-md">
                <span className="text-sm font-mono font-medium">
                  {wallet?.accountNumber}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      wallet?.accountNumber || "",
                      "Account number"
                    )
                  }
                  className="h-6 w-6 p-0 ml-2"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Bank Name
              </Label>
              <div className="mt-1 p-2 bg-muted rounded-md">
                <span className="text-sm font-medium">{wallet?.bankName}</span>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Date & Time</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Reference</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(transactions || []).map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        {/* <div className="font-medium">{transaction.date}</div> */}
                        <div className="font-medium">
                          {formatDate(transaction.createdAt, "yyyy-MM-dd")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt, "HH:mm")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getTransactionColor(
                          upperCaseText(transaction.type)
                        )}
                      >
                        {upperCaseText(transaction.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate" title={transaction.description}>
                        {transaction.description}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.reference}
                    </TableCell>
                    <TableCell className="font-semibold">
                      <span
                        className={
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        ₦{Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        {transaction.status}
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
                            onClick={() => downloadReceipt(transaction)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Transfer money from your wallet to your bank account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="receiverBank">Select Receiver Bank</Label>
              <div className="relative">
                {/* <Input
                  id="receiverBank"
                  placeholder="Type bank name or select from dropdown"
                  value={withdrawalData.receiverBank}
                  onChange={(e) =>
                    setWithdrawalData((prev) => ({
                      ...prev,
                      receiverBank: e.target.value,
                    }))
                  }
                  className="pr-10"
                /> */}
                <Select
                  value={withdrawalData.receiverBank}
                  onValueChange={(value) =>
                    setWithdrawalData((prev) => ({
                      ...prev,
                      receiverBank: value,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* {nigerianBanks.map((bank) => (
                      <SelectItem key={bank} value={bank}>
                        {bank}
                      </SelectItem>
                    ))} */}
                    {banks?.map((bank) => (
                      <SelectItem key={bank.id} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="receiverAccount">Account Number *</Label>
              <Input
                id="receiverAccount"
                placeholder="Enter account number"
                value={withdrawalData.receiverAccount}
                onChange={(e) =>
                  setWithdrawalData((prev) => ({
                    ...prev,
                    receiverAccount: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="receiverName">Account Name</Label>
              <div className="relative">
                <Input
                  id="receiverName"
                  placeholder="Account holder name"
                  // value={withdrawalData.receiverName}
                  value={accountValidated?.account_name || ""}
                  readOnly
                  disabled
                  // onChange={(e) =>
                  //   setWithdrawalData((prev) => ({
                  //     ...prev,
                  //     receiverName: e.target.value,
                  //   }))
                  // }
                />
                {validatingAccountNumber && (
                  <div className="absolute right-2 bottom-1/2 translate-y-1/2">
                    <Loader2 className=" animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={withdrawalData.amount}
                onChange={(e) =>
                  setWithdrawalData((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
              />
              <div className="text-sm text-muted-foreground mt-1">
                Available: ₦{(wallet?.balance || 0).toLocaleString()}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowWithdrawModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleWithdrawSubmit}>Confirm Transfer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PIN Modal */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Enter Transfer PIN</DialogTitle>
            <DialogDescription>
              Please enter your 4-digit transfer PIN to complete the transaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pin">Transfer PIN</Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                value={transferPin}
                onChange={(e) =>
                  setTransferPin(e.target.value.replace(/\D/g, ""))
                }
                className="text-center text-lg tracking-widest"
              />
              <div className="text-xs text-muted-foreground mt-1 text-center">
                Demo PIN: 123456
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPinModal(false)}
                disabled={loadingPin}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePinSubmit}
                disabled={loadingPin || transferPin.length !== 6}
              >
                {loadingPin ? "Verifying..." : "Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              Transfer Successful!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your withdrawal has been processed successfully
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              You will be redirected to your wallet shortly...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
