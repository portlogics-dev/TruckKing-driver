import { View, StatusBar, ScrollView } from "react-native";
import { Colors, Header } from "react-native/Libraries/NewAppScreen";
import { SafeAreaView } from "react-native-safe-area-context";

import { useColorScheme } from "../../hooks/useColorScheme";

export default function Settings() {
  const { isDarkColorScheme } = useColorScheme();

  const backgroundStyle = {
    backgroundColor: isDarkColorScheme ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkColorScheme ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <View
          style={{
            backgroundColor: isDarkColorScheme ? Colors.black : Colors.white,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
