import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import RootStack from "@/stacks/Root";
import { useAuthStore } from "@/store";

import "./global.css";

function App() {
  const { isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#0000ff" />
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
        <Toast />
      </TanstackQueryProvider>
    </GestureHandlerRootView>
  );
}

export default App;
