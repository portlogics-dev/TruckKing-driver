import React from "react";
import { StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar
        barStyle={isDarkColorScheme ? "dark-content" : "light-content"}
      />
      <View
        className="flex-1 px-6"
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          // paddingLeft: insets.left,
          // paddingRight: insets.right,
        }}
      >
        {children}
      </View>
    </>
  );
}
