import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StackActions } from '@react-navigation/native';

import client from '../api/client';
import UploadProgress from './UploadProgress';
import { useLogin } from '../context/LoginProvider';

const ImageUpload = props => {
  const [profileImage, setProfileImage] = useState('');
  const [progress, setProgress] = useState(0);
  const { token } = props.route.params;
  const { setProfile } = useLogin();

  const openImageLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }

    if (status === 'granted') {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!response.canceled) {
        setProfileImage(response.assets[0].uri);
      }
    }
  };

  const uploadProfileImage = async () => {
    const formData = new FormData();
    formData.append('profile', {
      name: new Date() + '_profile',
      uri: profileImage,
      type: 'image/jpg',
    });

    try {
      const res = await client.post('/upload-profile', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          authorization: `JWT ${token}`,
        },
        onUploadProgress: progressEvent => {
          const { loaded, total } = progressEvent;
          setProgress(loaded / total);
        }
      });

      if (res.data.success) {
        console.log('data', res.data)
        console.log('user', res.data.user)
        setProfile(res.data.user);
        props.navigation.dispatch(StackActions.replace('App'));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const skipUpload = () => {
    props.navigation.dispatch(StackActions.replace('App'));
  };
  return (
    <>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={openImageLibrary}
            style={styles.uploadBtnContainer}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Text style={styles.uploadBtn}>Upload Profile Image</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.skip} onPress={skipUpload}>Skip</Text>
          {profileImage ? (
            <Text
              onPress={uploadProfileImage}
              style={[
                styles.skip,
                { backgroundColor: 'green', color: 'white', borderRadius: 8 },
              ]}
            >
              Upload
            </Text>
          ) : null}
        </View>
      </View>
      {
        progress ? <UploadProgress progress={progress} /> : null
      }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtnContainer: {
    height: 125,
    width: 125,
    borderRadius: 125 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    overflow: 'hidden',
  },
  uploadBtn: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.3,
    fontWeight: 'bold',
  },
  skip: {
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.5,
  },
});

export default ImageUpload;
