import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  MainStack: undefined;
  CameraStack: undefined;
  AuthStack: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  forgotPassword: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainStackParamList = {
  HomeStack: undefined;
  OrderHistory: undefined;
  Settings: undefined;
};

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type HomeStackParamList = {
  Home: undefined;
  CameraStack: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type CameraStackParamList = {
  Permission: undefined;
  Camera: undefined; // orderId? stepId?
  Preview: {
    path: string;
  };
};

export type CameraStackScreenProps<T extends keyof CameraStackParamList> =
  NativeStackScreenProps<CameraStackParamList, T>;

// useNavigation type
declare module "@react-navigation/native" {
  type RootParamList = RootStackParamList;
}

export enum OrderStatus { // 미완
  READY = "READY",
  TO_LOADING = "TO_LOADING",
  TO_UNLOADING = "TO_UNLOADING",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
}

export function isOrderStatus(value: string): value is OrderStatus {
  return Object.values(OrderStatus).includes(value as OrderStatus);
}
