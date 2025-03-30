import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import { NAV_THEME } from "@/constants/nav-theme";
import { useColorScheme } from "@/hooks/useColorScheme";

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
