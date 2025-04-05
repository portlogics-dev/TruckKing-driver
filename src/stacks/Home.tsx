import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Home } from "@/screens/HomeStack/Home";
import { HomeStackParamList } from "@/type";

import CameraStack from "./Camera";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CameraStack"
        component={CameraStack}
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
    </Stack.Navigator>
  );
}
