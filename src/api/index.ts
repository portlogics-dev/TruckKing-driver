import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs, { extend } from "dayjs";
import utc from "dayjs/plugin/utc";
import ky from "ky";

import { CookieStorage } from "../utils/storage";

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
  prefixUrl: "https://api.example.com", // todo: get env base URL
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
const updatePincode = async ({ pincode }: { pincode: string }) =>
  await api.put("/driver/pincode", { json: { pincode } });

export const useLogin = ({
  vehicleNumber,
  pincode,
}: {
  vehicleNumber: number;
  pincode: number;
}) =>
  useMutation({
    mutationFn: async () =>
      await api.post("/driver/login", {
        json: {
          vehicleNumber,
          pincode,
        },
      }),
  });

export const useLogout = () =>
  useMutation({
    mutationFn: async () => await api.post("/driver/logout"),
    onSuccess: (res) => {
      if (res.ok) {
        CookieStorage.delete("Authentication");
        CookieStorage.delete("Refresh-Token");
        CookieStorage.cleanExpired();
      }
    },
  });

export const useUpdatePincode = ({ pincode }: { pincode: string }) =>
  useMutation({
    mutationFn: () => updatePincode({ pincode }),
  });

export const useDeleteAccount = () =>
  useMutation({
    mutationFn: async () => await api.delete("/driver"),
    onSuccess: (res) => {
      if (res.ok) {
        CookieStorage.delete("Authentication");
        CookieStorage.delete("Refresh-Token");
        CookieStorage.cleanExpired();
      }
    },
  });

// driver queries
const getDriverInfo = async () =>
  await api.get("/driver").json<{
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
}) => await api.put(`/driver/${driverId}`, { json: body });

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

// order queries
enum OrderStatus {
  READY = "READY",
  TO_LOADING = "TO_LOADING",
  TO_UNLOADING = "TO_UNLOADING",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
}

const getOrderDetail = async ({ orderId }: { orderId: number }) =>
  await api.get(`/order/${orderId}`).json<{
    id: number;
    companyId: number;
    companyName: string;
    driverId: number;
    driverName: string;
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
    weight: number; // 500.5
    weightUnit: string;
    price: number;
    priceCurrency: string;
    status: string;
    createdAt: string; // "2023-07-15T09:00:00Z"
    updatedAt: string; // "2023-07-15T09:00:00Z"
  }>();

const getOrderHistory = async () =>
  await api.get("/order").json<{
    content: {
      id: number;
      companyId: number;
      companyName: string;
      driverId: number;
      driverName: string;
      loadingAddress: string;
      unloadingAddress: string;
      status: string;
      createdAt: string; // "2023-07-15T09:00:00Z"
    }[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  }>();

const updateOrderStatus = async ({
  orderId,
  body,
}: {
  orderId: number;
  body: {
    status: OrderStatus;
    image: string;
    address: string | null;
    latitude: string | null;
    longitude: string | null;
    updateTime: string | null; // UTC
  };
}) =>
  await api.put(`/order/${orderId}`, { json: body }).json<{
    id: number;
    companyId: number;
    companyName: string;
    driverId: number;
    driverName: string;
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
    weight: number; // 500.5
    weightUnit: string;
    price: number;
    priceCurrency: string;
    status: string;
    createdAt: string; // "2023-07-15T09:00:00Z"
    updatedAt: string; // "2023-07-15T09:00:00Z"
  }>();

const orderKeys = {
  all: ["order"] as const,
  list: () => [...orderKeys.all, "list"] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (orderId: number) => [...orderKeys.all, "detail", orderId] as const,
};

export const useOrderDetail = ({ orderId }: { orderId: number }) =>
  useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderDetail({ orderId }),
    enabled: !!orderId,
    select: (data) => ({
      ...data,
      loadingExpectTime: localizedDayjs(data.loadingExpectTime),
      unloadingExpectTime: localizedDayjs(data.unloadingExpectTime),
      createdAt: localizedDayjs(data.createdAt),
      updatedAt: localizedDayjs(data.updatedAt),
    }),
  });

export const useOrderList = () =>
  useQuery({
    queryKey: orderKeys.list(),
    queryFn: getOrderHistory,
    select: (data) => ({
      ...data,
      content: data.content.map((order) => ({
        ...order,
        createdAt: localizedDayjs(order.createdAt),
      })),
    }),
  });

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      body,
    }: {
      orderId: number;
      body: {
        status: OrderStatus;
        image: string;
        address: string | null;
        latitude: string | null;
        longitude: string | null;
        updateTime: string | null; // UTC
      };
    }) =>
      await updateOrderStatus({
        orderId,
        body,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
    },
  });
};
