import * as React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { cn } from "@/lib/utils/cn";

const duration = 1000;

function Skeleton({
  className,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof Animated.View>, "style">) {
  const sv = useSharedValue(1);

  React.useEffect(() => {
    sv.value = withRepeat(
      withSequence(withTiming(0.75, { duration }), withTiming(1, { duration })),
      -1
    );
  }, [sv]);

  const style = useAnimatedStyle(() => ({
    opacity: sv.value,
  }));

  return (
    <Animated.View
      style={style}
      className={cn("rounded bg-muted dark:bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
