import LayoutShell from "@/components/layout-shell";
import { getQueryClient } from "@/lib/query-client";
import { getProducts } from "@/lib/services/products/use-get-products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import PageClient from "./page-client";

export default async function DealsPage() {
  const queryClient = getQueryClient();
  const params = { limit: 20, page: 1, deals: true };

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["PRODUCTS", params],
    queryFn: ({ pageParam = 1 }) => getProducts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { page, pageSize, total } = lastPage;
      const totalPages = Math.ceil(total / pageSize);
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <LayoutShell>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PageClient />
      </HydrationBoundary>
    </LayoutShell>
  );
}

export const revalidate = 60;
