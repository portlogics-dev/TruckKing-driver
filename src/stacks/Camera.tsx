import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { CameraScreen } from "@/screens/CameraStack/Camera";
import { PermissionScreen } from "@/screens/CameraStack/Permission";
import { PreviewScreen } from "@/screens/CameraStack/Preview";
import { CameraStackParamList } from "@/type";

const Stack = createNativeStackNavigator<CameraStackParamList>();

const CameraStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: "dark",
        animationTypeForReplace: "push",
      }}
      initialRouteName={"Camera"}
    >
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Permission" component={PermissionScreen} />
      <Stack.Screen
        name="Preview"
        component={PreviewScreen}
        options={{
          animation: "none",
          presentation: "transparentModal",
        }}
      />
    </Stack.Navigator>
  );
};

export default CameraStack;
