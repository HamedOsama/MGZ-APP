import * as L from 'expo-location';
import client from '../api/client';

// export const locations = [
//   {
//     lineName: 'المؤسسه شبرا الخيمة',
//     start: {
//       name: 'الشركة',
//       latitude: 30.05739932130038,
//       longitude: 31.19373297592501,
//     },
//     end: 'مصنع جريش للزجاج العاشر من رمضان',
//     way: [
//       'المؤسسه شبرا الخيمة',
//       'الشارع الجديد محمود عبد الجليل، بهتيم، قسم ثان شبرا الخيمة',
//       'مسطرد',
//       'El marg',
//       'السلام و العاشر',
//       'مصنع جريش للزجاج العاشر من رمضان'
//     ],
//     color: '#1b263b'
//   },
//   {
//     lineName: 'العاشر 1',
//     start: {
//       name: 'الشركة',
//       latitude: 30.05739932130038,
//       longitude: 31.19373297592501
//     },
//     end: 'مصنع جريش للزجاج العاشر من رمضان',
//     way: [
//       'حلوان',
//       'المعادي',
//       'مدنية نصر',
//       'زهراء مدينة نصر',
//       'التجمع الخامس',
//       'مصنع جريش للزجاج العاشر من رمضان'
//     ],
//     color: '#ee6c4d'
//   },
// ]

export const getLocation = async (location) => {
  try {
    const asyncLocations = location.map(el => L.geocodeAsync(el))
    const resLocations = await Promise.all(asyncLocations)
    const formattedLocation = resLocations.map((el, i) => {
      return {
        latitude: el[0]?.latitude,
        longitude: el[0]?.longitude,
        name: location[i],
      }
    })
    const filteredLocations = formattedLocation.filter(el => el.latitude && el.longitude)
    return filteredLocations
  } catch (e) {
    console.log(e)
    return e
  }
}

export const initializeApp = async () => {
  try {
    const req = await client.get('/api/v1/stations');
    const data = req.data.data
    const locations = data.map(el => {
      return {
        ...el,
        way : [
          ...el.way,
          el.end
        ]

      }
    })
    const appLocations = []
    for (const el of locations) {
      const way = await getLocation(el.way)
      appLocations.push({
        ...el,
        way,
        end: way[way.length - 1]
      })
    }
    return appLocations
  } catch (e) {
    console.log(e)
    return e
  }
}


