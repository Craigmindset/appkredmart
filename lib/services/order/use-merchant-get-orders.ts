import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type MerchantOrdersResponseDto = {
  data: MerchantOrdersResponse[];
  count: number;
  offset: number;
  limit: number;
};

export interface MerchantOrdersResponse {
  id: string;
  orderId: string;
  merchantId: string;
  subtotal: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  order: MerchantOrderResponse;
  items: Item[];
}

export interface MerchantOrderResponse {
  id: string;
  orderId: string;
  paymentMethod: string;
  paymentStatus: string;
  fulfillment: string;
  delivery: string;
  couponDiscount: number;
  total: number;
  subtotal: number;
  shippingFees: number;
  estimateDelivery: any;
  note: any;
  userId: string;
  address: string;
  city: string;
  state: string;
  landMark: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  transaction: { ref: string }[];
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: any;
}

export interface Item {
  id: string;
  title: string;
  quantity: number;
  price: number;
  orderId: any;
  merchantOrderId: string;
  image: string;
  productId: string;
  merchantId: string;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  unit: any;
  minPurchase: any;
  images: string[];
  price: number;
  quantity: number;
  image: string;
  color: any;
  description: string;
  shortDescription: string;
  externalId: string;
  category: string[];
  displayPrice: number;
  discount: number;
  markup: number;
  weight: number;
  length: any;
  width: any;
  height: any;
  deal: boolean;
  source: string;
  status: string;
  merchantId: string;
  createdAt: string;
  updatedAt: string;
}

type GetProductsParams = {
  offset?: number;
  limit?: number;
  search?: string | null;
  page?: number;
};

export const merchantGetOrders = async (params?: GetProductsParams) => {
  const response = await backendAxios.get<
    MerchantOrdersResponseDto,
    AxiosResponse<MerchantOrdersResponseDto>
  >("/merchant/orders", { params });
  return response.data;
};

export const useMerchantGetOrders = (params?: GetProductsParams) => {
  const { offset = 0, limit = 20, page = 1, search } = params || {};
  const formattedParams = {
    offset,
    limit,
    page,
    ...(search ? { search } : {}),
  };
  return useQuery<MerchantOrdersResponseDto>({
    queryKey: ["ADMIN_ORDERS", formattedParams],
    queryFn: async () => await merchantGetOrders(formattedParams),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
