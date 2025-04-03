import { NavigationContainer } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { useEffect } from "react";
import { View, AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import TruckkingLogo from "@/assets/truckking-logo.svg";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import RootStack from "@/stacks/Root";
import { useAuthStore } from "@/store";
import { storage } from "@/store/storage";

import "./global.css";

function App() {
  const { isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    // 토큰 체크를 너무 중구난방으로 여기저기서 수행하니까 머리가 터질 것 같음

    // 앱 시작 시 MMKV 스토리지 초기화
    const initializeStorage = async () => {
      try {
        // MMKV 스토리지의 모든 키 확인
        const keys = storage.getAllKeys();
        console.log("앱 초기 스토리지 상태:", keys);

        // 인증 상태 확인
        await checkAuth();
      } catch (error) {
        console.error("스토리지 검사 실패:", error);
        // 초기화 실패 시 스토리지 초기화
        storage.clearAll();
        await checkAuth();
      }
    };

    initializeStorage();

    // 앱이 포그라운드로 돌아올 때마다 인증 상태 확인
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkAuth();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkAuth]);

  if (isLoading) {
    console.log("isLoading");
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <TruckkingLogo width={250} height={150} fill="" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <TanstackQueryProvider>
        <NavigationContainer>
          <SafeAreaProvider>
            <ThemeProvider>
              <RootStack />
            </ThemeProvider>
          </SafeAreaProvider>
        </NavigationContainer>
        <PortalHost />
        <Toast />
      </TanstackQueryProvider>
    </GestureHandlerRootView>
  );
}

export default App;
