import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

import RootProviders from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { serverAxios } from "@/lib/backendaxios";

export const metadata: Metadata = {
  title: "KredMart",
  description: "financed ecommerce platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["USER"],
    queryFn: async () => {
      try {
        const response = await serverAxios.get("/user/me");
        return response.data;
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          await serverAxios.post("/auth/refresh"); // refresh cookies
          const response = await serverAxios.get("/user/me");
          return response.data;
        }
        throw err;
      }
    },
  });

  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <RootProviders>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
            <Toaster />
          </HydrationBoundary>
        </RootProviders>
      </body>
    </html>
  );
}
