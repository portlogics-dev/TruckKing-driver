import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { accessTokenName, refreshTokenName } from "../constants/tokens";
import { storage, CookieStorage } from "../utils/storage";

interface AuthState {
  isSignedIn: boolean;
  isLoading: boolean;
  remember: boolean;
  rememberVehicleNumber: string;
  setIsSignedIn: (value: boolean) => void;
  checkAuth: () => Promise<void>;
  setRemember: (value: boolean) => void;
  setRememberVehicleNumber: (value: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoading: true,
      isSignedIn: false,
      remember: false,
      rememberVehicleNumber: "",
      setIsSignedIn: (value: boolean) => set({ isSignedIn: value }),
      checkAuth: async () => {
        try {
          const accessToken = CookieStorage.get(accessTokenName);
          const refreshToken = CookieStorage.get(refreshTokenName);

          if (accessToken && refreshToken) {
            set({ isSignedIn: true, isLoading: false });
          } else {
            set({ isSignedIn: false, isLoading: false });
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          set({ isSignedIn: false, isLoading: false });
        }
      },
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

export { useAuthStore };
