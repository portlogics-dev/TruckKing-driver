import { NavigationContainer } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import TruckkingLogo from "@/assets/truckking-logo.svg";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import RootStack from "@/stacks/Root";
import { useAuthStore } from "@/store";

import "./global.css";

function App() {
  const { isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    console.log("로딩 중...");
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
            <RootStack />
          </SafeAreaProvider>
        </NavigationContainer>
        <PortalHost />
        <Toast />
      </TanstackQueryProvider>
    </GestureHandlerRootView>
  );
}

export default App;
