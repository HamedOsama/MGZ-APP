import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import RouteCard from './RouteCard';
import { setCurrentLine, setFetching, setIsLoading } from '../../features/LineSlice';

const AllStations = () => {
  const currentStations = useSelector((state) => state.stations.stations);
  const dispatch = useDispatch();
  const fromToHelperFun = (from, to) => {
    return `${from} - ${to}`
  }
  return (
    <>
      {
        currentStations?.map((station) => (
          <RouteCard
            key={station?.lineName}
            line={station?.lineName}
            FromTo={fromToHelperFun(station?.start?.name, station?.end?.name)}
            bg={station?.color}
            onClick={() => {
              dispatch(setIsLoading(true));
              dispatch(setCurrentLine({
                line: station,
              }))
            }}
          />
        )
        )}
    </>
  )
}

export default AllStations

const styles = StyleSheet.create({})