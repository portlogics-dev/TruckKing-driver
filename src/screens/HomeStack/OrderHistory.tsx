import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StatusBar, ScrollView, Button } from "react-native";
import { Colors, Header } from "react-native/Libraries/NewAppScreen";
import { SafeAreaView } from "react-native-safe-area-context";

import Section from "../../components/Section";
import { useColorScheme } from "../../hooks/useColorScheme";
import { MainStackParamList } from "../../type";

type OrderHistoryProps = NativeStackScreenProps<
  MainStackParamList,
  "OrderHistory"
>;

export default function OrderHistory({ navigation }: OrderHistoryProps) {
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
        >
          <Section title="Home Screen">
            <Button
              title="Go to Details"
              onPress={() => navigation.navigate("OrderHistory")}
            />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
