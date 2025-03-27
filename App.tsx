import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RootLayout from "./src/components/RootLayout";
import RootStack from "./src/stacks/Root";
import "./global.css";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount) => failureCount < 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error: Error, variables: unknown, context: unknown) =>
          console.log({ error, variables, context }),
      },
    },
  });

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <SafeAreaProvider>
            <RootLayout>
              <RootStack />
            </RootLayout>
          </SafeAreaProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
