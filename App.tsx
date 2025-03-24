import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootStack from './src/stacks/Root';

function App(): JSX.Element {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: failureCount => failureCount < 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error: Error, variables: unknown, context: unknown) =>
          console.log({error, variables, context}),
      },
    },
  });

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <SafeAreaProvider>
            <RootStack />
          </SafeAreaProvider>
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
