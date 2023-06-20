import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./client";

export const signInHandler = async (email, password) => {
  try {
    const res = await client.post('/sign-in',
      { email, password }
    );
    if (res.data.success) {
      const token = res.data.token
      await AsyncStorage.setItem('token', token)
      return res;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const logoutHandler = async () => {
  try {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      const res = await client.get('/sign-out', {
        headers: {
          authorization: `JWT ${token}`,
        }
      })
      console.log(res.data)
      if (res.data.success) {
        await AsyncStorage.removeItem('token')
        return true;
      }
    }
    return false;
  } catch (e) {
    console.log(e)
    return false;
  }
}