import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RootLayout from "@/components/RootLayout";
import { useAuthStore } from "@/store";
import { RootStackParamList } from "@/type";

import AuthStack from "./Auth";
import MainStack from "./Main";

const Stack = createNativeStackNavigator<RootStackParamList, "RootStack">();

const RootStack = () => {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  return (
    <RootLayout>
      <Stack.Navigator id="RootStack">
        {isSignedIn ? (
          <Stack.Screen
            name="MainStack"
            component={MainStack}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </RootLayout>
  );
};

export default RootStack;
