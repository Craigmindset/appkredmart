"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Copy, Loader2 } from "lucide-react"
import { useWallet, type CurrencyCode } from "@/store/wallet-store"
import { useAuth } from "@/store/auth-store"
import { useToast } from "@/hooks/use-toast"
import { formatMoneyColon } from "@/lib/currency"

type NetworkCode = "AIRTEL" | "GLO" | "MTN"

const NETWORKS: { code: NetworkCode; name: string; logo: string }[] = [
  { code: "AIRTEL", name: "Airtel", logo: "/placeholder.svg?height=16&width=16" },
  { code: "GLO", name: "Glo", logo: "/placeholder.svg?height=16&width=16" },
  { code: "MTN", name: "MTN", logo: "/placeholder.svg?height=16&width=16" },
]

const DATA_PLANS: { code: NetworkCode; label: string; price: number }[] = [
  { code: "AIRTEL", label: "250MB Night Plan (12–5am)", price: 100 },
  { code: "AIRTEL", label: "1GB Social Plan (3 days)", price: 350 },
  { code: "AIRTEL", label: "1.5GB (Monthly)", price: 1000 },
  { code: "GLO", label: "1GB (Daily)", price: 300 },
  { code: "GLO", label: "3.9GB (2 Weeks)", price: 1000 },
  { code: "MTN", label: "500MB (Daily)", price: 200 },
  { code: "MTN", label: "1.5GB (Monthly)", price: 1200 },
]

export default function WalletPage() {
  const { toast } = useToast()
  const user = useAuth((s) => s.user)

  const balance = useWallet((s) => s.balance)
  const currency = useWallet((s) => s.currency)
  const setCurrency = useWallet((s) => s.setCurrency)
  const addFunds = useWallet((s) => s.addFunds)
  const deduct = useWallet((s) => s.deduct)
  const accountNumber = useWallet((s) => s.accountNumber)
  const accountName = useWallet((s) => s.accountName)
  const setAccountName = useWallet((s) => s.setAccountName)
  const bankName = useWallet((s) => s.bankName)
  const bankLogo = useWallet((s) => s.bankLogo)

  // Keep account name in sync with profile if available
  useEffect(() => {
    if (user?.firstName) {
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ")
      if (name && name !== accountName) setAccountName(name)
    }
  }, [user, accountName, setAccountName])

  const [tab, setTab] = useState<"airtime-data" | "bills">("airtime-data")
  const [mode, setMode] = useState<"airtime" | "data">("airtime")

  // Airtime state
  const [airNetwork, setAirNetwork] = useState<NetworkCode>("MTN")
  const [airPhone, setAirPhone] = useState("")
  const [airAmount, setAirAmount] = useState<number | "">("")
  const [airLoading, setAirLoading] = useState(false)

  // Data state
  const [dataNetwork, setDataNetwork] = useState<NetworkCode>("MTN")
  const [dataPhone, setDataPhone] = useState("")
  const [planId, setPlanId] = useState<string>("")
  const [dataLoading, setDataLoading] = useState(false)

  const dataPlansForNetwork = useMemo(() => DATA_PLANS.filter((p) => p.code === dataNetwork), [dataNetwork])

  const symbolPreview = useMemo(() => formatMoneyColon(balance, currency), [balance, currency])

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: "Copied", description: `${label} copied to clipboard` })
    } catch {
      toast({ title: "Copy failed", description: "Please try again", variant: "destructive" })
    }
  }

  const handleAirtimePurchase = async () => {
    const amount = typeof airAmount === "number" ? airAmount : Number(airAmount)
    if (!/^\d{11}$/.test(airPhone)) {
      toast({ title: "Invalid phone", description: "Enter an 11-digit phone number", variant: "destructive" })
      return
    }
    if (!Number.isFinite(amount) || amount < 100 || amount > 50000) {
      toast({
        title: "Invalid amount",
        description: "Amount must be between ₦100 and ₦50,000",
        variant: "destructive",
      })
      return
    }
    if (amount > balance) {
      toast({ title: "Insufficient funds", description: "Top up your wallet first", variant: "destructive" })
      return
    }
    setAirLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setAirLoading(false)
    const ok = deduct(amount)
    if (ok) {
      toast({
        title: "Airtime purchased",
        description: `Sent ${formatMoneyColon(amount, currency)} to ${airPhone} (${airNetwork})`,
      })
      setAirAmount("")
      setAirPhone("")
    }
  }

  const handleDataPurchase = async () => {
    if (!/^\d{11}$/.test(dataPhone)) {
      toast({ title: "Invalid phone", description: "Enter an 11-digit phone number", variant: "destructive" })
      return
    }
    const plan = dataPlansForNetwork.find((p) => p.label === planId)
    if (!plan) {
      toast({ title: "Select a data plan", description: "Choose a plan to continue", variant: "destructive" })
      return
    }
    if (plan.price > balance) {
      toast({ title: "Insufficient funds", description: "Top up your wallet first", variant: "destructive" })
      return
    }
    setDataLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setDataLoading(false)
    const ok = deduct(plan.price)
    if (ok) {
      toast({
        title: "Data purchased",
        description: `Sent ${plan.label} for ${formatMoneyColon(plan.price, currency)} to ${dataPhone} (${dataNetwork})`,
      })
      setPlanId("")
      setDataPhone("")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Wallet</CardTitle>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Currency</Label>
            <Select value={currency} onValueChange={(v: CurrencyCode) => setCurrency(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="NGN" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGN">NGN (₦)</SelectItem>
                <SelectItem value="GHA">GHA (₵)</SelectItem>
                <SelectItem value="GB">GB (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold">{symbolPreview}</div>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" onClick={() => addFunds(5000)}>
              Add ₦5,000
            </Button>
            {/* Withdraw button removed as requested */}
          </div>

          <Separator className="my-6" />

          {/* Account info */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src={bankLogo || "/placeholder.svg"} alt="Bank logo" className="h-7 w-7 rounded object-contain" />
              <div>
                <div className="text-sm font-medium">{bankName}</div>
                <div className="text-xs text-muted-foreground">Linked wallet account</div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <div className="font-mono text-sm">{accountNumber}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copy(accountNumber, "Account number")}
                  aria-label="Copy account number"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm">{accountName}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => copy(accountName, "Account name")}
                  aria-label="Copy account name"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Services */}
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
            <TabsList>
              <TabsTrigger value="airtime-data">Data & Airtime</TabsTrigger>
              <TabsTrigger value="bills">Pay Bills</TabsTrigger>
            </TabsList>

            <TabsContent value="airtime-data" className="mt-4">
              <div className="mb-4">
                <Label className="mb-2 block text-sm font-medium">Purchase Type</Label>
                <RadioGroup className="flex gap-4" value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="opt-airtime" value="airtime" />
                    <Label htmlFor="opt-airtime">Buy Airtime</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id="opt-data" value="data" />
                    <Label htmlFor="opt-data">Buy Mobile Data</Label>
                  </div>
                </RadioGroup>
              </div>

              {mode === "airtime" ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Network */}
                  <div>
                    <Label className="mb-1 block text-sm font-medium">Network</Label>
                    <Select value={airNetwork} onValueChange={(v: NetworkCode) => setAirNetwork(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        {NETWORKS.map((n) => (
                          <SelectItem key={n.code} value={n.code}>
                            <span className="inline-flex items-center gap-2">
                              <img
                                src={n.logo || "/placeholder.svg"}
                                alt={n.name}
                                className="h-4 w-4 rounded object-contain"
                              />
                              {n.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Phone */}
                  <div>
                    <Label className="mb-1 block text-sm font-medium">Phone Number</Label>
                    <Input
                      inputMode="numeric"
                      maxLength={11}
                      placeholder="Enter 11-digit number"
                      value={airPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 11)
                        setAirPhone(val)
                      }}
                    />
                  </div>
                  {/* Amount */}
                  <div>
                    <Label className="mb-1 block text-sm font-medium">Amount (₦100–₦50,000)</Label>
                    <Input
                      inputMode="numeric"
                      placeholder="e.g. 1000"
                      value={airAmount}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "")
                        setAirAmount(raw ? Number(raw) : "")
                      }}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Button className="w-full md:w-auto" onClick={handleAirtimePurchase} disabled={airLoading}>
                      {airLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Purchasing…
                        </span>
                      ) : (
                        "Purchase"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Network */}
                  <div>
                    <Label className="mb-1 block text-sm font-medium">Network</Label>
                    <Select value={dataNetwork} onValueChange={(v: NetworkCode) => setDataNetwork(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        {NETWORKS.map((n) => (
                          <SelectItem key={n.code} value={n.code}>
                            <span className="inline-flex items-center gap-2">
                              <img
                                src={n.logo || "/placeholder.svg"}
                                alt={n.name}
                                className="h-4 w-4 rounded object-contain"
                              />
                              {n.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Phone */}
                  <div>
                    <Label className="mb-1 block text-sm font-medium">Phone Number</Label>
                    <Input
                      inputMode="numeric"
                      maxLength={11}
                      placeholder="Enter 11-digit number"
                      value={dataPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 11)
                        setDataPhone(val)
                      }}
                    />
                  </div>
                  {/* Plan */}
                  <div>
                    <Label className="mb-1 block text-sm font-medium">Data Plan</Label>
                    <Select value={planId} onValueChange={setPlanId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataPlansForNetwork.map((p) => (
                          <SelectItem key={p.label} value={p.label}>
                            <span className="inline-flex justify-between gap-3 w-full">
                              <span>{p.label}</span>
                              <span className="text-muted-foreground">{formatMoneyColon(p.price, currency)}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-3">
                    <Button className="w-full md:w-auto" onClick={handleDataPurchase} disabled={dataLoading}>
                      {dataLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Purchasing…
                        </span>
                      ) : (
                        "Purchase Data"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bills" className="mt-4">
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                Pay Bills is coming soon. You’ll be able to pay electricity, TV, internet and more directly from your
                wallet.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
