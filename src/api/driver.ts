import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from ".";

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
