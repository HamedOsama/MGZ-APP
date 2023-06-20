import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';

import LoginProvider from './app/context/LoginProvider'
import MainNavigator from './app/MainNavigator';
import { store } from './app/store/store';
import { Provider } from 'react-redux'

export default function App() {
  return (
    <Provider store={store}>
      <LoginProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
        <StatusBar style="auto" />
      </LoginProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
