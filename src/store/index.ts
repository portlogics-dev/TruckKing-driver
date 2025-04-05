import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { accessTokenName, refreshTokenName } from "@/constants/tokens";
import { storage, CookieStorage } from "@/store/storage";

interface AuthState {
  isSignedIn: boolean;
  isLoading: boolean;
  setIsSignedIn: (value: boolean) => void;
  checkAuth: () => boolean;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  isSignedIn: false,
  setIsSignedIn: (value: boolean) => set({ isSignedIn: value }),
  checkAuth: () => {
    try {
      const accessToken = CookieStorage.get(accessTokenName);
      const refreshToken = CookieStorage.get(refreshTokenName);

      if (accessToken && refreshToken) {
        // 유무 외에 유효성 검사 보강 필요
        set({ isSignedIn: true, isLoading: false });
        console.log("토큰 확인", { accessToken, refreshToken });
      } else {
        set({ isSignedIn: false, isLoading: false });
        console.log("토큰 유실", { accessToken, refreshToken });
      }
      return true;
    } catch (error) {
      set({ isSignedIn: false, isLoading: false });
      console.error("토큰 체크 실패:", error);
      console.error("쿠키 초기화");
      CookieStorage.clearAll();
      return false;
    }
  },
}));

interface PermanentStorage {
  remember: boolean;
  rememberVehicleNumber: string;
  setRemember: (value: boolean) => void;
  setRememberVehicleNumber: (value: string) => void;
}

const usePermanentStorage = create<PermanentStorage>()(
  persist(
    (set) => ({
      remember: false,
      rememberVehicleNumber: "",
      setRemember: (value: boolean) => set({ remember: value }),
      setRememberVehicleNumber: (value: string) =>
        set({ rememberVehicleNumber: value }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const value = storage.getString(name);
          return value ?? null;
        },
        setItem: (name, value) => {
          storage.set(name, value);
        },
        removeItem: (name) => {
          storage.delete(name);
        },
      })),
    }
  )
);

export { useAuthStore, usePermanentStorage };
