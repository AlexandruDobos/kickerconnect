import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ConfirmEmail from './pages/ConfirmEmail';
import AvailableEventsModal from './components/AvailableEventsModal';

import { TextDecoder, TextEncoder } from 'text-encoding';
global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;

const Stack = createStackNavigator();
import { UserProvider } from './context/UserContext';
import { EventProvider } from './context/EventContext';
import ResetPasswordModal from './components/ResetPasswordModal';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SideMenu from './components/SideMenu';
const customFonts = {
  'MaterialSymbolsOutlined': require('./assets/fonts/MaterialSymbolsOutlined.ttf'),
};

export default function App() {
  const [loaded] = useFonts(customFonts);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  if (!loaded) {
    return null;
  }

  const linking = {
    prefixes: ['http://localhost:19006'],
    config: {
      screens: {
        ResetPasswordPage: 'reset-password',
      },
    },
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <UserProvider>
          <EventProvider>
            <NavigationContainer linking={linking}>
              <Stack.Navigator>
                <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} />
                <Stack.Screen name="RegisterPage" component={RegisterPage} options={{ headerShown: false }} />
                <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
                <Stack.Screen name="GroupsPage" component={GroupsPage} options={{ headerShown: false }} />
                <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} />
                <Stack.Screen name="ResetPasswordPage" component={ResetPasswordPage} />
                <Stack.Screen name="AvailableEventsModal" component={AvailableEventsModal} />
              </Stack.Navigator>
            </NavigationContainer>
          </EventProvider>
        </UserProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Poți schimba această culoare dacă dorești
  },
  menuButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignSelf: 'flex-start',
    margin: 10,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontFamily: 'MaterialSymbolsOutlined',
    fontSize: 24,
  },
});
