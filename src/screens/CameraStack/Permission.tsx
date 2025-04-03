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

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  useEffect(() => {
    if (cameraPermissionStatus === "granted") navigation.navigate("Camera");
  }, [cameraPermissionStatus, navigation]);

  return (
    <View className="grow bg-black">
      <Text className="text-white">{t("Report")}</Text>
      <View className="grow">
        {cameraPermissionStatus !== "granted" && (
          <View>
            <Text className="text-white text-center">
              {t("Report feature needs Camera permission.")}
            </Text>
            <Button variant="link" onPress={requestCameraPermission}>
              <Text className="text-white">{t("Grant")}</Text>
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
