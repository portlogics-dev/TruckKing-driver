import { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  MainStack: NavigatorScreenParams<MainStackParamList>;
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  forgotPassword: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainStackParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  OrderHistory: undefined;
  Settings: undefined;
};

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type HomeStackParamList = {
  Home: undefined;
  CameraStack: NavigatorScreenParams<CameraStackParamList>;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type CameraStackParamList = {
  Permission: undefined;
  Camera: {
    orderId: number;
    stepEvent: string;
  };
  Preview: {
    path: string;
    orderId: number;
    stepEvent: string;
    metadata?: {
      latitude?: number;
      longitude?: number;
      timestamp?: string;
    };
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

export enum OrderStepEvent {
  GATE_IN = "Gate in",
  LOADING = "Loading",
  GATE_OUT = "Gate out",
  UNLOADING = "Unloading",
  DELIVERY_COMPLETED = "Delivery completed",
}
