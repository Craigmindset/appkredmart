import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";


import RootProviders from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import Popup from "@/components/Popup";

export const metadata: Metadata = {
  title: "KredMart",
  description: "financed ecommerce platform",
  icons: {
    icon: "/Kredmart Logo-04.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/Kredmart Logo-04.png" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="bg-[#F4F6F8]">
        <RootProviders>
          <Popup />
          {children}
          <Toaster />
        </RootProviders>
      </body>
    </html>
  );
}
