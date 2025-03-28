import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { accessTokenName, refreshTokenName } from "../constants/tokens";
import { storage, CookieStorage } from "../utils/storage";

interface AuthState {
  isSignedIn: boolean;
  isLoading: boolean;
  setIsSignedIn: (value: boolean) => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoading: true,
      isSignedIn: false,
      setIsSignedIn: (value) => set({ isSignedIn: value }),
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
