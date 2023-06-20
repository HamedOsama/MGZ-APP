import { StyleSheet, Text, View, Animated, ScrollView } from 'react-native'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux';
import LoadingIndicator from '../Loading/LoadingIndicator';


const RouteSteps = () => {
  const {
    currentLine: currentStation,
    isLoading,
    fetching
  } = useSelector((state) => state.line);

  const organizedSteps = currentStation ? [
    currentStation?.start,
    ...currentStation?.way,
  ] : []
  const scrollY = useRef(new Animated.Value(0)).current;

  // const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  function printNormalizedTime(objects, index) {
    let totalMinutes = 0;
    for (let i = 0; i <= index; i++) {
      totalMinutes += objects[i].duration;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';

    const formattedTime = `${formattedHours}:${formattedMinutes} ${amPm}`;
    return formattedTime;
  }
  return (
    <View style={styles.view}>

      <View style={styles.container}>
        <View style={{ position: 'relative', width: '100%', marginTop: -16 }}>
          <LoadingIndicator loading={isLoading || fetching} />
        </View>
        <ScrollView
          style={{ height: '100%', width: '100%' }}
        >
          {
            !isLoading && !fetching && currentStation ?
              (<View style={{ flexDirection: 'row', padding: 20, gap: 16 }}>

                <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                  {
                    organizedSteps.map((step, index) => {
                      if (index === organizedSteps.length - 1)
                        return (
                          <React.Fragment key={index}>
                            <View
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 15,
                                backgroundColor: 'green',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <View style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff' }}></View>
                            </View>
                            <View
                              style={{
                                width: 4,
                                height: 24,
                                backgroundColor: 'green',
                                marginLeft: 10,
                                marginTop: -1,
                                marginBottom: -1,
                                flexGrow: 1,
                              }}>

                            </View>
                          </React.Fragment>
                        )
                      return (
                        <React.Fragment key={index}>
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 15,
                              backgroundColor: 'green',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#fff' }}></View>
                          </View>
                          <View
                            style={{
                              width: 4,
                              height: 24,
                              backgroundColor: 'green',
                              marginLeft: 10,
                              marginTop: -1,
                              marginBottom: -1,
                            }}></View>
                        </React.Fragment>

                      )
                    }
                    )
                  }
                </View>
                <View style={{ flex: 1, width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 16.5 }}>
                  {
                    organizedSteps.map((step, index) => {

                      return (
                        <View key={index} style={{ width: '100%', borderBottomColor: '#e5e5e5', borderBottomWidth: 1, paddingBottom: 12, flexDirection: 'row', gap: '8px' }}>
                          <Text style={{ fontSize: 14 , width : 190}} numberOfLines={1} ellipsizeMode='tail'>{step?.name}</Text>
                          <Text style={{ fontSize: 14 , color : 'gray'}} numberOfLines={1} >{printNormalizedTime(organizedSteps, index)}</Text>
                        </View>
                      )
                    })
                  }
                </View>

              </View>) : null
          }

        </ScrollView>
      </View>
    </View>
  )
}

export default RouteSteps

const styles = StyleSheet.create({
  view: {
    zIndex: 100,
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'left',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 1,
    zIndex: 100,
    width: '90%',
    height: 350,
    bottom: 50,
    left: '5%',
    position: 'absolute',
  },
})