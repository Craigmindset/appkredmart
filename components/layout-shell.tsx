import type React from "react"
import { Suspense } from "react"
import SiteHeader from "./site-header"
import SiteFooter from "./site-footer"
import { appFontClass } from "@/lib/fonts"

type LayoutShellProps = {
  children: React.ReactNode
  showFooter?: boolean
}

export default function LayoutShell({ children, showFooter = true }: LayoutShellProps) {
  return (
    <div className={appFontClass}>
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      <main>{children}</main>
      {showFooter ? <SiteFooter /> : null}
    </div>
  )
}
