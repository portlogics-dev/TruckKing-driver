import { View } from "react-native";

import TruckkingLogo from "@/assets/truckking-logo.svg";

export const SplashScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <TruckkingLogo width={250} height={150} fill="" />
    </View>
  );
};
