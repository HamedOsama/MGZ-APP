import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';
import AppLoader from '../components/AppLoader';

const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token)
      if (token) {
        const res = await client.get('/profile', {
          headers: {
            authorization: `JWT ${token}`,
          },
        });
        if (res.data.success) {
          setProfile(res.data.user);
          setIsLoggedIn(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFirstLoad(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, profile, setProfile, loading, setLoading }}
    >
      {firstLoad ? <AppLoader /> : children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);

export default LoginProvider;
