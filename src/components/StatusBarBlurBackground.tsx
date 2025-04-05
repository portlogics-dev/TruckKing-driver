import type { BlurViewProps } from "@react-native-community/blur";
import { BlurView } from "@react-native-community/blur";
import { Platform } from "react-native";

const FALLBACK_COLOR = "rgba(140, 140, 140, 0.3)";

export const StatusBarBlurBackground = (props: BlurViewProps) => {
  if (Platform.OS !== "ios") return null;

  return (
    <BlurView
      className="absolute top-0 left-0 right-0 h-[StaticSafeAreaInsets.safeAreaInsetsTop]"
      blurType="light"
      blurAmount={10}
      reducedTransparencyFallbackColor={FALLBACK_COLOR}
      {...props}
    />
  );
};
