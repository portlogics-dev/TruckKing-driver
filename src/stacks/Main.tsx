import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { HouseIcon, TruckIcon, UserIcon } from "../lib/icons";
import Home from "../screens/HomeStack/Home";
import OrderHistory from "../screens/HomeStack/OrderHistory";
import Settings from "../screens/HomeStack/Settings";
import { MainStackParamList } from "../type";

const BottomTab = createBottomTabNavigator<MainStackParamList, "MainStack">();

const MainStack = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      id="MainStack"
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: HouseIcon,
        }}
      />
      <BottomTab.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{ tabBarIcon: TruckIcon }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{ tabBarIcon: UserIcon }}
      />
    </BottomTab.Navigator>
  );
};

export default MainStack;
