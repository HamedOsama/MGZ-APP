import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  stations: [],
  fetching: false,
  error: null,
}

export const StationsSlice = createSlice({
  name: 'Stations',
  initialState,
  reducers: {
    setStations: (state, action) => {
      state.stations = action?.payload?.stations;
    },
    setFetching: (state, action) => {
      state.fetching = action?.payload;
    },
    setError: (state, action) => {
      state.error = action?.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setStations, setFetching, setError } = StationsSlice.actions

export const stationsReducer = StationsSlice.reducer