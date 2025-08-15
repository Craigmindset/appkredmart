"use client"

import { useId, useState } from "react"
import { ChevronDown } from "lucide-react"

type FAQ = { q: string; a: string }

const faqs: FAQ[] = [
  {
    q: "What is a wallet‑backed loan on KredMart?",
    a: "It’s a credit limit linked to your KredMart wallet. Once approved by a partner lender, you can use the wallet balance to purchase items on KredMart and repay over time.",
  },
  {
    q: "Who are the loan providers I can apply with?",
    a: "KredMart partners with lenders like Renmoney, CreditDirect, FairMoney and others. Choose a provider, review their requirements, and apply directly from KredMart.",
  },
  {
    q: "Am I eligible for a loan?",
    a: "Eligibility depends on the provider, typically a valid government ID (NIN/PVC/Driver’s License), verifiable income, active phone/email, and sometimes a minimum credit score.",
  },
  {
    q: "How much can I borrow?",
    a: "Limits are set by each provider. You’ll see sample ranges during selection; the final amount is based on your assessment.",
  },
  {
    q: "How long does approval take?",
    a: "Some providers respond within minutes; others within 24–48 hours. Once approved, your wallet is credited so you can complete your purchase.",
  },
  {
    q: "Are there fees or interest?",
    a: "Yes. Interest and fees are defined by the selected provider. Review their terms carefully before you proceed.",
  },
  {
    q: "Can I use my loan for any product?",
    a: "Yes. Use your wallet‑backed loan on eligible items across KredMart. Add to cart and check out with your wallet balance.",
  },
  {
    q: "What happens if I miss a repayment?",
    a: "Late or missed payments may incur charges and affect future eligibility. Always review your repayment schedule.",
  },
]

export default function LoanFAQ() {
  // Mobile/tablet: which question is open
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // Desktop: whether the global dropdown is open
  const [openDesktop, setOpenDesktop] = useState(false)
  const baseId = useId()

  return (
    <section className="bg-black text-white">
      <div className="container mx-auto px-4 py-8 md:py-10">
        {/* Desktop-only global dropdown trigger */}
        <div className="hidden md:block">
          <button
            type="button"
            aria-expanded={openDesktop}
            aria-controls={`${baseId}-desktop-faq`}
            onClick={() => setOpenDesktop((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-white/5 px-5 py-4 text-left hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <span className="text-xl font-semibold tracking-tight">Frequently asked questions</span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-white/80 transition-transform ${openDesktop ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {/* Desktop dropdown content: full list, single-row per item (Q left, A right) */}
          <div
            id={`${baseId}-desktop-faq`}
            className={`mt-4 overflow-hidden rounded-lg border border-white/10 transition-[max-height,opacity] duration-300 ${
              openDesktop ? "opacity-100" : "max-h-0 opacity-0"
            }`}
            style={{ maxHeight: openDesktop ? "2000px" : undefined }}
          >
            <div className="divide-y divide-white/10">
              {faqs.map((item, idx) => (
                <div key={idx} className="grid items-start gap-4 px-5 py-5 md:grid-cols-12">
                  {/* Left: Question */}
                  <div className="md:col-span-5 text-sm md:text-base font-medium">{item.q}</div>
                  {/* Right: Answer */}
                  <div className="md:col-span-7 text-sm text-white/80">{item.a}</div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 text-xs text-white/60">
              Need more help? Visit Dashboard → Account or email support@kredmart.example
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: per-question toggle list, single-row feel within item */}
        <div className="md:hidden">
          <h2 className="mb-3 text-lg font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="divide-y divide-white/10 rounded-lg border border-white/10">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx
              const qId = `${baseId}-q-${idx}`
              const aId = `${baseId}-a-${idx}`
              return (
                <div key={qId} className="grid grid-cols-1 items-stretch" role="group">
                  {/* Question row with chevron */}
                  <button
                    id={qId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={aId}
                    onClick={() => setOpenIndex((prev) => (prev === idx ? null : idx))}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <span className="text-sm font-medium">{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-white/80 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Answer (only visible when open) */}
                  <div
                    id={aId}
                    aria-labelledby={qId}
                    className={`px-4 pb-4 text-sm text-white/80 ${isOpen ? "" : "hidden"}`}
                  >
                    {item.a}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 text-xs text-white/60">
            Need more help? Visit Dashboard → Account or email support@kredmart.example
          </div>
        </div>
      </div>
    </section>
  )
}
