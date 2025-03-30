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
    mutationFn: async ({
      vehicleNumber,
      pincode,
    }: {
      vehicleNumber: string;
      pincode: string;
    }) => await api.post("driver/", { json: { vehicleNumber, pincode } }),
  });

export const useUpdatePincode = () =>
  useMutation({
    mutationFn: async ({ pincode }: { pincode: string }) =>
      await api.put("driver/pincode", { json: { pincode } }),
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

// driver queries
const getDriverInfo = async () =>
  await api.get("driver").json<{
    id: number;
    name: string;
    phoneNumber: string;
    vehicleNumber: string;
    vehicleTypeName: string;
    vehicleTypeValue: string;
  }>();

const updateDriverInfo = async ({
  driverId,
  body,
}: {
  driverId: number;
  body: {
    name: string;
    phoneNumber: string;
    vehicleNumber: string;
    vehicleType: string;
  };
}) => await api.put(`driver/${driverId}`, { json: body });

const driverKeys = {
  all: ["driver"] as const,
  info: () => [...driverKeys.all, "info"] as const,
};

export const useDriverInfo = () =>
  useQuery({
    queryKey: ["driver"],
    queryFn: getDriverInfo,
  });

export const useUpdateDriverInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      driverId,
      body,
    }: {
      driverId: number;
      body: {
        name: string;
        phoneNumber: string;
        vehicleNumber: string;
        vehicleType: string;
      };
    }) =>
      await updateDriverInfo({
        driverId,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverKeys.info() });
    },
  });
};

// order
const getCurrentOrderDetail = async () =>
  await api.get("order").json<{
    id: number;
    companyId: number;
    companyName: string;
    loadingAddress: string;
    loadingAddressDetail: string;
    loadingLatitude: string;
    loadingLongitude: string;
    loadingExpectTime: string; // "2023-07-15T09:00:00Z"
    unloadingAddress: string;
    unloadingAddressDetail: string;
    unloadingLatitude: string;
    unloadingLongitude: string;
    unloadingExpectTime: string; // "2023-07-15T09:00:00Z"
    weightValue: number; // 500.5
    weightUnit: string;
    priceValue: number;
    priceCurrency: string;
    status: string;
    transitSteps: {
      transitSteps: {
        id: number;
        stepEvent: string;
        stepEventName: string;
        stepEventImageUrl: string;
        latitude: number;
        longitude: number;
        createdAt: string;
      }[];
    };
    trackResponses: {
      tracks: { latitude: number; longitude: number; trackingTime: string }[];
    };
  }>();

const getOrderDetail = async ({ orderId }: { orderId: number }) =>
  await api.get(`order/${orderId}`).json<{
    id: number;
    companyId: number;
    companyName: string;
    loadingAddress: string;
    loadingAddressDetail: string;
    loadingLatitude: string;
    loadingLongitude: string;
    loadingExpectTime: string; // "2023-07-15T09:00:00Z"
    unloadingAddress: string;
    unloadingAddressDetail: string;
    unloadingLatitude: string;
    unloadingLongitude: string;
    unloadingExpectTime: string; // "2023-07-15T09:00:00Z"
    weightValue: number; // 500.5
    weightUnit: string;
    priceValue: number;
    priceCurrency: string;
    status: string;
    transitSteps: {
      transitSteps: {
        id: number;
        stepEvent: string;
        stepEventName: string;
        stepEventImageUrl: string;
        latitude: number;
        longitude: number;
        createdAt: string;
      }[];
    };
    trackResponses: {
      tracks: { latitude: number; longitude: number; trackingTime: string }[];
    };
  }>();

const getOrderHistory = async ({
  page = 0,
  size = 20,
  sort = "createdAt,DESC",
}: {
  page: number;
  size: number;
  sort: string;
}) =>
  await api.get("order/list", { json: { page, size, sort } }).json<{
    content: {
      id: number;
      companyId: number;
      companyName: string;
      loadingAddress: string;
      loadingAddressDetail: string;
      loadingExpectTime: string;
      unloadingAddress: string;
      unloadingAddressDetail: string;
      unloadingExpectTime: string;
      weightValue: number;
      weightUnit: string;
      priceValue: number;
      priceCurrency: string;
      status: string;
    }[];
    totalPages: number;
    totalElements: number;
    pageNumber: number;
    pageSize: number;
    isFirst: boolean;
    isLast: boolean;
  }>();

const updateOrderStep = async (params: {
  orderId: number;
  stepEvent: string;
  stepEventImage: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: string | null; // UTC
}) => await api.post("transit-steps", { json: params });

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
    queryFn: () => getCurrentOrderDetail(),
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
    queryFn: () => getOrderDetail({ orderId }),
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
    queryFn: () => getOrderHistory(params),
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
    }) =>
      await updateOrderStep({
        orderId,
        ...body,
      }),
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
