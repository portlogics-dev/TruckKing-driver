import { useCallback, useEffect, useState } from "react";
import { Linking, Text, View } from "react-native";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { CameraStackScreenProps } from "@/type";

export function PermissionScreen({
  navigation,
}: CameraStackScreenProps<"Permission">) {
  const { t } = useI18n();
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const checkPermissions = useCallback(async () => {
    const cameraPermission = Camera.getCameraPermissionStatus();
    const locationPermission = Camera.getLocationPermissionStatus();

    if (cameraPermission === "granted" && locationPermission === "granted") {
      setCameraPermissionStatus("granted");
    } else {
      setCameraPermissionStatus("restricted");
    }
  }, []);

  const requestCameraPermission = useCallback(async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const locationPermission = await Camera.requestLocationPermission();

    if (cameraPermission !== "granted" || locationPermission !== "granted") {
      await Linking.openSettings();
      // 설정 앱에서 돌아온 후 권한 상태를 다시 확인
      setTimeout(checkPermissions, 1000);
    } else {
      setCameraPermissionStatus("granted");
    }
  }, [checkPermissions]);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  useEffect(() => {
    if (cameraPermissionStatus === "granted") navigation.goBack();
  }, [cameraPermissionStatus, navigation]);

  return (
    <View className="grow bg-black">
      <Text className="text-white text-2xl font-bold">{t("Report")}</Text>
      <View className="grow justify-center">
        {cameraPermissionStatus !== "granted" && (
          <View className="grow justify-center items-center gap-8">
            <Text className="text-white text-center">
              {t("Report feature needs Camera permission.")}
            </Text>
            <Button onPress={requestCameraPermission}>
              <Text className="text-white">{t("Grant")}</Text>
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
