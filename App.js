import React from 'react';
import { AuthProvider } from './services/authContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './navigation/MainNavigator';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <PaperProvider>
            <NavigationContainer>
              <MainNavigator />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
