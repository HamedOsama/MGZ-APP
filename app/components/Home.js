import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Map from './Map';
import BottomPart from './RouteDetails/BottomPart';
import { initializeApp } from '../utils/Locations';
import { useDispatch, useSelector } from 'react-redux';
import { setFetching, setStations } from '../features/StationsSlice';
import RouteSteps from './RouteDetails/RouteSteps';
import { IconButton } from 'react-native-paper';
import { reset } from '../features/LineSlice';

const Home = () => {
  const currentStation = useSelector((state) => state.line.currentLine);

  const dispatch = useDispatch();
  useEffect(() => {
    const LoadStations = () => {
      try {
        dispatch(setFetching(true));
        setTimeout(async () => {
          const stations = await initializeApp();
          dispatch(setStations({ stations }))
          dispatch(setFetching(false));
        }, 2000);
      } catch (e) {
        console.log(e)
      } finally {
      }

    }
    LoadStations();
  }, []);
  return (
    <View style={[styles.container]}>
      <Map />
      <BottomPart />
      {
        currentStation ? <RouteSteps /> : null
      }
      {
        currentStation ?
          <IconButton
            style={styles.closeBtn}
            icon="close"
            onPress={() => dispatch(reset())}
            shouldRasterizeIOS
            size={36}
            containerColor={'white'}
            iconColor='black'
          />
          : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 48,
    borderRadius: 8,
    zIndex: 1000,
  }
});

export default Home;
