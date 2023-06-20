import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentLine: null,
  fetching: false,
  isLoading: false,
  calculatingTime: false,
  completed: false,
}

export const LineSlice = createSlice({
  name: 'Line',
  initialState,
  reducers: {
    setCurrentLine: (state, action) => {
      state.currentLine = action?.payload?.line;
    },
    setCurrentLineWay: (state, action) => {
      state.currentLine = action?.payload?.line;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action?.payload;
    },
    setFetching: (state, action) => {
      state.fetching = action?.payload;
    },
    setCalculatingTime: (state, action) => {
      state.calculatingTime = action?.payload;
    },
    setCompleted: (state, action) => {
      state.completed = action?.payload;
    },
    reset: (state) => {
      state.currentLine = null;
      state.completed = false;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentLine, reset, setIsLoading, setFetching, setCalculatingTime, setCompleted } = LineSlice.actions

export const lineReducer = LineSlice.reducer