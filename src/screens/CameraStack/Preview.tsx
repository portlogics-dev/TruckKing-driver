import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";

import { StatusBarBlurBackground } from "@/components/StatusBarBlurBackground";
import { SAFE_AREA_PADDING } from "@/constants/camera";
import { CircleXIcon, DownloadIcon, CircleCheckIcon } from "@/lib/icons";
import { CameraStackScreenProps } from "@/type";

const requestSavePermission = async (): Promise<boolean> => {
  // On Android 13 and above, scoped storage is used instead and no permission is needed
  if (Platform.OS !== "android" || Platform.Version >= 33) return true;

  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  if (permission == null) return false;
  let hasPermission = await PermissionsAndroid.check(permission);
  if (!hasPermission) {
    const permissionRequestResult =
      await PermissionsAndroid.request(permission);
    hasPermission = permissionRequestResult === "granted";
  }
  return hasPermission;
};

export function PreviewScreen({
  navigation,
  route,
}: CameraStackScreenProps<"Preview">) {
  const { path } = route.params;
  const [savingState, setSavingState] = useState<"none" | "saving" | "saved">(
    "none"
  );

  const onSavePressed = useCallback(async () => {
    try {
      setSavingState("saving");

      const hasPermission = await requestSavePermission();
      if (!hasPermission) {
        Alert.alert(
          "Permission denied!",
          "Vision Camera does not have permission to save the media to your camera roll."
        );
        return;
      }
      await CameraRoll.saveAsset(`file://${path}`, {
        type: "photo",
      });
      setSavingState("saved");
    } catch (e) {
      const message = e instanceof Error ? e.message : JSON.stringify(e);
      setSavingState("none");
      Alert.alert(
        "Failed to save!",
        `An unexpected error occurred while trying to save your photo. ${message}`
      );
    }
  }, [path]);

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);

  return (
    <View className="grow justify-center items-center bg-background">
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.closeButton} onPress={navigation.goBack}>
        <CircleXIcon className="size-8 text-white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSavePressed}
        disabled={savingState !== "none"}
      >
        {savingState === "none" && (
          <DownloadIcon className="size-8 text-white" />
        )}
        {savingState === "saved" && (
          <CircleCheckIcon className="size-8 text-white" />
        )}
        {savingState === "saving" && <ActivityIndicator color="white" />}
      </TouchableOpacity>

      <StatusBarBlurBackground />
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: SAFE_AREA_PADDING.paddingTop,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
  saveButton: {
    position: "absolute",
    bottom: SAFE_AREA_PADDING.paddingBottom,
    left: SAFE_AREA_PADDING.paddingLeft,
    width: 40,
    height: 40,
  },
});
