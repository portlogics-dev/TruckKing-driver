import * as React from 'react';
import {
  View,
  useColorScheme,
  StatusBar,
  ScrollView,
  StyleSheet,
  Button,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Section from '../components/Section';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {RootStackParamList} from '../type';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type OrderHistoryProps = NativeStackScreenProps<
  RootStackParamList,
  'OrderHistory'
>;

export default function OrderHistory({navigation}: OrderHistoryProps) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Home Screen">
            <Button
              title="Go to Details"
              onPress={() => navigation.navigate('OrderHistory')}
            />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
