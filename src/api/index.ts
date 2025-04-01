import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import dayjs, { extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import ky from "ky";

import { accessTokenName, refreshTokenName } from "@/constants/tokens";
import { CookieStorage } from "@/lib/utils/storage";
import { useAuthStore } from "@/store";
import { isOrderStatus, OrderStatus } from "@/type";

extend(utc);

const localizedDayjs = (utcString: string) => dayjs(utcString).local();

type ErrorResponse = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
};

const api = ky.create({
  prefixUrl: "https://driver-api.truck-king.co", // todo: get env base URL
  hooks: {
    beforeRequest: [
      async (request) => {
        const cookieString = CookieStorage.toString();
        if (cookieString) request.headers.set("Cookie", cookieString);
      },
    ],
    afterResponse: [
      // AT 만료될 때 RT도 서버 자동 갱신 -> 매 응답마다 쿠키 최신화
      async (_req, _opts, response) => {
        if (response.ok) {
          const combinedCookiesHeader = response.headers.get("set-cookie");
          if (combinedCookiesHeader)
            CookieStorage.parseAndSet(combinedCookiesHeader);
          return;
        }
        const errorData: ErrorResponse = await response.json();
        console.error(errorData);

        switch (response.status) {
          case 401:
            CookieStorage.clearAll();
            // todo: 로그인 스크린으로 리다이렉트 - useNavigator 필요
            throw new Error("Unauthorized access. Please login again.");
          case 403:
            throw new Error("Forbidden");
          case 404:
            throw new Error("Not Found");
          case 500:
            throw new Error("Internal Server Error");
          default:
            break;
        }
        throw new Error(errorData.message || "Unknown error");
      },
    ],
  },
});

// authentication
export const useSignin = () =>
  useMutation({
    mutationFn: async ({
      vehicleNumber,
      pincode,
    }: {
      vehicleNumber: string;
      pincode: string;
    }) =>
      await api.post("driver/login", {
        json: {
          vehicleNumber,
          pincode,
        },
      }),
  });

export const useSignout = () => {
  const setIsSignedIn = useAuthStore((state) => state.setIsSignedIn);
  return useMutation({
    mutationFn: async () => await api.post("driver/logout"),
    onSuccess: (res) => {
      // TODO: 비즈니스 로직 바깥으로 빼기
      if (res.ok) {
        CookieStorage.delete(accessTokenName);
        CookieStorage.delete(refreshTokenName);
        CookieStorage.cleanExpired();
        setIsSignedIn(false);
      }
    },
  });
};

export const useSignup = () =>
  useMutation({
    mutationFn: async (params: {
      name: string | null;
      phoneNumber: string | null;
      vehicleNumber: string;
      vehicleType: string | null;
      pincode: string | null; // 확인필요
    }) => await api.post("driver", { json: params }),
  });

export const useUpdatePincode = () =>
  useMutation({
    mutationFn: async ({ pincode }: { pincode: string }) =>
      await api.put("driver/update-pincode", { json: { pincode } }),
  });

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: async () => await api.delete("driver"),
    onSuccess: (res) => {
      // TODO: 비즈니스 로직 바깥으로 빼기
      if (res.ok) {
        CookieStorage.delete(accessTokenName);
        CookieStorage.delete(refreshTokenName);
        CookieStorage.cleanExpired();
      }
    },
  });

// driver
const driverKeys = {
  all: ["driver"] as const,
  info: () => [...driverKeys.all, "info"] as const,
  vehicleTypeList: () => [...driverKeys.all, "vehicle-type"] as const,
};

export const useDriverInfo = () =>
  useQuery({
    queryKey: driverKeys.info(),
    queryFn: async () =>
      await api.get("driver").json<{
        id: number;
        name: string;
        phoneNumber: string;
        vehicleNumber: string;
        vehicleTypeName: string;
        vehicleTypeValue: string;
      }>(),
  });

export const useUpdateDriverInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      phoneNumber: string;
      vehicleNumber: string;
      vehicleType: string;
      pincode: string;
    }) => await api.put("driver/update", { json: params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.info() });
    },
  });
};

export const useVehicleTypeList = () =>
  useQuery({
    queryKey: driverKeys.vehicleTypeList(),
    queryFn: async () =>
      await api
        .get("driver/vehicle-types")
        .json<{ list: Array<{ name: string; value: string }> }>(),
    select: (data) =>
      data.list.map((type) => ({ label: type.value, value: type.name })), // 민준 선생님이 반대로 설명해주셔서 클라쪽에서 다시 돌려놨음
  });

// order
const orderKeys = {
  all: ["order"] as const,
  list: (params: { page: number; size: number; sort: string }) =>
    [...orderKeys.all, "list", { ...params }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (orderId: number) => [...orderKeys.all, "detail", orderId] as const,
  currentDetail: () => [...orderKeys.all, "detail", "current"] as const,
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

// background fetch
export const fetchTrackings = async (params: {
  orderId: string;
  latitude: number;
  longitude: number;
  trackingTime: string;
}) => await api.post("track", { json: params });
