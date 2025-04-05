import { useMutation } from "@tanstack/react-query";

import { api } from ".";

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

export const useSignout = () =>
  useMutation({
    mutationFn: async () => await api.post("driver/logout"),
  });

export const useSignup = () =>
  useMutation({
    mutationFn: async (params: {
      name: string | null;
      phoneNumber: string | null;
      vehicleNumber: string;
      vehicleType: string | null;
      pincode: string | null;
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
    // onSuccess: (res) => {
    // TODO: 비즈니스 로직 바깥으로 빼기
    // if (res.ok) {
    //   CookieStorage.delete(accessTokenName);
    //   CookieStorage.delete(refreshTokenName);
    //   CookieStorage.cleanExpired();
    // }
    // },
  });
