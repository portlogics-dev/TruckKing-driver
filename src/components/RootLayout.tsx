import React from "react";
import { StatusBar, View } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkColorScheme ? "dark-content" : "light-content"}
      />
      <View className="flex-1">{children}</View>
    </>
  );
}
