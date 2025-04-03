import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { accessTokenName, refreshTokenName } from "@/constants/tokens";
import { storage, CookieStorage } from "@/store/storage";

interface AuthState {
  isSignedIn: boolean;
  isLoading: boolean;
  setIsSignedIn: (value: boolean) => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  isSignedIn: false,
  setIsSignedIn: (value: boolean) => set({ isSignedIn: value }),
  checkAuth: async () => {
    try {
      const accessToken = CookieStorage.get(accessTokenName);
      const refreshToken = CookieStorage.get(refreshTokenName);

      if (accessToken && refreshToken) {
        // 유무 외에 유효성 검사 보강 필요
        set({ isSignedIn: true, isLoading: false });
      } else {
        set({ isSignedIn: false, isLoading: false });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      set({ isSignedIn: false, isLoading: false });
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
