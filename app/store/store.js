import { configureStore } from '@reduxjs/toolkit'
import { lineReducer } from '../features/LineSlice'
import { stationsReducer } from '../features/StationsSlice'

export const store = configureStore({
  reducer: {
    line : lineReducer,
    stations : stationsReducer
  },
})