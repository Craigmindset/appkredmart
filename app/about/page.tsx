import Image from "next/image";
import LayoutShell from "@/components/layout-shell";

export default function AboutPage() {
  return (
    <LayoutShell>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* ⬇️ removed ml-8; kept container padding */}
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left: copy (limit width and center on mobile) */}
            <div className="max-w-2xl mx-auto md:mx-0">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                About us
              </p>

              <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Helping customers deliver{" "}
                <span className="relative inline-block">
                  exceptional
                  <span className="absolute inset-x-0 bottom-1 -z-10 h-4 rounded-full bg-emerald-200/80 sm:bottom-2 sm:h-5" />
                </span>{" "}
                buyer experiences.
              </h1>

              {/* ⬇️ equal margins on mobile: center the block with mx-auto + small px; align left text */}
              <p className="mt-6 text-slate-600 leading-relaxed text-left
                             max-w-[65ch] mx-auto md:mx-0
                             px-3 sm:px-0">
                KredMart is the modern shopping experience for go-to-market
                teams and consumers—combining wallet loans, flexible payments,
                and curated deals to help you connect with more buyers and
                generate more revenue.
              </p>

              <div className="mt-8">
                <a
                  href="/sign-up"
                  className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring focus-visible:ring-indigo-300"
                >
                  Sign Up for Free
                </a>
              </div>
            </div>

            {/* Right: visual */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -left-10 bottom-8 hidden h-72 w-56 -rotate-[20deg] rounded-[60%] bg-emerald-900 md:block" />
              <div
                aria-hidden
                className="absolute -right-10 bottom-24 hidden h-28 w-64 opacity-70 md:block"
                style={{
                  backgroundImage:
                    "radial-gradient(currentColor 1px, transparent 1px)",
                  backgroundSize: "8px 8px",
                  color: "#CBD5E1",
                }}
              />
              <div className="absolute -right-2 bottom-8 hidden h-3 w-3 rounded-full bg-slate-300 md:block" />
              <div className="absolute right-8 bottom-6 hidden h-2 w-2 rounded-full bg-slate-300 md:block" />

              <div className="relative z-10 overflow-hidden rounded-[40%]">
                <Image
                  src="https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/ChatGPT%20Image%20Aug%2025%2C%202025%2C%2005_47_03%20AM.png"
                  alt="Customer using KredMart on laptop"
                  width={720}
                  height={540}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </LayoutShell>
  );
}
