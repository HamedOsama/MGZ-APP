import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import LoadingIndicator from '../Loading/LoadingIndicator';
import RouteCard from './RouteCard';
import AllStations from './AllStations';
import { useSelector } from 'react-redux';

const BottomPart = ({ show, children }) => {
  const animatedValue = useRef(new Animated.Value(1)).current;

  const startAnimation = (toValue) => {
    Animated.timing(animatedValue, {
      toValue,
      duration: 750,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    // startAnimation(show ? 0 : 1);
    startAnimation(0);
  }, [show]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
    extrapolate: 'clamp',
  });
  const stationsIsFetching = useSelector((state) => state.stations.fetching);
  // console.log(stationsIsFetching)
  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <View style={{ width: '100%', height: '100%' }}>
        {/* <TopBanner stop={stop} /> */}
        <View style={{ flex: 1, height: '100%', paddingBottom: 8 }}>
          <LoadingIndicator loading={stationsIsFetching} />
          <ScrollView style={{  height: '100%', width: '100%' }}>
            {/* <UpcomingArrivals /> */}
            <AllStations />
          </ScrollView>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: 350,
    bottom: 0,
    left: 0,
    position: 'absolute',
    zIndex: 100,
    backgroundColor: 'white',
  },
});

export default BottomPart;
