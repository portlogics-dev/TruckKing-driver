import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { localizedDayjs } from "@/lib/utils/dayjs";
import { isOrderStatus, OrderStatus } from "@/type";

import { api } from ".";

// order
export const orderKeys = {
  all: ["order"] as const,
  list: (params: { page: number; size: number; sort: string }) =>
    [...orderKeys.all, "list", { ...params }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (orderId: number) => [...orderKeys.all, "detail", orderId] as const,
  currentDetail: () => [...orderKeys.all, "detail", "current"] as const,
  transitStepEventList: () => [...orderKeys.all, "transit-step-event"] as const,
};

export const useCurrentOrderDetail = () =>
  useSuspenseQuery({
    queryKey: orderKeys.currentDetail(),
    queryFn: async () =>
      await api.get("order").json<{
        id: number;
        companyId: number;
        companyName: string;
        loadingAddress: string;
        loadingAddressDetail: string;
        loadingLatitude: number;
        loadingLongitude: number;
        loadingExpectTime: string; // "2023-07-15T09:00:00Z"
        unloadingAddress: string;
        unloadingAddressDetail: string;
        unloadingLatitude: number;
        unloadingLongitude: number;
        unloadingExpectTime: string; // "2023-07-15T09:00:00Z"
        weightValue: number; // 500.5
        weightUnit: string;
        priceValue: number;
        priceCurrency: string;
        status: string;
        transitSteps: {
          transitSteps: {
            orderId: number;
            stepEvent: string;
            stepEventName: string;
            stepEventImageUrl: string;
            latitude: number;
            longitude: number;
            createdAt: string;
          }[];
        };
        trackResponses: {
          tracks: {
            id: number;
            latitude: number;
            longitude: number;
            trackingTime: string;
          }[];
        };
      }>(),
    select: (data) => ({
      ...data,
      status: isOrderStatus(data.status) ? data.status : OrderStatus.PENDING,
      company: {
        id: data.companyId,
        name: data.companyName,
      },
      loading: {
        address: data.loadingAddress,
        addressDetail: data.loadingAddressDetail,
        latitude: data.loadingLatitude,
        longitude: data.loadingLongitude,
        expectTime: localizedDayjs(data.loadingExpectTime),
      },
      unloading: {
        address: data.unloadingAddress,
        addressDetail: data.unloadingAddressDetail,
        latitude: data.unloadingLatitude,
        longitude: data.unloadingLongitude,
        expectTime: localizedDayjs(data.unloadingExpectTime),
      },
      weight: {
        value: data.weightValue,
        unit: data.weightUnit,
      },
      price: {
        value: data.priceValue,
        currency: data.priceCurrency,
      },
      transitSteps: data.transitSteps.transitSteps.map((step) => ({
        ...step,
        createdAt: localizedDayjs(step.createdAt),
      })),
      tracks: data.trackResponses.tracks.map((track) => ({
        ...track,
        trackingTime: localizedDayjs(track.trackingTime),
      })),
    }),
  });

export const useOrderDetail = ({ orderId }: { orderId: number }) =>
  useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () =>
      await api.get(`order/${orderId}`).json<{
        id: number;
        companyId: number;
        companyName: string;
        loadingAddress: string;
        loadingAddressDetail: string;
        loadingLatitude: number;
        loadingLongitude: number;
        loadingExpectTime: string; // "2023-07-15T09:00:00Z"
        unloadingAddress: string;
        unloadingAddressDetail: string;
        unloadingLatitude: number;
        unloadingLongitude: number;
        unloadingExpectTime: string; // "2023-07-15T09:00:00Z"
        weightValue: number; // 500.5
        weightUnit: string;
        priceValue: number;
        priceCurrency: string;
        status: string;
        transitSteps: {
          transitSteps: {
            orderId: number;
            stepEvent: string;
            stepEventName: string;
            stepEventImageUrl: string;
            latitude: number;
            longitude: number;
            createdAt: string;
          }[];
        };
        trackResponses: {
          tracks: {
            id: number;
            latitude: number;
            longitude: number;
            trackingTime: string;
          }[];
        };
      }>(),
    enabled: !!orderId,
    select: (data) => ({
      ...data,
      status: isOrderStatus(data.status) ? data.status : OrderStatus.PENDING,
      company: {
        id: data.companyId,
        name: data.companyName,
      },
      loading: {
        address: data.loadingAddress,
        addressDetail: data.loadingAddressDetail,
        latitude: data.loadingLatitude,
        longitude: data.loadingLongitude,
        expectTime: localizedDayjs(data.loadingExpectTime),
      },
      unloading: {
        address: data.unloadingAddress,
        addressDetail: data.unloadingAddressDetail,
        latitude: data.unloadingLatitude,
        longitude: data.unloadingLongitude,
        expectTime: localizedDayjs(data.unloadingExpectTime),
      },
      weight: {
        value: data.weightValue,
        unit: data.weightUnit,
      },
      price: {
        value: data.priceValue,
        currency: data.priceCurrency,
      },
      transitSteps: data.transitSteps.transitSteps.map((step) => ({
        ...step,
        createdAt: localizedDayjs(step.createdAt),
      })),
      tracks: data.trackResponses.tracks.map((track) => ({
        ...track,
        trackingTime: localizedDayjs(track.trackingTime),
      })),
    }),
  });

export const useOrderHistory = (params: {
  page: number;
  size: number;
  sort: string;
}) =>
  useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async () =>
      await api.get("order/list", { json: params }).json<{
        content: {
          id: number;
          companyId: number;
          companyName: string;
          loadingAddress: string;
          loadingAddressDetail: string;
          loadingLatitude: number;
          loadingLongitude: number;
          loadingExpectTime: string;
          unloadingAddress: string;
          unloadingAddressDetail: string;
          unloadingLatitude: number;
          unloadingLongitude: number;
          unloadingExpectTime: string;
          weightValue: number;
          weightUnit: string;
          priceValue: number;
          priceCurrency: string;
          status: string;
          transitSteps: {
            transitSteps: {
              orderId: number;
              stepEvent: string;
              stepEventName: string;
              stepEventImageUrl: string;
              latitude: number;
              longitude: number;
              createdAt: string;
            }[];
          };
          trackResponses: {
            tracks: {
              id: number;
              latitude: number;
              longitude: number;
              trackingTime: string;
            }[];
          };
        }[];
        totalCount: number;
        page: number;
        size: number;
      }>(),
    select: (data) => ({
      ...data,
      content: data.content.map((order) => ({
        ...order,
        company: {
          id: order.companyId,
          name: order.companyName,
        },
        loading: {
          address: order.loadingAddress,
          addressDetail: order.loadingAddressDetail,
          expectTime: localizedDayjs(order.loadingExpectTime),
        },
        unloading: {
          address: order.unloadingAddress,
          addressDetail: order.unloadingAddressDetail,
          expectTime: localizedDayjs(order.unloadingExpectTime),
        },
        weight: {
          value: order.weightValue,
          unit: order.weightUnit,
        },
        price: {
          value: order.priceValue,
          currency: order.priceCurrency,
        },
      })),
    }),
  });

export const useUpdateOrderStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      body,
    }: {
      orderId: number;
      body: {
        stepEvent: string;
        stepEventImage: string;
        latitude: string | null;
        longitude: string | null;
        createdAt: string | null; // UTC
      };
    }) => await api.post("transit-steps", { json: { orderId, ...body } }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
    },
  });
};

export const useOrderTransitStepEventList = () =>
  useQuery({
    queryKey: orderKeys.transitStepEventList(),
    queryFn: async () =>
      await api.get("transit-steps/step-event").json<{
        list: Array<{
          name: string;
          value: string;
          description: string;
        }>;
      }>(),
    select: (data) =>
      data.list.map((step) => ({
        label: step.name,
        value: step.value,
        description: step.description,
      })),
  });
