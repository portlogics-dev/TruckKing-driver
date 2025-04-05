module.exports = {
  presets: ["module:@react-native/babel-preset", "nativewind/babel"],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@": "./src",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
