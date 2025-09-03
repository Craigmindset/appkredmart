import { getQueryClient } from "@/lib/query-client";
import { getProducts } from "@/lib/services/products/use-get-products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CategoryPage from "./page-cient";
import { getCategoryFromSlug } from "@/lib/categories";

const Page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category: slug } = await params;
  const category = getCategoryFromSlug(slug);
  const queryClient = getQueryClient();
  const queryParams = { limit: 20, page: 1, category };
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["PRODUCTS", queryParams],
    queryFn: ({ pageParam = 1 }) =>
      getProducts({ ...queryParams, page: pageParam }),
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
      <CategoryPage />
    </HydrationBoundary>
  );
};

export default Page;
