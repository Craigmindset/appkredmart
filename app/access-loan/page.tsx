"use client"

import LayoutShell from "@/components/layout-shell"
import Image from "next/image"
import LoanFAQ from "@/components/loan-faq"
import WhyUs from "@/components/why-us"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Provider = {
  name: string
  logo: string
  requirements: {
    creditScore?: string
    bulletPoints?: string[]
    income?: string
    loanAmount?: string
    processingTime?: string
  }
  applyUrl: string
}

const loanProviders: Provider[] = [
  {
    name: "CreditDirect",
    logo: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/loan1.png",
    requirements: {
      creditScore: "600+",
      bulletPoints: [
        "You must be aged 22 to 55 years",
        "Be a Salary earning employee",
        "At least 6 Months salary pay slips",
        "Employment Letter",
      ],
      income: "N50,000/month minimum",
      loanAmount: "N50,000 - N500,000",
      processingTime: "24 months",
    },
    applyUrl: "/sign-up",
  },
  {
    name: "FairMoney",
    logo: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/loan2.png",
    requirements: {
      creditScore: "650+",
      income: "N70,000/month minimum",
      loanAmount: "N30,000 - N400,000",
      processingTime: "18 months",
    },
    applyUrl: "/sign-up",
  },
  {
    name: "Binatone Finance",
    logo: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/loans%20logos%20Jul%2031%2C%202025%2C%2005_10_20%20PM.png",
    requirements: {
      creditScore: "620+",
      income: "N60,000/month minimum",
      loanAmount: "N20,000 - N300,000",
      processingTime: "12 months",
    },
    applyUrl: "/sign-up",
  },
  {
    name: "QuickCash",
    logo: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/placeholder-logo.png",
    requirements: {
      creditScore: "630+",
      income: "N55,000/month minimum",
      loanAmount: "N10,000 - N200,000",
      processingTime: "6 months",
    },
    applyUrl: "/sign-up",
  },
]

export default function AccessLoanPage() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [providerChosen, setProviderChosen] = useState(false)
  const selected = useMemo(() => loanProviders[selectedIdx], [selectedIdx])

  const handlePick = (idx: number) => {
    setSelectedIdx(idx)
    setProviderChosen(true)
  }

  return (
    <LayoutShell>
      <section className="relative min-h-screen overflow-hidden bg-white py-12 md:py-16">
        {/* Background image with subtle overlay */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={"/images/access-loan-bg.png"}
            alt={"Background texture"}
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-4 md:grid-cols-2">
            {/* Left: Copy + provider dropdown */}
            <div>
              <div className="mb-4 inline-flex items-center rounded-full bg-gray-100 px-4 py-1 text-base font-semibold text-gray-700">
                <span className="mr-2">{"🚀"}</span> {"Customers Come First"}
              </div>

              <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                {"Top Lenders "}
                <br />
                <span className="mt-2 block">{"All in one Place"}</span>
              </h1>

              <p className="mb-8 max-w-xl text-base tracking-tight text-gray-700">
                {
                  "Whether you’re shopping for a new gadget, appliance or dealing with unexpected needs, we make borrowing simple and stress-free."
                }
              </p>

              <div className="mb-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="inline-flex items-center gap-2 rounded-full bg-[#1d3633] px-6 py-3 font-semibold text-white hover:bg-[#162a28]">
                      {providerChosen ? selected.name : "Select Provider"}
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {loanProviders.map((p, idx) => (
                      <DropdownMenuItem key={p.name} onClick={() => handlePick(idx)} className="cursor-pointer">
                        {p.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right: Provider Card */}
            <div className="mx-auto w-full max-w-sm rounded-2xl bg-[#e0f2fe]/80 p-3 shadow-xl">
              <div className="space-y-2 rounded-2xl bg-white px-6 pt-3 pb-6">
                <div className="mb-1 flex justify-center">
                  {/* Use img for remote asset to avoid next/image remote domain config */}
                  <img
                    src={selected.logo || "/placeholder.svg"}
                    alt={selected.name + " logo"}
                    width={200}
                    height={200}
                    className="h-auto w-[200px] object-contain"
                  />
                </div>

                <div className="space-y-2 pb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{"Requirements"}</h3>
                  <ul className="list-inside list-disc text-sm text-gray-700">
                    {selected.name === "CreditDirect" &&
                      Array.isArray(selected.requirements.bulletPoints) &&
                      selected.requirements.bulletPoints.map((point, idx) => <li key={idx}>{point}</li>)}
                    {selected.requirements.creditScore && <li>Credit Score: {selected.requirements.creditScore}</li>}
                    {selected.requirements.income && <li>Income: {selected.requirements.income}</li>}
                    {selected.requirements.loanAmount && <li>Loan Amount: {selected.requirements.loanAmount}</li>}
                    {selected.requirements.processingTime && (
                      <li>Processing Time: {selected.requirements.processingTime}</li>
                    )}
                  </ul>

                  <hr className="my-2 border-gray-300" />

                  <h3 className="text-lg font-semibold text-gray-900">{"Required Document"}</h3>
                  <ul className="mb-12 list-inside list-disc text-sm text-gray-700">
                    <li>{"Valid government ID. (Intl Passport, Voter card, Driver's License)"}</li>
                    <li>{"BVN or NIN"}</li>
                    <li>{"Active Debit Card"}</li>
                  </ul>
                </div>

                <Button
                  className="w-full rounded-lg bg-[#466cf4] py-3 font-bold text-white hover:bg-[#3556b2]"
                  onClick={() => (window.location.href = selected.applyUrl)}
                >
                  {"Apply Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WhyUs />
      <LoanFAQ />
    </LayoutShell>
  )
}
