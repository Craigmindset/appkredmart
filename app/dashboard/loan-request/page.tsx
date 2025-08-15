"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { loanProviders, type LoanProvider } from "@/lib/loan-providers"

const BANNER_URL =
  "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/young-african-ladies-viewing-something-their-mobile-phones-while-carrying-shopping-bags.png"

export default function LoanRequestPage() {
  const [step, setStep] = useState<"start" | "select">("start")
  const [selectedName, setSelectedName] = useState<string>(loanProviders[0].name)
  const router = useRouter()

  const selected: LoanProvider = useMemo(
    () => loanProviders.find((p) => p.name === selectedName) || loanProviders[0],
    [selectedName],
  )

  const onApply = () => {
    // If your provider URL is external, consider window.location.assign(selected.applyUrl)
    router.push(selected.applyUrl)
  }

  // Safe logo fallback so src is never an empty string
  const logoSrc =
    typeof selected.logo === "string" && selected.logo.trim().length > 0
      ? selected.logo
      : "/placeholder.svg?height=60&width=180"

  return (
    <div className="space-y-6">
      {/* Banner + Title */}
      <Card className="overflow-hidden">
        <div className="relative h-36 w-full">
          <img
            src={BANNER_URL || "/placeholder.svg"}
            alt="Loan banner"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{"Get Started with your Loan"}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {
            "Kredmart is a credit backed ecommerce shopping site, connecting user to premium loan providers to enable a shopping wallet backed loan. Please Note, this is a wallet backed loan linked to your account to purchase an item of your choose. Kindly select your loan provider and apply"
          }
        </CardContent>
      </Card>

      {step === "start" ? (
        // Layout 1: Just the CTA to proceed
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <p className="max-w-2xl text-sm text-muted-foreground">
                {"Choose a loan provider to view requirements and apply for a wallet‑backed shopping loan."}
              </p>
              <Button size="lg" onClick={() => setStep("select")}>
                {"Select Loan Provider"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Layout 2: Provider selection + details + apply
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{"Choose a Provider and Review Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Provider selector */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <Label className="mb-1 block text-sm font-medium">{"Loan Provider"}</Label>
                <Select onValueChange={setSelectedName} value={selectedName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {loanProviders.map((p) => (
                      <SelectItem key={p.name} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provider summary */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-4">
                  <img
                    src={logoSrc || "/placeholder.svg"}
                    alt={selected.name + " logo"}
                    className="h-10 w-auto object-contain"
                  />
                  <div className="text-sm text-muted-foreground">
                    {"Review the requirements and eligibility criteria below before applying."}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Two-column details */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-base font-semibold">{"Loan Requirements"}</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {selected.requirements.bulletPoints?.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                  {selected.requirements.creditScore && (
                    <li>
                      {"Credit Score: "}
                      {selected.requirements.creditScore}
                    </li>
                  )}
                  {selected.requirements.income && (
                    <li>
                      {"Income: "}
                      {selected.requirements.income}
                    </li>
                  )}
                  {selected.requirements.loanAmount && (
                    <li>
                      {"Loan Amount: "}
                      {selected.requirements.loanAmount}
                    </li>
                  )}
                  {selected.requirements.processingTime && (
                    <li>
                      {"Processing Time: "}
                      {selected.requirements.processingTime}
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-base font-semibold">{"Eligibility"}</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {(selected.eligibility?.length
                    ? selected.eligibility
                    : [
                        "Must be 18+ years of age",
                        "Valid government-issued ID (NIN, PVC or Driver’s License)",
                        "BVN or NIN and active phone number",
                      ]
                  ).map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
              <Button variant="outline" onClick={() => setStep("start")}>
                {"Back"}
              </Button>
              <Button onClick={onApply}>{"Apply Now"}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
