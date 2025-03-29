import { getDefaultConfig, mergeConfig } from "@react-native/metro-config";
import { withNativeWind } from "nativewind/metro";

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = mergeConfig(getDefaultConfig(__dirname), {});

module.exports = withNativeWind(config, { input: "./global.css" });
