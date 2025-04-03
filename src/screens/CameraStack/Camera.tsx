import { useIsFocused } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import {
  Camera,
  CameraProps,
  Point,
  useCameraDevice,
  useCameraPermission,
  useLocationPermission,
} from "react-native-vision-camera";

import { MAX_ZOOM_FACTOR, SAFE_AREA_PADDING } from "@/constants/camera";
import { useIsForeground } from "@/hooks/useIsForeground";
import { ZapIcon, ZapOffIcon, MoonIcon, SunMoonIcon } from "@/lib/icons";
import { CameraStackScreenProps } from "@/type";

const ReanimatedCamera = Animated.createAnimatedComponent(Camera);
Animated.addWhitelistedNativeProps({
  zoom: true,
});

export function CameraScreen({ navigation }: CameraStackScreenProps<"Camera">) {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const cameraPermission = useCameraPermission();
  const location = useLocationPermission();

  useEffect(() => {
    location.requestPermission();
  }, [location]);

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const isPressingButton = useSharedValue(false);
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton]
  );

  const [flash, setFlash] = useState<"off" | "on">("off");
  const supportsFlash = device?.hasFlash ?? false;
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === "off" ? "on" : "off"));
  }, []);

  const [enableNightMode, setEnableNightMode] = useState(false);
  const canToggleNightMode = device?.supportsLowLightBoost ?? false;

  const zoom = useSharedValue(device?.neutralZoom ?? 1);
  const zoomOffset = useSharedValue(0);
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  if (!cameraPermission.hasPermission) {
    cameraPermission.requestPermission().then((permissionGranted) => {
      if (!permissionGranted) {
        navigation.navigate("Permission");
      }
    });
  }

  const focus = useCallback((point: Point) => {
    const c = camera.current;
    if (c === null) return;
    c.focus(point);
  }, []);

  const singleTap = Gesture.Tap().onEnd(({ x, y }) => {
    runOnJS(focus)({ x, y });
  });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate((event) => {
      if (!device) return;

      const z = zoomOffset.value * event.scale;
      zoom.value = interpolate(
        z,
        [1, 10],
        [device.minZoom, device.maxZoom],
        Extrapolation.CLAMP
      );
    });

  const takePhoto = async () => {
    try {
      if (camera.current === null) throw new Error("Camera ref is null.");
      console.log("Taking photo...");
      const photo = await camera.current.takePhoto({
        flash,
      });
      navigation.navigate("Preview", { path: photo.path });
    } catch (error) {
      console.error("Failed to take photo:", error);
    }
  };

  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(isPressingButton.value ? 1 : 0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ],
    }),
    [isPressingButton]
  );

  const PressCapture = Gesture.Tap()
    .enabled(isCameraInitialized && isActive)
    .shouldCancelWhenOutside(false)
    .onStart(async () => {
      try {
        await takePhoto();
      } finally {
        setTimeout(() => {
          isPressingButton.value = false;
          setIsPressingButton(false);
        }, 500);
      }
    });

  return (
    <View className="grow bg-foreground flex">
      {device ? (
        <GestureDetector gesture={Gesture.Exclusive(pinchGesture, singleTap)}>
          <ReanimatedCamera
            style={StyleSheet.absoluteFill}
            ref={camera}
            device={device}
            isActive={isActive}
            onInitialized={() => setIsCameraInitialized(true)}
            onError={(error) => {
              console.error("Camera error:", error);
              Toast.show({
                type: "error",
                text1: "Camera error",
                text2: error.message,
              });
            }}
            photo={true}
            photoQualityBalance="balanced"
            lowLightBoost={device.supportsLowLightBoost && enableNightMode}
            enableZoomGesture={false}
            animatedProps={cameraAnimatedProps}
            enableLocation={true}
          />
        </GestureDetector>
      ) : (
        <View className="grow justify-center items-center">
          <Text className="font-bold text-center text-white">
            Your phone does not have a Camera.
          </Text>
        </View>
      )}

      <GestureDetector gesture={PressCapture}>
        <Animated.View
          className="grow absolute self-center bottom-8 rounded-full bg-white size-16"
          style={shadowStyle}
        />
      </GestureDetector>

      <View style={styles.rightButtonRow}>
        {supportsFlash && (
          <TouchableOpacity
            className="justify-center items-center opacity-30 size-5 rounded bg-gray-400"
            onPress={onFlashPressed}
          >
            {flash ? (
              <ZapIcon className="size-6 text-white" />
            ) : (
              <ZapOffIcon className="size-6 text-white" />
            )}
          </TouchableOpacity>
        )}

        {canToggleNightMode && (
          <TouchableOpacity
            className="justify-center items-center opacity-30 size-5 rounded bg-gray-400/30"
            onPress={() => setEnableNightMode(!enableNightMode)}
          >
            {enableNightMode ? (
              <MoonIcon className="size-6 text-white" />
            ) : (
              <SunMoonIcon className="size-6 text-white" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rightButtonRow: {
    position: "absolute",
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
});
