import { getQueryClient } from "@/lib/query-client";
import { getProducts } from "@/lib/services/products/use-get-products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import StorePage from "./page-client";

const Page = async () => {
  const queryClient = getQueryClient();
  const params = { limit: 20, page: 1 };
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StorePage />
    </HydrationBoundary>
  );
};

export default Page;
