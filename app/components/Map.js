import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import MapView, { Circle, Marker } from 'react-native-maps'
import * as Location from 'expo-location';
import { GOOGLE_MAP_API_KEY } from '@env'
import MapViewDirections from 'react-native-maps-directions';
import images from '../utils/images';
import { getLocation, initializeApp } from '../utils/Locations';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCalculatingTime, setCurrentLine, setFetching, setIsLoading, setCompleted } from '../features/LineSlice';
import { rearrangeArray } from '../utils/helper';



const Map = () => {
  Location.setGoogleApiKey(GOOGLE_MAP_API_KEY);
  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const [optimizeWaypoints, setOptimizeWaypoints] = useState([]);
  const [nearestStation, setNearestStation] = useState(null);
  // const [optimizing, setOptimizing] = useState(false);

  const {
    currentLine: currentStation,
    isLoading,
    fetching,
    calculatingTime,
    completed
  } = useSelector((state) => state.line);

  const [userLocation, setUserLocation] = useState({
    latitude: 29.8470,
    longitude: 31.3442
  });
  const destination = { latitude: 30.0444, longitude: 31.2357 };


  const calculateDuration = async (start, waypointsArr) => {
    dispatch(setCalculatingTime(true));
    try {
      const durationsReq = []
      durationsReq.push(axios
        .get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${waypointsArr[0].latitude},${waypointsArr[0].longitude}&key=${GOOGLE_MAP_API_KEY}`
        ))
      waypointsArr.forEach((el, i) => {
        if (i === waypointsArr.length - 1)
          return;
        durationsReq.push(axios
          .get(
            `https://maps.googleapis.com/maps/api/directions/json?origin=${waypointsArr[i].latitude},${waypointsArr[i].longitude}&destination=${waypointsArr[i + 1]?.latitude},${waypointsArr[i + 1]?.longitude}&key=${GOOGLE_MAP_API_KEY}`
          ))
      })
      const durationsRes = await Promise.all(durationsReq)
      const durations = durationsRes.map((el, i) => {
        return {
          ...waypointsArr[i],
          duration: Math.ceil(el?.data?.routes[0]?.legs[0]?.duration?.value / 60)
        }
      }
      )
      // dispatch(
      //   setCurrentLine({
      //     line: {
      //       ...currentStation,
      //       way: durations
      //     }
      //   })
      // )
      // console.log('durations', durations)
      dispatch(setCalculatingTime(false));
      return durations
    } catch (e) {
      console.log(e)
    }
  }

  // I will pass to this function user current location and the array of stations
  // and it will return the nearest station to the user
  const getNearestStation = (stations) => {
    const nearestStation = stations.reduce((prev, curr) => {
      const prevDistance = Math.sqrt(Math.pow(prev.latitude - userLocation.latitude, 2) + Math.pow(prev.longitude - userLocation.longitude, 2))
      const currDistance = Math.sqrt(Math.pow(curr.latitude - userLocation.latitude, 2) + Math.pow(curr.longitude - userLocation.longitude, 2))
      return prevDistance < currDistance ? prev : curr
    }, stations[0])
    setNearestStation(nearestStation)
  }

  useEffect(() => {
    const getPermissions = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log("Please grant location permissions");
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        mapRef?.current?.fitToCoordinates([userLocation, destination], {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } catch (e) {
        console.log(e)
      }
    };
    getPermissions();

    // const geocode = async () => {
    //   const locations = ['المؤسسه شبرا الخيمة', 'asdasdasdasd', 'الشارع الجديد محمود عبد الجليل، بهتيم، قسم ثان شبرا الخيمة', 'مسطرد', 'El marg', 'السلام و العاشر', 'مصنع جريش للزجاج العاشر من رمضان']
    //   const asyncLocations = locations.map(el => Location.geocodeAsync(el))
    //   const resLocations = await Promise.all(asyncLocations)
    //   const formattedLocation = resLocations.map((el, i) => {
    //     return {
    //       latitude: el[0]?.latitude,
    //       longitude: el[0]?.longitude,
    //       name: locations[i]
    //     }
    //   })
    //   const filteredLocations = formattedLocation.filter(el => el.latitude && el.longitude)

    //   setLocations(prev =>
    //     [...prev, ...filteredLocations]
    //   )

    //   // const deo = await Location.geocodeAsync('حلوان');
    //   // console.log("Geocoded Address:");
    //   // console.log(resLocations);
    // };
    // geocode()

    // const getLocations = async () => {
    // initializeApp()
    // }

  }, []);

  useEffect(() => {
    if (currentStation && !isLoading && !fetching && !calculatingTime && nearestStation) {
      // const coordinates = [
      //   { latitude: currentStation?.start?.latitude, longitude: currentStation?.start?.longitude },
      //   ...currentStation?.way,
      // ];

      const coordinates = [
        { latitude: nearestStation?.latitude, longitude: nearestStation?.longitude },
        { latitude: userLocation?.latitude, longitude: userLocation?.longitude },
      ]
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 450, left: 50 },
        animated: true,
      });

    }
  }, [currentStation, isLoading, fetching, calculatingTime, nearestStation]);

  const fetchData = async () => {
    if (optimizeWaypoints.length > 0 && isLoading === true) {
      const newWay = await calculateDuration(currentStation?.start, optimizeWaypoints);
      getNearestStation(
        [...optimizeWaypoints, currentStation?.start]
      )
      dispatch(
        setCurrentLine({
          line: {
            ...currentStation,
            start: {
              ...currentStation?.start,
              duration: 420
            },
            way: newWay
          }
        })
      )
      // console.log('newWay', newWay)
      dispatch(setIsLoading(false))
      dispatch(setFetching(false))
      dispatch(setCompleted(true))

      setOptimizeWaypoints([])
    }
  }
  useEffect(() => {
    if (optimizeWaypoints.length > 0) {
      fetchData()
      console.log('fetching data')
    }
  }, [optimizeWaypoints])


  return (
    <MapView
      onRe
      ref={mapRef}
      style={{ width: '100%', height: '100%' }}
      initialRegion={{
        latitudeDelta: 10,
        longitudeDelta: 10,
      }}
      showsUserLocation={true}
      userLocationPriority="high"
      followsUserLocation={userLocation?.latitude ? false : true}
      // userLocationCalloutEnabled={true}
      showsMyLocationButton={true}
    >
      {
        currentStation && nearestStation && !fetching && !isLoading ?
          <MapViewDirections
            origin={{ latitude: userLocation?.latitude, longitude: userLocation?.longitude }}
            destination={{ latitude: nearestStation?.latitude, longitude: nearestStation?.longitude }}
            apikey={GOOGLE_MAP_API_KEY}
            strokeWidth={5}
            language='ar'
            timePrecision='now'
            geodesic={true}
            precision='high'
            strokeColor="hotpink"
          />
          : null
      }
      {
        currentStation ?
          <MapViewDirections
            origin={{ latitude: currentStation?.start?.latitude, longitude: currentStation?.start?.longitude }}
            destination={{ latitude: currentStation?.end?.latitude, longitude: currentStation?.end?.longitude }}
            waypoints={
              currentStation?.way.slice(0, -1).map(el => {
                return { latitude: el.latitude, longitude: el.longitude }
              })
            }
            apikey={GOOGLE_MAP_API_KEY}
            strokeWidth={5}
            language='ar'
            resetOnChange={true}
            optimizeWaypoints={true}
            timePrecision='now'
            geodesic={true}
            precision='high'
            onReady={(result) => {
              if (!isLoading)
                return;
              const { waypointOrder } = result;
              const newWaypoints = rearrangeArray(currentStation?.way, waypointOrder?.flat())
              setOptimizeWaypoints([...newWaypoints, currentStation?.end])
              // setOptimizeWaypoints([...currentStation.way, currentStation?.end])
            }
            }
          /> : null
      }

      {
        currentStation?.start && !fetching && !isLoading ?
          <Marker
            coordinate={{ latitude: currentStation?.start?.latitude, longitude: currentStation?.start?.longitude }}
            title={currentStation?.start?.name}
            image={images.currentLocation}
          /> : null
      }
      {
        currentStation?.way?.length > 0 && !fetching && !isLoading ? currentStation.way.map((el, i) => {
          return (
            <Marker
              key={i}
              coordinate={{ latitude: el.latitude, longitude: el.longitude }}
              title={el.name}
              image={images.currentLocation}
            />
          )
        }) : null
      }
    </MapView>

  )
}

export default Map

const styles = StyleSheet.create({})