import { StyleSheet, Text, View, Animated, Easing } from 'react-native'
import React, { useEffect, useState } from 'react'
import LottieView from 'lottie-react-native';

const AppLoader = () => {
  // spin animation
  const spinValue = new Animated.Value(0)

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start()
  }, [])

  // 
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView
        style
        source={require('../../assets/loading.json')}
        progress={spinValue}
        renderMode={'SOFTWARE'}
      />
    </View>
  )
}

export default AppLoader

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 1
  }
})