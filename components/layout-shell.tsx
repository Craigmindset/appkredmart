import type React from "react";
import { Suspense } from "react";
import SiteHeader from "./site-header";
import SiteFooter from "./site-footer";
import { appFontClass } from "@/lib/fonts";

type LayoutShellProps = {
  children: React.ReactNode;
  showFooter?: boolean;
  hideHeader?: boolean;
};

export default function LayoutShell({
  children,
  showFooter = true,
  hideHeader = false,
}: LayoutShellProps) {
  return (
    <div className={appFontClass}>
      {!hideHeader && (
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
      )}
      <main>{children}</main>
      {showFooter ? <SiteFooter /> : null}
    </div>
  );
}
