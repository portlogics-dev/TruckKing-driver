import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuthStore } from "@/store";
import { RootStackParamList } from "@/type";

import AuthStack from "./Auth";
import MainStack from "./Main";

const Root = createNativeStackNavigator<RootStackParamList, "RootStack">();

// TODO: pretendard font
const RootStack = () => {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);
  return (
    <Root.Navigator id="RootStack">
      {isSignedIn ? (
        <Root.Screen
          name="MainStack"
          component={MainStack}
          options={{ headerShown: false }}
        />
      ) : (
        <Root.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      )}
    </Root.Navigator>
  );
};

export default RootStack;
