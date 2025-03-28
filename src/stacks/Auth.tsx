import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignIn from "../screens/AuthStack/SignIn";
import SignUp from "../screens/AuthStack/SignUp";
import { AuthStackParamList } from "../type";

const Auth = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Auth.Navigator>
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="SignUp" component={SignUp} />
    </Auth.Navigator>
  );
};

export default AuthStack;
