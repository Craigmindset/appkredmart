import { getQueryClient } from "@/lib/query-client";
import { getProducts } from "@/lib/services/products/use-get-products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import CategoryPage from "./page-client";
import { getCategoryFromSlug } from "@/lib/categories";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryFromSlug(slug);
  const categoryName = category || slug.replace(/-/g, " ");
  const capitalizedCategory =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return {
    title: `${capitalizedCategory} - Shop Online | Kredmart`,
    description: `Browse and shop ${capitalizedCategory.toLowerCase()} products at Kredmart. Find the best deals on ${capitalizedCategory.toLowerCase()} with flexible payment options and fast delivery.`,
    keywords: [
      capitalizedCategory,
      `buy ${categoryName}`,
      `${categoryName} online`,
      "Kredmart",
      "e-commerce",
      "online shopping Nigeria",
    ],
    openGraph: {
      title: `${capitalizedCategory} - Shop Online | Kredmart`,
      description: `Browse and shop ${capitalizedCategory.toLowerCase()} products at Kredmart. Find the best deals with flexible payment options.`,
      type: "website",
      url: `https://kredmart.com/store/${slug}`,
      siteName: "Kredmart",
    },
    twitter: {
      card: "summary_large_image",
      title: `${capitalizedCategory} - Shop Online | Kredmart`,
      description: `Browse and shop ${capitalizedCategory.toLowerCase()} products at Kredmart.`,
    },
    alternates: {
      canonical: `https://kredmart.com/store/${slug}`,
    },
  };
}

const Page = async ({ params }: Props) => {
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
