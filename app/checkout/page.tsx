import React from "react";
import CheckoutPage from "./page-client";
import { getQueryClient } from "@/lib/query-client";
import { getLandmarks } from "@/lib/services/site-settings/use-landmark";

const Page = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["LANDMARKS"],
    queryFn: async () => getLandmarks(),
    staleTime: 1000 * 60 * 5,
  });
  return <CheckoutPage />;
};

export default Page;
