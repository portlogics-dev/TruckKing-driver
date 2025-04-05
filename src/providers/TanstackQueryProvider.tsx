import { addEventListener } from "@react-native-community/netinfo";
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { AppState } from "react-native";
import { DevToolsBubble } from "react-native-react-query-devtools";

export default function TanstackQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount) => failureCount < 1,
        staleTime: 1000 * 60 * 2, // 2 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        onSuccess: (data, variables, context) => {
          console.log("fetch success:", { data, variables, context });
        },
        onError: (error: Error, variables: unknown) =>
          console.log("fetch failed:", { error, variables }),
      },
    },
  });

  useEffect(() => {
    // refetch on app focus
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("App state changed:", nextAppState);
      if (nextAppState === "active") {
        focusManager.setFocused(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // React Query already supports auto refetch on reconnect in web browser.
  // To add this behavior in React Native you have to use React Query onlineManager as in the example below:
  onlineManager.setEventListener((setOnline) => {
    return addEventListener((state) => {
      console.log("Network state changed:", state);
      setOnline(!!state.isConnected);
    });
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <DevToolsBubble />
    </QueryClientProvider>
  );
}
