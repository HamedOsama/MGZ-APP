import { Button, StyleSheet, Text, Touchable, TouchableWithoutFeedback, View, } from 'react-native'
import React from 'react'

const RouteCard = ({ line, FromTo, bg, onClick }) => {
  return (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={[styles.container, { backgroundColor: bg }]} >
        <Text style={styles.title}>{line}</Text>
        <Text style={styles.way}>{FromTo}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default RouteCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
  },
  way: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'right',
  }
})