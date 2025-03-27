import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../screens/Home";
import OrderHistory from "../screens/OrderHistory";
import Settings from "../screens/Settings";
import { RootStackParamList } from "../type";

const Root = createNativeStackNavigator<RootStackParamList, "RootStack">();

const RootStack = () => {
  return (
    <Root.Navigator initialRouteName="Home" id="RootStack">
      <Root.Screen name="Home" component={Home} />
      <Root.Screen name="OrderHistory" component={OrderHistory} />
      <Root.Screen name="Settings" component={Settings} />
    </Root.Navigator>
  );
};

export default RootStack;
