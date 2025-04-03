import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "@/screens/AuthStack/SignIn";
import SignUp from "@/screens/AuthStack/SignUp";
import { AuthStackParamList } from "@/type";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

export default AuthStack;
