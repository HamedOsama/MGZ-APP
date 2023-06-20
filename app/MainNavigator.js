import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AppForm from './components/AppForm';
import ImageUpload from './components/ImageUpload';
import UserProfile from './components/UserProfile';
import { useLogin } from './context/LoginProvider';
import DrawerNavigator from './DrawerNaviagtor';
import AppLoader from './components/AppLoader';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={AppForm} name='AppForm' />
      <Stack.Screen component={ImageUpload} name='ImageUpload' />
      <Stack.Screen component={DrawerNavigator} name='App' />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { isLoggedIn, loading } = useLogin();
  return isLoggedIn ?
    <>
      <DrawerNavigator />
      {loading ? <AppLoader /> : null}
    </>
    : <StackNavigator />;
};
export default MainNavigator;
