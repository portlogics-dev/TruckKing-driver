import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { LucideIcon } from "lucide-react-native";
import { Animated } from "react-native";

import { useI18n } from "@/i18n";
import { HouseIcon, TruckIcon, UserIcon } from "@/lib/icons";
import Home from "@/screens/HomeStack/Home";
import OrderHistory from "@/screens/HomeStack/OrderHistory";
import Settings from "@/screens/HomeStack/Settings";
import { MainStackParamList } from "@/type";

const BottomTab = createBottomTabNavigator<MainStackParamList, "MainStack">();

const renderIcon =
  (Icon: LucideIcon) =>
  ({ focused }: { focused: boolean }) => {
    const scale = new Animated.Value(focused ? 1.1 : 1);
    const opacity = new Animated.Value(focused ? 1 : 0.7);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    return (
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Icon
          strokeWidth={focused ? 2 : 1.25}
          className={focused ? "font-bold" : "font-thin"}
        />
      </Animated.View>
    );
  };

const MainStack = () => {
  const { t } = useI18n();
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      id="MainStack"
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{ tabBarIcon: renderIcon(HouseIcon), tabBarLabel: t("Home") }}
      />
      <BottomTab.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          tabBarIcon: renderIcon(TruckIcon),
          tabBarLabel: t("Order History"),
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: renderIcon(UserIcon),
          tabBarLabel: t("Settings"),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default MainStack;
