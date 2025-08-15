export type LoanProvider = {
  name: string
  logo: string
  applyUrl: string
  requirements: {
    creditScore?: string
    income?: string
    loanAmount?: string
    processingTime?: string
    bulletPoints?: string[]
  }
  eligibility?: string[]
}

export const loanProviders: LoanProvider[] = [
  {
    name: "Renmoney",
    logo: "/placeholder.svg?height=60&width=180",
    applyUrl: "/sign-up",
    requirements: {
      creditScore: "620+",
      income: "N60,000/month minimum",
      loanAmount: "N20,000 - N500,000",
      processingTime: "12 months",
    },
    eligibility: [
      "Nigerian resident with valid ID (NIN, Voter’s Card, or Driver’s License)",
      "Active phone number and email address",
      "Recent utility bill or proof of address",
    ],
  },
  {
    name: "CreditDirect",
    logo: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/loan1.png",
    applyUrl: "/sign-up",
    requirements: {
      creditScore: "600+",
      income: "N50,000/month minimum",
      loanAmount: "N50,000 - N500,000",
      processingTime: "24 months",
      bulletPoints: [
        "You must be aged 22 to 55 years",
        "Be a Salary earning employee",
        "At least 6 Months salary pay slips",
        "Employment Letter",
      ],
    },
    eligibility: [
      "Employed with verifiable income",
      "Valid government-issued ID",
      "Active bank account and debit card",
    ],
  },
  {
    name: "FairMoney",
    logo: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/loan2.png",
    applyUrl: "/sign-up",
    requirements: {
      creditScore: "650+",
      income: "N70,000/month minimum",
      loanAmount: "N30,000 - N400,000",
      processingTime: "18 months",
    },
    eligibility: ["Stable monthly income", "BVN or NIN", "Recent bank statement (3–6 months)"],
  },
  {
    name: "Binatone Finance",
    logo: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/loans%20logos%20Jul%2031%2C%202025%2C%2005_10_20%20PM.png",
    applyUrl: "/sign-up",
    requirements: {
      creditScore: "620+",
      income: "N60,000/month minimum",
      loanAmount: "N20,000 - N300,000",
      processingTime: "12 months",
    },
    eligibility: ["Government-issued ID", "Proof of address", "Active debit card"],
  },
  {
    name: "QuickCash",
    logo: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/placeholder-logo.png",
    applyUrl: "/sign-up",
    requirements: {
      creditScore: "630+",
      income: "N55,000/month minimum",
      loanAmount: "N10,000 - N200,000",
      processingTime: "6 months",
    },
    eligibility: ["18+ years", "BVN/NIN", "Active bank account"],
  },
]
