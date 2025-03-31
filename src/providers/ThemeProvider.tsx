import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

const NAV_THEME = {
  light: {
    background: "hsl(180 3% 98%)", // background
    border: "hsl(214.3 31.8% 91.4%)", // border
    card: "hsl(180 3% 98%)", // card
    notification: "hsl(0 84.2% 60.2%)", // destructive
    primary: "hsl(221.2 83.2% 53.3%)", // primary
    text: "hsl(222.2 84% 4.9%)", // foreground
  },
  dark: {
    background: "hsl(222.2 84% 4.9%)", // background
    border: "hsl(217.2 32.6% 17.5%)", // border
    card: "hsl(222.2 84% 4.9%)", // card
    notification: "hsl(0 62.8% 30.6%)", // destructive
    primary: "hsl(217.2 91.2% 59.8%)", // primary
    text: "hsl(210 40% 98%)", // foreground
  },
};

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const useIsomorphicLayoutEffect =
  Platform.OS === "web" ? useEffect : useLayoutEffect;

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasMounted = useRef(false);
  const { isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return;
    }

    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  });

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <NavigationThemeProvider
      value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
    >
      {children}
    </NavigationThemeProvider>
  );
}
